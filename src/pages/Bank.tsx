import { useNavigate } from "react-router-dom";
import { GameCard } from "@/components/GameCard";
import headerBg from "@/assets/bank/header-bg.png";
import bankIcon from "@/assets/bank/bank-icon.png";
import backArrow from "@/assets/icons/back-arrow.png";
import depositBadge from "@/assets/bank/deposit-badge.png";
import { useState } from "react";
import { Info, ChevronRight } from "lucide-react";

const Bank = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  return (
    <main className="relative flex-1 flex flex-col pb-20 max-w-screen-lg mx-auto w-full">
      {/* Top Header with red bg */}
      <div className="relative w-full h-14 flex items-center justify-between px-4">
        <img
          src={headerBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Left: icon + balance */}
        <div className="relative z-10 flex items-center gap-2">
          <img src={bankIcon} alt="Bank" className="w-8 h-8 object-contain" />
          <div className="flex items-center gap-1">
            <span className="text-white/70 text-sm">Balance:</span>
            <span className="text-primary font-bold text-base">₹1.4</span>
          </div>
        </div>
        {/* Right: records & help icons */}
        <div className="relative z-10 flex items-center gap-3">
          <button className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 3v18" />
            </svg>
          </button>
          <button className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4">
        {/* Deposit / Withdraw tabs */}
        <GameCard className="p-1.5 flex gap-2">
          <button
            onClick={() => setActiveTab("deposit")}
            className="flex-1 h-9 rounded-md text-sm font-bold transition-all"
            style={
              activeTab === "deposit"
                ? {
                    backgroundImage:
                      "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                    color: "#5a2d0a",
                  }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className="flex-1 h-9 rounded-md text-sm font-bold transition-all"
            style={
              activeTab === "withdraw"
                ? {
                    backgroundImage:
                      "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                    color: "#5a2d0a",
                  }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Withdraw
          </button>
        </GameCard>

        {/* Pending orders */}
        <GameCard className="px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-primary" />
            <span className="text-white text-xs">You have 1 pending orders</span>
            <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              1
            </span>
          </div>
          <ChevronRight size={18} className="text-primary" />
        </GameCard>

        {/* Choose Deposit Amount */}
        <GameCard className="p-3 flex flex-col gap-2">
          <span className="text-white font-bold text-sm">Choose Deposit Amount</span>
          <div className="grid grid-cols-3 gap-2">
            {[200, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000].map((amount) => {
              const isActive = amount === 200;
              return (
                <div
                  key={amount}
                  className="relative rounded-md overflow-hidden flex flex-col"
                  style={{
                    backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)",
                  }}
                >
                  {/* Badge */}
                  <img
                    src={depositBadge}
                    alt=""
                    className="absolute top-0 left-0 w-8 h-5 object-contain"
                  />
                  <span className="absolute top-0.5 left-1 text-white text-[8px] font-bold">1st</span>
                  {/* Amount */}
                  <span className="text-white font-bold text-base text-center pt-4 pb-0.5">{amount.toLocaleString()}</span>
                  {/* Bonus strip */}
                  <div
                    className="text-center text-[11px] font-bold py-0.5 rounded-b-md"
                    style={{
                      backgroundImage: "linear-gradient(156deg, rgb(255, 213, 103) 0%, rgb(255, 167, 74) 98%)",
                      color: "#5a2d0a",
                    }}
                  >
                    +1.4
                  </div>
                </div>
              );
            })}
          </div>
        </GameCard>

        {/* Back arrow row */}
        <div className="flex items-center gap-2 mt-1">
          <button onClick={() => navigate(-1)} className="w-6 h-6">
            <img src={backArrow} alt="Back" className="w-full h-full object-contain" />
          </button>
          <span className="text-white/70 text-sm">Back</span>
        </div>
      </div>
    </main>
  );
};

export default Bank;
