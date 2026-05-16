import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import RecordTabs from "@/components/RecordTabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { GameButton } from "@/components/GameButton";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import pendingIcon from "@/assets/games/pendingicon.png";
import successIcon from "@/assets/games/success.png";

type OrderStatus = "Pending" | "Timeout" | "Cancelled" | "success" | string;

interface DepositOrder {
  [key: string]: any;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#ff8800", text: "#ffffff" },
  Pending: { bg: "#ff8800", text: "#ffffff" },
  pending: { bg: "#ff8800", text: "#ffffff" },
  Timeout: { bg: "#ff0000", text: "#ffffff" },
  timeout: { bg: "#ff0000", text: "#ffffff" },
  TIMEOUT: { bg: "#ff0000", text: "#ffffff" },
  Cancelled: { bg: "#302f2f", text: "#ffffff" },
  cancelled: { bg: "#302f2f", text: "#ffffff" },
  CANCELLED: { bg: "#302f2f", text: "#ffffff" },
  success: { bg: "#00b341", text: "#ffffff" },
  Success: { bg: "#00b341", text: "#ffffff" },
  SUCCESS: { bg: "#00b341", text: "#ffffff" },
  completed: { bg: "#00b341", text: "#ffffff" },
  Completed: { bg: "#00b341", text: "#ffffff" },
  COMPLETED: { bg: "#00b341", text: "#ffffff" },
  failed: { bg: "#1a1a1a", text: "#ffffff" },
  Failed: { bg: "#1a1a1a", text: "#ffffff" },
  FAILED: { bg: "#1a1a1a", text: "#ffffff" },
};

const fallbackStyle = { bg: "#302f2f", text: "#ffffff" };

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
  const navigate = useNavigate();
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
      navigate("/payment", { state: { paymentUrl: url } });
    } else {
      toast({ description: "No payment URL available", variant: "destructive" });
    }
  };

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
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
            const style = statusStyles[status] || fallbackStyle;
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
                      <span className="text-[#c4889a] text-xs truncate">Order id.{orderId}</span>
                      <button
                        className="text-[#c4889a] flex-shrink-0 hover:text-white transition"
                        onClick={() => {
                          navigator.clipboard.writeText(orderId);
                          toast({ description: "Order ID copied" });
                        }}
                      >
                        <Copy size={12} />
                      </button>
                    </div>

                    {/* Date & Time */}
                    <div className="text-[#c4889a] text-xs mb-2">
                      {getDate(order)}
                    </div>

                    {/* Amount Info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-bold">
                        Cash+ ₹{Number(amount).toLocaleString()}
                      </span>
                      <span className="text-[#c4889a] text-xs">
                        Bonus+ ₹{Number(bonus).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-center whitespace-nowrap"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      {status}
                    </span>

                    {/* Details Button */}
                    <button
                      onClick={() => setExpandedId(expanded ? null : orderId)}
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
                        <GameButton variant="mute" size="sm" className="flex-1 h-7 text-xs">
                          Cancel
                        </GameButton>
                        <GameButton
                          variant="gold"
                          size="sm"
                          className="flex-1 h-7 text-xs"
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
              size="sm"
              disabled={page <= 1}
              onClick={() => fetchOrders(page - 1)}
            >
              Previous
            </GameButton>
            <span className="text-white/60 text-xs">Page {page}</span>
            <GameButton
              variant="mute"
              size="sm"
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
