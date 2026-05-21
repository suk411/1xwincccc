import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import RecordTabs from "@/components/RecordTabs";
import { useState, useEffect } from "react";
import { Copy, ChevronDown } from "lucide-react";
import { GameButton } from "@/components/GameButton";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import pendingIcon from "@/assets/games/pendingicon.png";
import successIcon from "@/assets/games/success.png";

interface DepositOrder {
  [key: string]: any;
}

const statusStyles: Record<string, string> = {
  PENDING: "#ffd700",
  Pending: "#ffd700",
  pending: "#ffd700",
  Timeout: "#ff0000",
  timeout: "#ff0000",
  TIMEOUT: "#ff0000",
  Cancelled: "#888888",
  cancelled: "#888888",
  CANCELLED: "#888888",
  success: "#00b341",
  Success: "#00b341",
  SUCCESS: "#00b341",
  completed: "#00b341",
  Completed: "#00b341",
  COMPLETED: "#00b341",
  failed: "#ff0000",
  Failed: "#ff0000",
  FAILED: "#ff0000",
};

const amountStyles: Record<string, string> = {
  PENDING: "#ffd700",
  Pending: "#ffd700",
  pending: "#ffd700",
  Timeout: "#ff0000",
  timeout: "#ff0000",
  TIMEOUT: "#ff0000",
  Cancelled: "#888888",
  cancelled: "#888888",
  CANCELLED: "#888888",
  success: "#00b341",
  Success: "#00b341",
  SUCCESS: "#00b341",
  completed: "#00b341",
  Completed: "#00b341",
  COMPLETED: "#00b341",
  failed: "#ff0000",
  Failed: "#ff0000",
  FAILED: "#ff0000",
};

const fallbackStyle = "#888888";

const CACHE_KEY = "deposit_records_cache";

const loadCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const saveCache = (data: { items: DepositOrder[]; total: number; page: number }) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
};

