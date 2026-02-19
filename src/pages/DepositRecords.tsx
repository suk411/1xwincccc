import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { GameButton } from "@/components/GameButton";

type OrderStatus = "Pending" | "Timeout" | "Cancelled" | "Completed";

interface DepositOrder {
  id: string;
  amount: number;
  channel: string;
  status: OrderStatus;
  date: string;
}

const mockOrders: DepositOrder[] = [
  { id: "20260219165121117246", amount: 1000, channel: "nexPay", status: "Pending", date: "2026-02-19" },
  { id: "20260216160421612999", amount: 200, channel: "nexPay", status: "Timeout", date: "2026-02-16" },
  { id: "20260205161059108033", amount: 200, channel: "nexPay", status: "Cancelled", date: "2026-02-05" },
];

const statusColors: Record<OrderStatus, string> = {
  Pending: "#e8a820",
  Timeout: "#e05555",
  Cancelled: "#888",
  Completed: "#22c55e",
};

const DepositRecords = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <main className="relative flex-1 flex flex-col pb-20">
      <PageHeader title="Order History" />

      <div className="flex flex-col gap-3 px-3 mt-3">
        {mockOrders.map((order) => {
          const expanded = expandedId === order.id;
          return (
            <div
              key={order.id}
              className="rounded-xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #5a0a1a 0%, #3a0611 50%, #4a0915 100%)" }}
            >
              {/* Top row: Order ID + Status */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#c4889a] text-xs">Order ID: {order.id}</span>
                  <button className="text-[#c4889a]">
                    <Copy size={12} />
                  </button>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${statusColors[order.status]}22`,
                    color: statusColors[order.status],
                    border: `1px solid ${statusColors[order.status]}44`,
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between px-4 py-1.5">
                <span className="text-white font-bold text-base">Deposit Amount</span>
                <span className="text-white font-extrabold text-xl">₹{order.amount.toLocaleString()}</span>
              </div>

              {/* Channel */}
              <div className="flex items-center justify-between px-4 pb-2">
                <span className="text-[#c4889a] text-xs">Payment channel</span>
                <span className="text-[#e8a820] text-sm font-bold">{order.channel}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 mx-3" />

              {/* Actions row */}
              <div className="flex items-center justify-between px-4 py-2.5">
                <button
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                  className="flex items-center gap-1 text-white text-xs"
                >
                  Details
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <div className="flex items-center gap-2">
                  <GameButton variant="red" size="sm" className="px-4 text-xs h-7">
                    Cancel
                  </GameButton>
                  <GameButton variant="red" size="sm" className="px-4 text-xs h-7">
                    Paid
                  </GameButton>
                  {order.status === "Pending" && (
                    <GameButton variant="gold" size="sm" className="px-4 text-xs h-7">
                      Pay
                    </GameButton>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {expanded && (
                <div className="px-4 pb-3 text-xs text-[#c4889a] flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{order.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Channel</span>
                    <span>{order.channel}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default DepositRecords;
