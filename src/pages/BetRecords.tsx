import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import { GAME_LIST } from "@/services/gameService";

const API_BASE = "https://backend-ledger-0ra6.onrender.com";

interface BetItem {
  _id: string;
  site?: string;
  gameId: string;
  betTime: string;
  bet: number;
  payout?: number;
}

const BetRecords = () => {
  const [items, setItems] = useState<BetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 25;

  const fetchBets = async (p: number) => {
    setLoading(true);
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
        setItems(data.items || []);
        setTotal(data.total || 0);
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
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #320913 43%, #41131e 100%)" }}>
      <PageHeader title="Game Records" />

      {/* Content Container with margin-top for header clearance */}
      <div className="flex-1 px-4 py-6 mt-2">
        {loading ? (
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
              
              // Find game name from GAME_LIST using gameId
              const gameObj = GAME_LIST.find(g => String(g.game_id) === String(item.gameId));
              const gameName = gameObj ? gameObj.name : `Game ${item.gameId}`;

              return (
                <div
                  key={item._id}
                  className="rounded-xl px-4 py-3 shadow-lg"
                  style={{ backgroundColor: "rgba(120, 20, 40, 0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-base">{gameName}</span>
                    {hasPayout && (
                      <span className={`font-bold text-lg ${isWin ? "text-green-500" : isLoss ? "text-red-500" : "text-gray-300"}`}>
                        {profit > 0 ? "+" : ""}{profit.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <div className="flex flex-col">
                       <span className="text-gray-400 text-[10px] uppercase">Bet Amount</span>
                       <span className="text-orange-400 font-bold text-sm">{item.bet.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-gray-400 text-[10px] uppercase">Time</span>
                       <span className="text-gray-300 text-xs">{dateStr}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 mb-4">
            <button
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo(0, 0);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30 active:scale-95 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-1">
              <span className="text-orange-400 font-bold">{page}</span>
              <span className="text-gray-500">/</span>
              <span className="text-white">{totalPages}</span>
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo(0, 0);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30 active:scale-95 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetRecords;
