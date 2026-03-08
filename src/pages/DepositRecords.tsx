import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { GameButton } from "@/components/GameButton";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

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
      <div className="mb-2">
        <PageHeader title="Deposit Records" />
      </div>

      <div className="flex flex-col gap-2 px-2">
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

            return (
              <div
                key={orderId + idx}
                className="rounded-xl overflow-hidden w-full max-w-full"
                style={{ background: "linear-gradient(135deg, #5a0a1a 0%, #3a0611 50%, #4a0915 100%)" }}
              >
                {/* Top row */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[#c4889a] text-xs truncate">Order ID: {orderId}</span>
                    <button
                      className="text-[#c4889a] flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(orderId);
                        toast({ description: "Order ID copied" });
                      }}
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {status}
                  </span>
                </div>

                {/* Amount */}
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-base font-bold">Deposit Amount</span>
                    <span className="font-semibold text-base" style={{ color: style.bg }}>
                      ₹{Number(getAmount(order)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Channel */}
                <div className="flex items-center justify-between px-4 pb-4">
                  <span className="text-[#c4889a] text-xs">Payment channel</span>
                  <span className="text-[#d1d1d1] text-sm font-bold">{getChannel(order)}</span>
                </div>

                <div className="border-t border-white/10 mx-4" />

                {/* Actions */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(expanded ? null : orderId)}
                      className="flex items-center gap-1 text-white text-xs"
                    >
                      Details
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <div className="flex items-center gap-1.5">
                      {(status.toLowerCase() === "pending") && !isOlderThan15Min(order) && (
                        <>
                          <GameButton variant="mute" size="sm" className="px-2.5 h-7 text-xs flex-shrink-0">
                            Cancel
                          </GameButton>
                          <GameButton variant="gold" size="sm" className="px-2.5 h-7 text-xs flex-shrink-0" onClick={() => handlePayOrder(order)}>
                            Pay
                          </GameButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="px-4 pb-4 pt-2 text-xs text-[#c4889a] flex flex-col gap-1.5 border-t border-white/10 mx-4 -mt-px">
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
                      <span>₹{Number(getAmount(order)).toLocaleString()}</span>
                    </div>
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
