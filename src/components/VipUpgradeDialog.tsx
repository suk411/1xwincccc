import { useNavigate } from "react-router-dom";
import {
  GameDialog,
  GameDialogContent,
  GameDialogBody,
  GameDialogFooter,
} from "@/components/GameDialog";
import { GameObject, gameService } from "@/services/gameService";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import vipBadge from "@/assets/profile/vip-badge.png";

interface VipUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: GameObject | null;
}

const VipUpgradeDialog = ({ open, onOpenChange, game }: VipUpgradeDialogProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleWatchDemo = async () => {
    if (!game) return;
    setLoading(true);
    try {
      const result = await gameService.watch(game);
      onOpenChange(false);
      navigate("/game", { state: { gameUrl: result.gameUrl } });
    } catch (e: any) {
      toast({ title: "Demo failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/vip");
  };

  return (
    <GameDialog open={open} onOpenChange={onOpenChange}>
      <GameDialogContent title="VIP Required">
        <GameDialogBody>
          <img
            src={vipBadge}
            alt="VIP"
            className="w-16 h-16 object-contain mx-auto mb-3"
          />
          <h3 className="text-white font-bold text-base mb-2">
            Upgrade to VIP to Play
          </h3>
          <p className="text-white/60 text-xs leading-relaxed mb-1">
            This game requires VIP membership. Upgrade your VIP level to unlock full access and start winning!
          </p>
          <p className="text-white/40 text-[11px]">
            Or try the demo mode to watch the game first.
          </p>
        </GameDialogBody>
        <GameDialogFooter>
          <button
            onClick={handleWatchDemo}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
            }}
          >
            {loading ? "Loading..." : "Watch Demo"}
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 py-2.5 rounded-full text-xs font-bold transition-all"
            style={{
              background: "linear-gradient(135deg, #d4a017 0%, #b8860b 100%)",
              border: "1px solid rgba(255,200,50,0.5)",
              color: "#1a0a10",
            }}
          >
            Upgrade VIP
          </button>
        </GameDialogFooter>
      </GameDialogContent>
    </GameDialog>
  );
};

export default VipUpgradeDialog;
