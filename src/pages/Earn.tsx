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

        {/* Bonus Card */}
        <GameCard className="p-3 flex flex-col gap-3">
          {/* Pending Bonus */}
          <div>
            <span className="text-white/70 text-xs">Pending Bonus</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#f5c842] text-xl font-bold">₹0</span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-white font-medium"
                style={{ backgroundColor: "rgb(5, 121, 45)" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.16804 0.0726189L8.55879 3.95812C8.58568 3.98883 8.60316 4.02664 8.60912 4.06702C8.61508 4.10741 8.60928 4.14865 8.59241 4.18583C8.57554 4.223 8.54831 4.25452 8.51398 4.27662C8.47966 4.29872 8.43969 4.31046 8.39887 4.31043H6.73223C6.68101 4.30999 6.6314 4.32829 6.59274 4.36189C6.55409 4.39549 6.52904 4.44206 6.52234 4.49284C6.3974 5.39737 5.64279 9.39781 2.06964 9.99C2.02297 9.99901 1.97462 9.99211 1.93234 9.97039C1.89006 9.94868 1.85629 9.9134 1.83643 9.87022C1.81656 9.82704 1.81176 9.77845 1.82278 9.73221C1.8338 9.68598 1.86002 9.64477 1.89723 9.6152C2.50941 9.13545 3.309 8.20592 3.53388 6.55178C3.62022 5.87979 3.66195 5.20283 3.65882 4.52532C3.65883 4.46852 3.63662 4.41397 3.59692 4.37335C3.55723 4.33272 3.50321 4.30924 3.44643 4.30793H1.61487C1.57405 4.30796 1.53408 4.29622 1.49976 4.27412C1.46543 4.25202 1.43821 4.2205 1.42133 4.18333C1.40446 4.14616 1.39866 4.10491 1.40462 4.06452C1.41058 4.02414 1.42806 3.98633 1.45495 3.95562L4.8482 0.0726189C4.86814 0.0498103 4.89272 0.0315301 4.9203 0.019005C4.94789 0.00647998 4.97783 0 5.00812 0C5.03841 0 5.06836 0.00647998 5.09594 0.019005C5.12352 0.0315301 5.1481 0.0498103 5.16804 0.0726189Z" fill="white"/>
                </svg>
                Today's Earnings+₹0
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

          {/* Claimable Bonus */}
          <div
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{ backgroundColor: "rgb(112, 28, 50)" }}
          >
            <div>
              <span className="text-white/70 text-xs">Claimable Bonus</span>
              <p className="text-white text-base font-bold">₹0</p>
            </div>
            <button
              className="h-8 px-4 rounded text-sm font-bold"
              style={{
                backgroundImage: "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                color: "#5a2d0a",
              }}
            >
              Claim Now
            </button>
          </div>
        </GameCard>
      </div>
    </main>
  );
};

export default Earn;
