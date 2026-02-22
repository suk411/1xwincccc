import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { GameButton } from "@/components/GameButton";

type OrderStatus = "Pending" | "Timeout" | "Cancelled" | "success";

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
  { id: "20260205161059108034", amount: 500, channel: "nexPay", status: "success", date: "2026-02-05" },
];

const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
  Pending: { bg: "#ff5500", text: "#ffffff" },    // Orange bg, white text
  Timeout: { bg: "#ff0000", text: "#ffffff" },    // Red bg, white text  
  Cancelled: { bg: "#302f2f", text: "#ffffff" },  // Gray bg, white text
  success: { bg: "#008f13", text: "#ffffff" },    // Green bg, white text
};

const DepositRecords = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <main className="relative flex-1 flex flex-col pb-20">
      <PageHeader title="Order History" />

      <div className="flex flex-col gap-2 px-4 mt-2">
        {mockOrders.map((order) => {
          const expanded = expandedId === order.id;
          const statusStyle = statusStyles[order.status];
          
          return (
            <div
              key={order.id}
              className="rounded-xl overflow-hidden w-full max-w-full"
              style={{ background: "linear-gradient(135deg, #5a0a1a 0%, #3a0611 50%, #4a0915 100%)" }}
            >
              {/* Top row: Order ID + Status */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[#c4889a] text-xs truncate">Order ID: {order.id}</span>
                  <button className="text-[#c4889a] flex-shrink-0">
                    <Copy size={12} />
                  </button>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-sm flex-shrink-0"
                  style={{
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* Amount */}
              <div className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-base font-bold">Deposit Amount</span>
                  <span 
                    className="font-semibold text-base"
                    style={{ color: statusStyle.bg }}
                  >
                    ₹{order.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Channel */}
              <div className="flex items-center justify-between px-4 pb-4">
                <span className="text-[#c4889a] text-xs">Payment channel</span>
                <span className="text-[#d1d1d1] text-sm font-bold">{order.channel}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 mx-4" />

              {/* Actions row - Buttons contained */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                    className="flex items-center gap-1 text-white text-xs"
                  >
                    Details
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <GameButton variant="mute" size="sm" className="px-2.5 h-7 text-xs flex-shrink-0">
                      Cancel
                    </GameButton>
                    <GameButton variant="red" size="sm" className="px-2.5 h-7 text-xs flex-shrink-0">
                      Paid
                    </GameButton>
                    {order.status === "Pending" && (
                      <GameButton variant="gold" size="sm" className="px-2.5 h-7 text-xs flex-shrink-0">
                        Pay
                      </GameButton>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expanded && (
                <div className="px-4 pb-4 pt-2 text-xs text-[#c4889a] flex flex-col gap-1.5 border-t border-white/10 mx-4 -mt-px">
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