const DepositRecords = () => {
  const { toast } = useToast();
  const { copyToClipboard } = useCopyToClipboard();
  const cached = loadCache();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orders, setOrders] = useState<DepositOrder[]>(cached?.items || []);
  const [loading, setLoading] = useState(!cached);
  const [page, setPage] = useState(cached?.page || 1);
  const [total, setTotal] = useState(cached?.total || 0);

  const fetchOrders = async (p = 1) => {
    if (orders.length === 0) setLoading(true);
    try {
      const res = await authService.getDeposits(p, 15);
      const items = res.items || [];
      const t = res.total || 0;
      const pg = res.page || p;
      setOrders(items);
      setTotal(t);
      setPage(pg);
      saveCache({ items, total: t, page: pg });
    } catch (err: any) {
      toast({ description: err.message || "Failed to fetch deposits", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOrderId = (order: DepositOrder) =>
    order.orderId || order.merOrderNo || order.id || order._id || "—";

  const getAmount = (order: DepositOrder) =>
    order.amount ?? order.depositAmount ?? 0;

  const getStatus = (order: DepositOrder) =>
    order.status || order.orderStatus || "PENDING";

  const getChannel = (order: DepositOrder) =>
    order.channelName || order.channel || order.paymentChannel || order.method || "—";

  const isOlderThan15Min = (order: DepositOrder) => {
    const d = order.createdAt || order.date || order.created_at;
    if (!d) return true;
    try {
      return (Date.now() - new Date(d).getTime()) > 15 * 60 * 1000;
    } catch { return true; }
  };

  const getDate = (order: DepositOrder) => {
    const d = order.createdAt || order.date || order.created_at;
    if (!d) return "—";
    try {
      const date = new Date(d);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  const getPaymentLink = (order: DepositOrder) =>
    order.paymentLinks?.paymentLink || order.paymentUrl || order.payment_url || null;

  const handlePayOrder = (order: DepositOrder) => {
    const url = getPaymentLink(order);
    if (url) {
      window.open(url, "_blank");
    } else {
      toast({ description: "No payment URL available", variant: "destructive" });
    }
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
        <PageHeader title="Deposit Records" backPath="/" />
      </div>
      <RecordTabs />

      <div className="flex flex-col gap-2 px-2 mt-4">
        {loading ? (
          <Loader label="Loading records..." />
        ) : orders.length === 0 ? (
          <div className="text-center text-white/60 py-8 text-sm">No deposit records found</div>
        ) : (
          orders.map((order, idx) => {
            const orderId = getOrderId(order);
            const expanded = expandedId === orderId;
            const status = getStatus(order);
            const statusColor = statusStyles[status] || fallbackStyle;
            const amountColor = amountStyles[status] || fallbackStyle;
            const amount = getAmount(order);
            const bonus = order.bonus || order.bonusAmount || 0;

            const getStatusIcon = () => {
              const statusLower = status.toLowerCase();
              if (statusLower === "pending") {
                return <img src={pendingIcon} alt="Pending" className="w-7 h-7" />;
              } else if (statusLower === "success" || statusLower === "completed") {
                return <img src={successIcon} alt="Success" className="w-7 h-7" />;
              } else if (statusLower === "failed" || statusLower === "cancelled") {
                return "❌";
              }
              return <img src={pendingIcon} alt="Pending" className="w-7 h-7" />;
            };

            return (
              <div
                key={orderId + idx}
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
                  {/* Order ID + Copy Button */}
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs truncate">{orderId}</span>
                    <button
                      className="text-white flex-shrink-0 hover:text-yellow-400 transition"
                      onClick={() => {
                        copyToClipboard(orderId, "Copied Success");
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
                    <span className="text-xs font-bold whitespace-nowrap relative z-10" style={{ color: statusColor }}>
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
                      {getDate(order)}
                    </div>

                    {/* Amount Info + Details Button */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold" style={{ color: amountColor }}>
                          Cash+ ₹{Number(amount).toLocaleString()}
                        </span>
                        <span className="text-white/70 text-xs">
                          Bonus+ ₹{Number(bonus).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => setExpandedId(expanded ? null : orderId)}
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
                      <span>Date</span>
                      <span>{getDate(order)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Channel</span>
                      <span>{getChannel(order)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span>₹{Number(amount).toLocaleString()}</span>
                    </div>
                    {bonus > 0 && (
                      <div className="flex justify-between">
                        <span>Bonus</span>
                        <span>₹{Number(bonus).toLocaleString()}</span>
                      </div>
                    )}
                    {order.currency && (
                      <div className="flex justify-between">
                        <span>Currency</span>
                        <span>{order.currency}</span>
                      </div>
                    )}
                    {order.userId && (
                      <div className="flex justify-between">
                        <span>User ID</span>
                        <span>{order.userId}</span>
                      </div>
                    )}
                    {(status.toLowerCase() === "pending") && !isOlderThan15Min(order) && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                        <GameButton variant="mute" className="flex-1 h-7 text-xs" style={{
                          height: "28px",
                          fontSize: "10px",
                          paddingLeft: "12px",
                          paddingRight: "12px",
                          borderRadius: "14px",
                        }}>
                          Cancel
                        </GameButton>
                        <GameButton
                          variant="gold"
                          className="flex-1 h-7 text-xs"
                          style={{
                            height: "28px",
                            fontSize: "10px",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            borderRadius: "14px",
                          }}
                          onClick={() => handlePayOrder(order)}
                        >
                          Pay
                        </GameButton>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination */}
        {!loading && total > 15 && (
          <div className="flex items-center justify-center gap-3 py-4">
            <GameButton
              variant="mute"
              style={{
                height: "28px",
                fontSize: "10px",
                paddingLeft: "12px",
                paddingRight: "12px",
                borderRadius: "14px",
              }}
              disabled={page <= 1}
              onClick={() => fetchOrders(page - 1)}
            >
              Previous
            </GameButton>
            <span className="text-white/60 text-xs">Page {page}</span>
            <GameButton
              variant="mute"
              style={{
                height: "28px",
                fontSize: "10px",
                paddingLeft: "12px",
                paddingRight: "12px",
                borderRadius: "14px",
              }}
              disabled={orders.length < 15}
              onClick={() => fetchOrders(page + 1)}
            >
              Next
            </GameButton>
          </div>
        )}
      </div>
    </main>
  );
};

export default DepositRecords;
