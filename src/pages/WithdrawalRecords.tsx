import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import { GameButton } from "@/components/GameButton";
import { authService, type WithdrawalRecord } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<string, { bg: string; text: string }> = {
  auditing: { bg: "#ff8800", text: "#ffffff" },
  approved: { bg: "#00b341", text: "#ffffff" },
  completed: { bg: "#00b341", text: "#ffffff" },
  rejected: { bg: "#ff0000", text: "#ffffff" },
  pending: { bg: "#ff8800", text: "#ffffff" },
};

const fallbackStyle = { bg: "#302f2f", text: "#ffffff" };

const WithdrawalRecords = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 25;

  const fetchRecords = async (p: number) => {
    setLoading(true);
    try {
      const res = await authService.getWithdrawals(p, limit);
      setItems(res.items || []);
      setTotal(res.total || 0);
      setPage(res.page || p);
    } catch (err: any) {
      toast({ description: err.message || "Failed to fetch withdrawals", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
      <div className="mb-2">
        <PageHeader title="Withdrawal Records" />
      </div>

      <div className="flex flex-col gap-2 px-2">
        {loading ? (
          <Loader label="Loading records..." />
        ) : items.length === 0 ? (
          <div className="text-center text-white/60 py-8 text-sm">No withdrawal records found</div>
        ) : (
          items.map((item, idx) => {
            const style = statusStyles[item.status?.toLowerCase()] || fallbackStyle;
            const date = new Date(item.createdAt);
            const dateStr = `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

            return (
              <div
                key={`${item.createdAt}-${idx}`}
                className="rounded-xl overflow-hidden px-4 py-3"
                style={{ background: "linear-gradient(105deg, #5a0a1a 20%, #3a0611 40%, #4a0915 70%)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-sm">₹{Number(item.amount).toLocaleString()}</span>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-sm capitalize"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[#c4889a] text-xs">{dateStr}</span>
                  <span className="text-[#c4889a] text-xs">{item.type}</span>
                </div>
              </div>
            );
          })
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4">
            <GameButton variant="mute" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </GameButton>
            <span className="text-white/60 text-xs">Page {page}/{totalPages}</span>
            <GameButton variant="mute" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </GameButton>
          </div>
        )}
      </div>
    </main>
  );
};

export default WithdrawalRecords;
