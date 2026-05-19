import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import RecordTabs from "@/components/RecordTabs";
import { useState, useEffect } from "react";
import { Copy, ChevronDown } from "lucide-react";
import { GameButton } from "@/components/GameButton";
import { authService, type WithdrawalRecord } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import pendingIcon from "@/assets/games/pendingicon.png";
import successIcon from "@/assets/games/success.png";

const statusStyles: Record<string, string> = {
  PENDING: "#ffd700",
  Pending: "#ffd700",
  pending: "#ffd700",
  AUDITING: "#ffd700",
  Auditing: "#ffd700",
  auditing: "#ffd700",
  APPROVED: "#00b341",
  Approved: "#00b341",
  approved: "#00b341",
  APPROVE: "#00b341",
  Approve: "#00b341",
  approve: "#00b341",
  SUCCESS: "#00b341",
  Success: "#00b341",
  success: "#00b341",
  COMPLETED: "#00b341",
  Completed: "#00b341",
  completed: "#00b341",
  FAILED: "#ff0000",
  Failed: "#ff0000",
  failed: "#ff0000",
  REJECTED: "#ff0000",
  Rejected: "#ff0000",
  rejected: "#ff0000",
  REJECT: "#ff0000",
  Reject: "#ff0000",
  reject: "#ff0000",
};

const amountStyles: Record<string, string> = {
  PENDING: "#ffd700",
  Pending: "#ffd700",
  pending: "#ffd700",
  AUDITING: "#ffd700",
  Auditing: "#ffd700",
  auditing: "#ffd700",
  APPROVED: "#00b341",
  Approved: "#00b341",
  approved: "#00b341",
  APPROVE: "#00b341",
  Approve: "#00b341",
  approve: "#00b341",
  SUCCESS: "#00b341",
  Success: "#00b341",
  success: "#00b341",
  COMPLETED: "#00b341",
  Completed: "#00b341",
  completed: "#00b341",
  FAILED: "#ff0000",
  Failed: "#ff0000",
  failed: "#ff0000",
  REJECTED: "#ff0000",
  Rejected: "#ff0000",
  rejected: "#ff0000",
  REJECT: "#ff0000",
  Reject: "#ff0000",
  reject: "#ff0000",
};

const fallbackStyle = "#888888";

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
  const { copyToClipboard } = useCopyToClipboard();
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

  const getOrderId = (item: WithdrawalRecord) =>
    (item as any).orderId || (item as any).id || (item as any)._id || "—";

  const getAmount = (item: WithdrawalRecord) => (item as any).amount ?? 0;

  const getCharge = (item: WithdrawalRecord) => (item as any).charge ?? 0;

  const getCurrency = (item: WithdrawalRecord) => (item as any).currency || "INR";

  const getStatus = (item: WithdrawalRecord) => (item as any).status || "PENDING";

  const getChannel = (item: WithdrawalRecord) => (item as any).channelName || (item as any).channel || "—";

  const getNote = (item: WithdrawalRecord) => (item as any).note || "Withdrawal request";

  const getDate = (item: WithdrawalRecord) => {
    const d = (item as any).createdAt;
    if (!d) return "—";
    try {
      const date = new Date(d);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return d;
    }
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
            const orderId = getOrderId(item);
            const expanded = expandedId === orderId;
            const status = getStatus(item);
            const statusColor = statusStyles[status] || statusStyles[status.toLowerCase()] || fallbackStyle;
            const amount = getAmount(item);
            const charge = getCharge(item);
            const currency = getCurrency(item);
            const channel = getChannel(item);
            const note = getNote(item);

            const getStatusIcon = () => {
              const statusLower = String(status).toLowerCase();
              if (statusLower === "pending" || statusLower === "auditing") {
                return <img src={pendingIcon} alt="Pending" className="w-7 h-7" />;
              }
              if (statusLower === "success" || statusLower === "completed" || statusLower === "approved" || statusLower === "approve") {
                return <img src={successIcon} alt="Success" className="w-7 h-7" />;
              }
              if (statusLower === "failed" || statusLower === "rejected" || statusLower === "reject") {
                return "❌";
              }
              return <img src={pendingIcon} alt="Pending" className="w-7 h-7" />;
            };

            return (
              <div
                key={String(orderId) + idx}
                className="rounded-xl overflow-hidden w-full max-w-full"
                style={{ 
                  background: 'rgba(255,255,255,0.03)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                {/* Main row */}
                <div className="flex gap-3 px-4 py-3">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0 flex items-center justify-center">
                    {getStatusIcon()}
                  </div>

                  {/* Left Content - Vertical */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* Order ID & Copy */}
                    <div className="flex items-center gap-1">
                      <span className="text-white text-xs flex-1 truncate">Order id.{orderId}</span>
                      <button
                        className="text-white flex-shrink-0 hover:text-yellow-400 transition"
                        onClick={() => {
                          copyToClipboard(String(orderId), "Order ID copied");
                        }}
                      >
                        <Copy size={12} />
                      </button>
                    </div>

                    {/* Date & Time */}
                    <div className="text-white/70 text-xs">
                      {getDate(item)}
                    </div>

                    {/* Amount Info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: amountStyles[status] || fallbackStyle }}>
                        Cash- ₹{Number(amount).toLocaleString()}
                      </span>
                      <span className="text-white/70 text-xs">Fee ₹{Number(charge).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Right Status Column - Vertical */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0 min-w-[80px]">
                    {/* Status Text */}
                    <span
                      className="text-xs font-bold text-center whitespace-nowrap mt-1"
                      style={{ color: statusColor }}
                    >
                      {status}
                    </span>

                    {/* Details Button with Arrow */}
                    <button
                      onClick={() => setExpandedId(expanded ? null : String(orderId))}
                      className="text-white hover:text-white transition flex items-center gap-1 text-xs mt-1"
                    >
                      <span>{expanded ? "Hide" : "Details"}</span>
                      <ChevronDown 
                        size={12} 
                        className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="px-4 pb-4 pt-2 text-xs text-white/70 flex flex-col gap-1.5 border-t border-white/10">
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span>{getDate(item)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Channel</span>
                      <span>{channel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span>₹{Number(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fee</span>
                      <span>₹{Number(charge).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency</span>
                      <span>{currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span>{status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Note</span>
                      <span className="max-w-[60%] text-right">{note}</span>
                    </div>
                    {(item as any).userId && (
                      <div className="flex justify-between">
                        <span>User ID</span>
                        <span>{(item as any).userId}</span>
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
              variant="dark"
              style={{
                height: "30px",
                fontSize: "10px",
                paddingLeft: "12px",
                paddingRight: "12px",
                borderRadius: "15px",
              }}
              disabled={page <= 1}
              onClick={() => fetchRecords(page - 1)}
            >
              Previous
            </GameButton>
            <span className="text-white/60 text-xs">Page {page}</span>
            <GameButton
              variant="dark"
              style={{
                height: "30px",
                fontSize: "10px",
                paddingLeft: "12px",
                paddingRight: "12px",
                borderRadius: "15px",
              }}
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
