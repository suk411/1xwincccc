import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { Copy, ChevronDown } from "lucide-react";
import { GameButton } from "@/components/GameButton";
import { authService, type WithdrawalRecord } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import pendingIcon from "@/assets/games/pendingicon.png";
import successIcon from "@/assets/games/success.png";
import noDataImg from "@/assets/wingo/nodata.png";

const statusStyles: Record<string, string> = {
  PENDING: "#ffd700",
  Pending: "#ffd700",
  pending: "#ffd700",
  AUDITING: "#006aff",
  Auditing: "#006aff",
  auditing: "#006aff",
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

  const getNote = (item: WithdrawalRecord) => (item as any).note || "Withdrawal request";

  const isSuccessStatus = (s: string) => {
    const sl = s.toLowerCase();
    return sl === "success" || sl === "completed" || sl === "approved" || sl === "approve";
  };

  const formatDate = (d: string) => {
    if (!d) return null;
    try {
      const date = new Date(d);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return d;
    }
  };

  const getDate = (item: WithdrawalRecord, status?: string) => {
    if (status && isSuccessStatus(status)) {
      const u = (item as any).updatedAt;
      if (u) {
        const formatted = formatDate(u);
        if (formatted) return formatted;
      }
    }
    const d = (item as any).createdAt;
    const formatted = formatDate(d);
    return formatted || "—";
  };

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes statusShine {
          0% { left: -100%; }
          50%, 100% { left: 200%; }
        }
      `}} />
      <div className="sticky top-0 z-50">
        <PageHeader title="Withdrawal Records" backPath="/" />
      </div>
      <div className="flex flex-col gap-2 px-2 mt-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <img src={noDataImg} alt="No data" className="w-[150px] h-[139px] object-contain block mb-3" />
            <p style={{ color: "#acafc2", fontSize: "13px", margin: 0 }}>No data</p>
          </div>
        ) : (
          <>
            {items.map((item, idx) => {
              const orderId = getOrderId(item);
              const expanded = expandedId === orderId;
              const status = getStatus(item);
              const statusColor = statusStyles[status] || statusStyles[status.toLowerCase()] || fallbackStyle;
              const amount = getAmount(item);
              const charge = getCharge(item);
              const currency = getCurrency(item);
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
                    background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)",
                    border: "1px solid rgba(255,180,50,0.25)",
                  }}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-4 py-2" style={{
                    background: statusColor + '20'
                  }}>
                    {/* Order ID & Copy on Left */}
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span className="text-white text-xs truncate">{orderId}</span>
                      <button
                        className="text-white flex-shrink-0 hover:text-yellow-400 transition"
                        onClick={() => {
                          copyToClipboard(String(orderId), "Copied Success");
                        }}
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    
                    {/* Status with Shine Effect Only on Text */}
                    <span className="relative inline-block overflow-hidden">
                      <span style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "60%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                        animation: "statusShine 2.5s ease-in-out infinite",
                        pointerEvents: "none",
                      }} />
                      <span className="text-xs font-bold text-center whitespace-nowrap relative z-10" style={{ color: statusColor }}>
                        {status.toLowerCase() === "pending" ? "IN PROGRESS" : status}
                      </span>
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex gap-3 px-4 py-3">
                    {/* Icon on Left */}
                    <div className="text-2xl flex-shrink-0 flex items-center justify-center">
                      {getStatusIcon()}
                    </div>

                    {/* Details on Right */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      {/* Date & Time */}
                      <div className="text-white/70 text-xs">
                        {getDate(item)}
                      </div>

                      {/* Amount Info + Details Button - Horizontal */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Amount Info */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold" style={{
                            backgroundImage: "linear-gradient(0deg, rgb(70, 110, 208) 0%, rgb(64, 72, 179) 43.7%, rgb(97, 130, 237) 45%, rgb(101, 127, 231) 100%)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            color: "transparent",
                          }}>
                            Cash- ₹{Number(amount).toLocaleString()}
                          </span>
                          <span className="text-white/70 text-xs">
                            Fee ₹{Number(charge).toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Details Button */}
                        <button
                          onClick={() => setExpandedId(expanded ? null : String(orderId))}
                          className="text-white hover:text-white transition flex items-center gap-1 text-xs flex-shrink-0"
                        >
                          <span>{expanded ? "Hide" : "Details"}</span>
                          <ChevronDown 
                            size={12} 
                            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expanded && (
                    <div className="px-4 pb-4 pt-2 text-xs text-white/70 flex flex-col gap-1.5 border-t border-white/10">
                      <div className="flex justify-between">
                        <span>{isSuccessStatus(status) ? "Success on" : "Date"}</span>
                        <span>{getDate(item, status)}</span>
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
                        <span>{status.toLowerCase() === "pending" ? "IN PROGRESS" : status}</span>
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
            })}
            <p style={{ color: "#acafc2", fontSize: "13px", textAlign: "center", padding: "10px 0", margin: 0 }}>No data</p>
          </>
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
