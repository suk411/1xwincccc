import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import RecordTabs from "@/components/RecordTabs";
import { useState, useEffect } from "react";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { GameButton } from "@/components/GameButton";
import { authService, type WithdrawalRecord } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

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

            return (
              <div
                key={itemId}
                className="rounded-xl overflow-hidden w-full max-w-full"
                style={{ background: "linear-gradient(105deg, #5a0a1a 20%, #3a0611 40%, #4a0915 70%)" }}
              >
                {/* Top row */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[#c4889a] text-xs truncate">ID: {itemId}</span>
                    <button
                      className="text-[#c4889a] flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(String(itemId));
                        toast({ description: "ID copied" });
                      }}
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-sm flex-shrink-0 capitalize"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {status}
                  </span>
                </div>

                {/* Amount */}
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-base font-bold">Withdrawal Amount</span>
                    <span className="font-semibold text-base" style={{ color: style.bg }}>
                      ₹{Number(item.amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-center justify-between px-4 pb-4">
                  <span className="text-[#c4889a] text-xs">Type</span>
                  <span className="text-[#d1d1d1] text-sm font-bold">{item.type || "WITHDRAW"}</span>
                </div>

                <div className="border-t border-white/10 mx-4" />

                {/* Actions */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(expanded ? null : itemId)}
                      className="flex items-center gap-1 text-white text-xs"
                    >
                      Details
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="px-4 pb-4 pt-2 text-xs text-[#c4889a] flex flex-col gap-1.5 border-t border-white/10 mx-4 -mt-px">
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
