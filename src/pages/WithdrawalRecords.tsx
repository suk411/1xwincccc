import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import RecordTabs from "@/components/RecordTabs";
import { useState, useEffect } from "react";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { GameButton } from "@/components/GameButton";
import { authService, type WithdrawalRecord } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import pendingIcon from "@/assets/games/pendingicon.png";
import successIcon from "@/assets/games/success.png";

const statusStyles: Record<string, { bg: string; text: string }> = {
  auditing: { bg: "#fc6203", text: "#ffffff" },
  approved: { bg: "#00b341", text: "#ffffff" },
  approve: { bg: "#00b341", text: "#ffffff" },
  completed: { bg: "#00b341", text: "#ffffff" },
  rejected: { bg: "#EF4444", text: "#ffffff" },
  reject: { bg: "#EF4444", text: "#ffffff" },
  pending: { bg: "#fc6203", text: "#ffffff" },
  success: { bg: "#00b341", text: "#ffffff" },
  failed: { bg: "#EF4444", text: "#ffffff" },
};

const fallbackStyle = { bg: "#302f2f", text: "#ffffff" };

const CACHE_KEY = "withdrawal_records_cache";

const loadCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const saveCache = (data: { items: WithdrawalRecord[]; total: number; page: number }) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
};

const WithdrawalRecords = () => {
  const { toast } = useToast();
  const cached = loadCache();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [items, setItems] = useState<WithdrawalRecord[]>(cached?.items || []);
  const [loading, setLoading] = useState(!cached);
  const [page, setPage] = useState(cached?.page || 1);
  const [total, setTotal] = useState(cached?.total || 0);
  const limit = 25;

  const fetchRecords = async (p = 1) => {
    if (items.length === 0) setLoading(true);
    try {
      const res = await authService.getWithdrawals(p, limit);
      const fetched = res.items || [];
      const t = res.total || 0;
      const pg = res.page || p;
      setItems(fetched);
      setTotal(t);
      setPage(pg);
      saveCache({ items: fetched, total: t, page: pg });
    } catch (err: any) {
      toast({ description: err.message || "Failed to fetch withdrawals", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const getItemId = (item: WithdrawalRecord, idx: number) =>
    (item as any).orderId || (item as any).id || (item as any)._id || `${item.createdAt}-${idx}`;

  const getDate = (item: WithdrawalRecord) => {
    if (!item.createdAt) return "—";
    try {
      const date = new Date(item.createdAt);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return item.createdAt; }
  };

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
      <div className="sticky top-0 z-50">
        <PageHeader title="Withdrawal Records" backPath="/" />
      </div>
      <RecordTabs />

      <div className="flex flex-col gap-2 px-2 mt-4">
        {loading ? (
          <Loader label="Loading records..." />
        ) : items.length === 0 ? (
          <div className="text-center text-white/60 py-8 text-sm">No withdrawal records found</div>
        ) : (
          items.map((item, idx) => {
            const itemId = getItemId(item, idx);
            const expanded = expandedId === itemId;
            const status = item.status || "pending";
            const style = statusStyles[status.toLowerCase()] || fallbackStyle;

          items.map((item, idx) => {
            const itemId = getItemId(item, idx);
            const expanded = expandedId === itemId;
            const status = item.status || "pending";
            const style = statusStyles[status.toLowerCase()] || fallbackStyle;

            const getStatusIcon = () => {
              const statusLower = status.toLowerCase();
              if (statusLower === "pending" || statusLower === "auditing") {
                return <img src={pendingIcon} alt="Pending" className="w-7 h-7" />;
              } else if (statusLower === "success" || statusLower === "completed" || statusLower === "approved" || statusLower === "approve") {
                return <img src={successIcon} alt="Success" className="w-7 h-7" />;
              } else if (statusLower === "failed" || statusLower === "rejected" || statusLower === "reject") {
                return "❌";
              }
              return <img src={pendingIcon} alt="Pending" className="w-7 h-7" />;
            };

            return (
              <div
                key={itemId}
                className="rounded-xl overflow-hidden w-full max-w-full"
                style={{ background: "linear-gradient(105deg, #5a0a1a 20%, #3a0611 40%, #4a0915 70%)" }}
              >
                {/* Main row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">
                    {getStatusIcon()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Order ID & Copy */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#c4889a] text-xs truncate">Order id.{itemId}</span>
                      <button
                        className="text-[#c4889a] flex-shrink-0 hover:text-white transition"
                        onClick={() => {
                          navigator.clipboard.writeText(String(itemId));
                          toast({ description: "Order ID copied" });
                        }}
                      >
                        <Copy size={12} />
                      </button>
                    </div>

                    {/* Date & Time */}
                    <div className="text-[#c4889a] text-xs mb-2">
                      {getDate(item)}
                    </div>

                    {/* Amount Info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-bold">
                        Cash+ ₹{Number(item.amount).toLocaleString()}
                      </span>
                      <span className="text-[#c4889a] text-xs">
                        Type: {item.type || "WITHDRAW"}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-center whitespace-nowrap capitalize"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      {status}
                    </span>

                    {/* Details Button */}
                    <button
                      onClick={() => setExpandedId(expanded ? null : itemId)}
                      className="text-[#c4889a] text-xs hover:text-white transition"
                    >
                      {expanded ? "Hide" : "Details"}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="px-4 pb-4 pt-2 text-xs text-[#c4889a] flex flex-col gap-1.5 border-t border-white/10">
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span>{getDate(item)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type</span>
                      <span>{item.type || "WITHDRAW"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span>₹{Number(item.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="capitalize">{status}</span>
                    </div>
                    {item.userId && (
                      <div className="flex justify-between">
                        <span>User ID</span>
                        <span>{item.userId}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
          })
        )}

        {/* Pagination */}
        {!loading && total > limit && (
          <div className="flex items-center justify-center gap-3 py-4">
            <GameButton
              variant="mute"
              size="sm"
              disabled={page <= 1}
              onClick={() => fetchRecords(page - 1)}
            >
              Previous
            </GameButton>
            <span className="text-white/60 text-xs">Page {page}</span>
            <GameButton
              variant="mute"
              size="sm"
              disabled={items.length < limit}
              onClick={() => fetchRecords(page + 1)}
            >
              Next
            </GameButton>
          </div>
        )}
      </div>
    </main>
  );
};

export default WithdrawalRecords;
