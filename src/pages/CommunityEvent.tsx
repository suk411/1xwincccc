import PageHeader from "@/components/PageHeader";
import girlBanner from "@/assets/events/girl-banner.png";
import casinoBg from "@/assets/events/casino-bg.png";
import cardBg from "@/assets/events/card-bg.png";
import coins from "@/assets/events/coins.png";
import giftBox from "@/assets/events/gift-box.png";
import emptyBox from "@/assets/events/empty-box.png";
import telegramIcon from "@/assets/tabs/telegram-icon.png";
import { useState } from "react";
import { Copy } from "lucide-react";
import { GameButton } from "@/components/GameButton";

const CommunityEvent = () => {
  const [code, setCode] = useState("");

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
      {/* Top Header - matching Bank page header structure */}
      <div className="relative w-full h-12 flex items-center justify-between px-4">
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-white font-bold text-base">Community Event</span>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          {/* Navigation icons can be added here if needed */}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-2 pt-2">
        {/* Hero Banner */}
        <div className="relative w-full rounded-xl overflow-hidden" style={{ minHeight: 160, backgroundImage: `url(${cardBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="relative z-10 flex items-end justify-between px-4 pt-4 pb-3">
            <div className="flex-1">
              <h2 className="text-white font-semibold text-xl leading-tight drop-shadow-lg">
                JOIN THE GROUP TO<br />GRAB GIFT CODES
              </h2>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-white text-sm">Up to</span>
                <span className="text-yellow-400 font-extrabold text-2xl">₹16888</span>
              </div>
            </div>
            <img src={girlBanner} alt="" className="w-32 h-32 object-contain -mb-3" />
          </div>
        </div>

        {/* Redeem Code Section */}
        <div
          className="relative rounded-xl overflow-hidden p-4"
          style={{ backgroundImage: `url(${cardBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <h3 className="text-center text-white font-bold text-base mb-2">Redeem Code</h3>
          <p className="text-center text-[#c4889a] text-xs mb-3">
            Enter the code from the group to claim your reward
          </p>
          <input
            type="text"
            placeholder="Enter 6-digit code."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full h-11 rounded-lg bg-[#541324] border border-[#7a2040] text-white placeholder:text-[#964850] px-4 text-base outline-none mb-3"
          />
          <button
            className="w-full h-11 rounded-lg font-bold text-[#5a2d0a] text-base"
            style={{
              backgroundImage: "linear-gradient(rgb(255, 246, 230) 1%, rgb(238, 210, 110) 44%, rgb(195, 132, 45) 75%, rgb(195, 132, 45) 86%, rgb(255, 205, 78) 100%)",
            }}
          >
            Redeem
          </button>
        </div>

        {/* Join Our Community */}
        <div
          className="relative rounded-xl overflow-hidden p-4"
          style={{ backgroundImage: `url(${casinoBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <h3 className="text-center text-white font-bold text-base mb-3">Join Our Community</h3>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-400 to-yellow-200 flex items-center justify-center">
              <img src={telegramIcon} alt="Telegram" className="w-16 h-16 object-contain" />
            </div>
            <span className="text-yellow-400 text-sm">Telegram Group</span>
            <div className="flex items-center gap-2 bg-[#541324] rounded-lg px-3 py-2">
              <span className="text-[#c4889a] text-xs truncate">https://t.me/...</span>
              <button className="text-orange-500 ">
                <Copy size={14} />
              </button>
            </div>
            <GameButton variant="gold" size="lg" className="w-[120px] mt-2">
              Join Now
            </GameButton>
          </div>
        </div>

        {/* New Player Rewards */}
        <div
          className="relative rounded-xl overflow-hidden p-2 flex items-start gap-3"
          style={{ backgroundImage: `url(${cardBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <img src={giftBox} alt="" className="w-12 h-12 object-contain flex-shrink-0" />
          <div>
            <h4 className="text-white font-bold text-sm">New Player Rewards</h4>
            <p className="text-[#c4889a] text-xs mt-1">
              First-time group members get an exclusive code. Return here to redeem great rewards!
            </p>
          </div>
        </div>

        {/* Daily Cash Codes */}
        <div
          className="relative rounded-xl overflow-hidden p-2 flex items-start gap-3"
          style={{ backgroundImage: `url(${cardBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <img src={coins} alt="" className="w-12 h-12 object-contain flex-shrink-0" />
          <div>
            <h4 className="text-white font-bold text-sm">Daily Cash Codes</h4>
            <p className="text-[#c4889a] text-xs mt-1">
              Cash codes are dropped at random times. First come, first served!
            </p>
          </div>
        </div>

        {/* Redemption History */}
        <div
          className="relative rounded-xl overflow-hidden p-4"
          style={{ backgroundImage: `url(${cardBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <h3 className="text-white font-bold text-sm mb-4">Redemption History</h3>
          <div className="flex flex-col items-center py-4">
            <img src={emptyBox} alt="" className="w-20 h-20 object-contain opacity-40 mb-2" />
            <span className="text-[#c4889a] text-sm">No records</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CommunityEvent;
