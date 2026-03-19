import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import { GAME_LIST } from "@/services/gameService";
import { GameButton } from "@/components/GameButton";

const API_BASE = "https://backend-ledger-0ra6.onrender.com";
const CACHE_KEY = "bet_records_cache";

const loadCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const saveCache = (data: { items: BetItem[]; total: number; page: number }) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
};

interface BetItem {
  _id: string;
  site?: string;
  gameId: string;
  betTime: string;
  bet: number;
  payout?: number;
}

const BetRecords = () => {
  const cached = loadCache();
  const [items, setItems] = useState<BetItem[]>(cached?.items || []);
  const [loading, setLoading] = useState(!cached);
  const [page, setPage] = useState(cached?.page || 1);
  const [total, setTotal] = useState(cached?.total || 0);
  const limit = 15;

  const fetchBets = async (p: number) => {
    // Only show full loader if we have NO items at all
    if (items.length === 0) setLoading(true);
    
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/game/bets?page=${p}&limit=${limit}&site=JE&status=1`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (data.status === "success") {
        const newItems = data.items || [];
        const newTotal = data.total || 0;
        setItems(newItems);
        setTotal(newTotal);
        saveCache({ items: newItems, total: newTotal, page: p });
      }
    } catch {
      // silent
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBets(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col pb-32" style={{ background: "linear-gradient(180deg, #320913 43%, #41131e 100%)" }}>
      {/* Header with fixed height to prevent shrinking */}
      <div className="h-11 flex-shrink-0 sticky top-0 z-50">
        <PageHeader title="Game Records" />
      </div>

      {/* Content Container */}
      <div className="flex-1 px-4 py-4">
        {loading && items.length === 0 ? (
          <Loader label="Loading records..." />
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No bet records found</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const profit = (item.payout ?? 0) - item.bet;
              const hasPayout = item.payout !== undefined;
              const isWin = hasPayout && profit > 0;
              const isLoss = hasPayout && profit < 0;
              const date = new Date(item.betTime);
              const dateStr = `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
              
              // Find game name and logo from GAME_LIST using gameId
              const gameObj = GAME_LIST.find(g => String(g.game_id) === String(item.gameId));
              const gameName = gameObj ? gameObj.name : `Game ${item.gameId}`;
              const gameLogo = gameObj ? gameObj.logo : "";

              return (
                <div
                  key={item._id}
                  className="rounded-xl px-4 py-3 shadow-lg relative overflow-hidden"
                  style={{ backgroundColor: "rgba(120, 20, 40, 0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-yellow-400 font-bold text-base">{gameName}</span>
                      {hasPayout && (
                        <span className={`font-bold text-lg ${isWin ? "text-green-500" : isLoss ? "text-red-500" : "text-gray-300"}`}>
                          {profit > 0 ? "+" : ""}{profit.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {gameLogo && (
                      <img 
                        src={gameLogo} 
                        alt={gameName} 
                        className="w-12 h-12 object-cover rounded-lg shadow-md border border-white/10"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <div className="flex flex-col">
                       <span className="text-green-500 font-bold text-sm">{item.bet.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-yellow-400 text-xs">{dateStr}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && total > limit && (
          <div className="flex items-center justify-center gap-3 py-6 mt-4">
            <GameButton
              variant="mute"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo(0, 0);
              }}
            >
              Previous
            </GameButton>
            <span className="text-white/60 text-xs font-medium">Page {page}</span>
            <GameButton
              variant="mute"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo(0, 0);
              }}
            >
              Next
            </GameButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetRecords;
