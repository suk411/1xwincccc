import PageLayout from "@/components/PageLayout";
import { useState } from "react";
import { GAME_LIST, gameService } from "@/services/gameService";
import { refreshProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const Promo = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleWithdraw = async (providerCode: string, gameName: string) => {
    setLoading(providerCode);
    try {
      const result = await gameService.withdraw(providerCode);
      await refreshProfile();
      if (result.moveOut.amount > 0) {
        toast({ title: "Withdrawn ₹" + result.moveOut.amount, description: `Balance from ${gameName} moved to wallet` });
      } else {
        toast({ title: "No balance", description: result.msg || "Nothing to withdraw from this game" });
      }
    } catch (e: any) {
      toast({ title: "Withdraw failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <PageLayout title="GET ₹2000">
      <div className="flex-1 flex flex-col gap-4 p-4">
        <div className="text-center">
          <div
            className="w-24 h-24 mx-auto mb-4 rounded-full promo-gradient flex items-center justify-center"
            style={{ boxShadow: "var(--glow-orange)" }}
          >
            <span className="text-2xl font-bold text-white">₹2000</span>
          </div>
          <p className="text-muted-foreground">Promotional offers coming soon</p>
        </div>

        {/* Game Withdraw Buttons */}
        <div className="mt-4 flex flex-col gap-3">
          <h3 className="text-white text-sm font-bold text-center">Withdraw Game Balance</h3>
          {GAME_LIST.map((game) => (
            <button
              key={game.game_id}
              disabled={loading === game.provider_code}
              onClick={() => handleWithdraw(game.provider_code, game.name)}
              className="flex items-center gap-3 w-full rounded-xl p-3 transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #5a0a1a 0%, #3a0611 100%)", border: "1px solid rgba(255,180,50,0.3)" }}
            >
              <img src={game.logo} alt={game.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-bold">{game.name}</p>
                <p className="text-muted-foreground text-xs">{game.provider_code}</p>
              </div>
              <div className="px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}>
                {loading === game.provider_code ? "..." : "Withdraw"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Promo;
