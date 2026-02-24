import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { GameCard } from "@/components/GameCard";
import earnBanner from "@/assets/earn/earn-banner.png";
import goldBorder from "@/assets/events/gold-border.png";

const Earn = () => {
  const [activeTab, setActiveTab] = useState<"referral" | "commission">("referral");

  return (
    <main className="relative flex-1 flex flex-col pb-20 max-w-screen-lg mx-auto w-full">
      <PageHeader title="Earn" />

      <div className="flex flex-col gap-2 px-2 pt-2">
        {/* Referral Bonus / Commission tabs */}
        <GameCard className="flex gap-1">
          <button
            onClick={() => setActiveTab("referral")}
            className="flex-1 h-8 rounded-sm text-sm transition-all"
            style={
              activeTab === "referral"
                ? {
                    backgroundImage:
                      "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                    color: "#5a2d0a",
                  }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Referral Bonus
          </button>
          <button
            onClick={() => setActiveTab("commission")}
            className="flex-1 h-8 rounded-sm text-sm transition-all"
            style={
              activeTab === "commission"
                ? {
                    backgroundImage:
                      "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                    color: "#5a2d0a",
                  }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Commission
          </button>
        </GameCard>

        {/* Banner */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={goldBorder}
            alt=""
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            style={{ objectFit: "fill" }}
          />
          <img
            src={earnBanner}
            alt="Earn up to ₹88"
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>

        {activeTab === "referral" ? (
          <GameCard className="p-3 flex flex-col gap-2">
            <span className="text-white text-sm">Referral Bonus</span>
            <p className="text-[#c4889a] text-xs">
              Invite your friends and earn bonus rewards! Share your referral link and get ₹88 for every successful referral.
            </p>
          </GameCard>
        ) : (
          <GameCard className="p-3 flex flex-col gap-2">
            <span className="text-white text-sm">Commission</span>
            <p className="text-[#c4889a] text-xs">
              Earn commission from your referrals' activity. The more they play, the more you earn!
            </p>
          </GameCard>
        )}
      </div>
    </main>
  );
};

export default Earn;
