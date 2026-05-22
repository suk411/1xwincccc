import { 
  GameDialog, 
  GameDialogContent, 
  GameDialogBody,
  GameDialogFooter,
} from "@/components/GameDialog";
import { GameButton } from "@/components/GameButton";
import { gameService } from "@/services/gameService";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const PROVIDER_ICONS: Record<string, string> = {
  JE: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/JILI_LOGO.avif",
  PG: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/PG_LOGO.avif",
  JD: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/JDB_LOGO.avif",
  SPRIBE: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/SPRIBE_LOGO.avif",
  TU: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/TURBO_LOGO.png",
  IB: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/SABAgamelogo/SABAplays.png",
};

interface BalanceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Record<string, number>;
  onRefresh: () => void;
}

export const BalanceDetailsDialog = ({ isOpen, onClose, balances, onRefresh }: BalanceDetailsDialogProps) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawCountdown, setWithdrawCountdown] = useState(0);

  const handleWithdrawAll = async () => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);

    const providers = ["JE", "PG", "TU", "JD", "IB"];

    // 1. Trigger API calls immediately
    const apiPromise = (async () => {
      try {
        const results = await Promise.allSettled(
          providers.map((p_code) => gameService.withdraw(p_code))
        );
        const successful = results.filter((r) => r.status === "fulfilled").length;
        return successful;
      } catch (e) {
        console.error("Withdrawal error:", e);
        return -1;
      }
    })();

    // 2. Start visual countdown (5 to 1)
    for (let i = 5; i > 0; i--) {
      setWithdrawCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 3. Wait for API to finish
    const successfulCount = await apiPromise;

    if (successfulCount > 0) {
      toast({ title: "Withdrawal Successful", description: `Recall success` });
      onRefresh();
    } else if (successfulCount === 0) {
      toast({ title: "Try again.", description: "No funds found", variant: "destructive" });
    }

    setWithdrawCountdown(0);
    setIsWithdrawing(false);
  };

  return (
    <GameDialog open={isOpen} onOpenChange={onClose}>
      <GameDialogContent title="Wallet">
        <GameDialogBody>
          <div className="grid grid-cols-3 gap-2 w-full">
            {Object.entries(balances).map(([code, amount]) => (
              <div 
                key={code}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/40 border border-white/5 gap-1"
              >
                <img 
                  src={PROVIDER_ICONS[code]} 
                  alt={code} 
                  className="w-10 h-10 object-contain rounded-lg"
                />
                <span className="text-[11px] text-yellow-500 font-mono font-bold">₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          {Object.keys(balances).length === 0 && (
            <div className="text-center py-8 text-white/40 text-sm">No game balances found</div>
          )}
        </GameDialogBody>
        <GameDialogFooter>
          <div className="flex justify-center w-full">
            <GameButton
              variant="gold"
              type="prompt"
              onClick={handleWithdrawAll}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? (withdrawCountdown > 0 ? `Recalling ${withdrawCountdown}` : "...") : "Recall All"}
            </GameButton>
          </div>
        </GameDialogFooter>
      </GameDialogContent>
    </GameDialog>
  );
};
