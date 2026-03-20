import PageLayout from "@/components/PageLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_LIST, gameService } from "@/services/gameService";
import { refreshProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const Promo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});

  useEffect(() => {
    // Redirect to home page as per maintenance requirement
    navigate("/", { replace: true });
  }, [navigate]);

  const handleWithdraw = async (providerCode: string, gameName: string) => {
    if (countdowns[providerCode] > 0 || loading === providerCode) return;

    // Start 5-second countdown
    setCountdowns(prev => ({ ...prev, [providerCode]: 5 }));
    
    // Trigger actual withdrawal immediately
    performWithdraw(providerCode, gameName);
    
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const current = prev[providerCode];
        if (current <= 1) {
          clearInterval(interval);
          return { ...prev, [providerCode]: 0 };
        }
        return { ...prev, [providerCode]: current - 1 };
      });
    }, 1000);
  };

  const performWithdraw = async (providerCode: string, gameName: string) => {
    setLoading(providerCode);
    try {
      const result = await gameService.withdraw(providerCode);
      await refreshProfile();
      if (result.moveOut.amount > 0) {
        toast({ title: "Withdrawn ₹" + result.moveOut.amount, description: ` Recall success ` });
      } else {
        toast({ title: "No balance", description: result.msg || "No balance in game " });
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
          {[
            {
              id: "je",
              name: "JILI Wallet",
              provider_code: "JE",
              logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/jiliwallet.png"
            },
            {
              id: "pg",
              name: "PG Wallet",
              provider_code: "PG",
              logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/pgwallet.png"
            },
            {
              id: "jd",
              name: "JD Wallet",
              provider_code: "JD",
              logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/pgwallet.png"
            }
          ].map((wallet) => {
            const isCountdownActive = (countdowns[wallet.provider_code] || 0) > 0;
            const isLoading = loading === wallet.provider_code;
            const isActionDisabled = isCountdownActive || isLoading;

            return (
              <div
                key={wallet.id}
                className="flex items-center gap-3 w-full rounded-xl p-3"
                style={{ background: "linear-gradient(135deg, #5a0a1a 0%, #3a0611 100%)", border: "1px solid rgba(255,180,50,0.3)" }}
              >
                <img src={wallet.logo} alt={wallet.name} className="w-12 h-12 rounded-lg object-contain" />
                <div className="flex-1 text-left">
                  <p className="text-white text-sm font-bold">{wallet.name}</p>
                  <p className="text-muted-foreground text-xs">{wallet.provider_code}</p>
                </div>
                <button
                   disabled={isActionDisabled}
                   onClick={() => handleWithdraw(wallet.provider_code, wallet.name)}
                   className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all ${!isActionDisabled ? "active:scale-95" : ""}`}
                   style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}
                 >
                   {isCountdownActive ? `recalling ${countdowns[wallet.provider_code]}` : "Withdraw"}
                 </button>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default Promo;
