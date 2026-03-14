import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backBtn from "@/assets/icons/back-btn.png";
import Loader from "@/components/Loader";

const API_BASE = "https://backend-ledger-0ra6.onrender.com";

interface BetItem {
  _id: string;
  site: string;
  gameId: string;
  betTime: string;
  bet: number;
  payout: number;
}

const BetRecords = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<BetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 25;

  const fetchBets = async (p: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/game/bets?page=${p}&limit=${limit}`, {
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

  const providerNames: Record<string, string> = {
    JE: "MoneyComing",
    PG: "Fortune Mouse",
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #320913 43%, #41131e 100%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex-shrink-0">
          <img src={backBtn} alt="Back" className="w-full h-full object-contain" />
        </button>
        <h1 className="text-white font-bold text-lg">Game Records</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6">
        {loading ? (
          <Loader label="Loading records..." />
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No bet records found</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const profit = item.payout - item.bet;
              const isWin = profit >= 0;
              const date = new Date(item.betTime);
              const dateStr = `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
              const gameName = providerNames[item.site] || item.site;

              return (
                <div
                  key={item._id}
                  className="rounded-xl px-4 py-3"
                  style={{ backgroundColor: "rgba(120, 20, 40, 0.5)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{gameName}</span>
                    <span className={`font-bold text-lg ${isWin ? "text-green-400" : "text-red-400"}`}>
                      {isWin ? "+" : ""}{profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-orange-400 text-xs">{dateStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1.5 rounded-lg bg-white/10 text-white text-sm disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-white text-sm self-center">{page}/{totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1.5 rounded-lg bg-white/10 text-white text-sm disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetRecords;
