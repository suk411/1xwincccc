import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Progress } from "@/components/ui/progress";
import { GameButton } from "@/components/GameButton";
import { GameCard } from "@/components/GameCard";

import avatar from "@/assets/profile/avatar.png";
import vipBadge from "@/assets/profile/vip-badge.png";
import vipHeaderBg from "@/assets/vip/vip-header-bg.png";
import upgradeIcon from "@/assets/vip/vip-upgrade-icon.png";
import checkinIcon from "@/assets/vip/checkin-icon.png";
import svipIcon from "@/assets/vip/svip-icon.png";
import backArrow from "@/assets/icons/back-arrow.png";

const Vip = () => {
  const navigate = useNavigate();
  const { userId } = useProfile();
  const vipLevel = 0;
  const currentDeposit = 0;
  const requiredDeposit = 200;
  const progressPercent = Math.min((currentDeposit / requiredDeposit) * 100, 100);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header + Profile Card */}
      <div className="sticky top-0 z-30">
        {/* Red Header Bar */}
        <div className="relative w-full h-11 flex items-center justify-center">
          <img
            src={vipHeaderBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center"
          >
            <img src={backArrow} alt="Back" className="w-5 h-5 object-contain" />
          </button>
          <h1 className="relative z-10 text-white font-semibold tracking-wide">VIP</h1>
        </div>

        {/* Gold Profile Card */}
        <div
          className="mx-2 -mt-0.5 rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #c8922a 0%, #f5d96e 30%, #e2b23a 60%, #a87420 100%)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <div className="p-4">
            {/* Avatar + Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-800/50 shadow-md">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[#3a1a00] font-bold text-base drop-shadow-sm">
                  User 1xwin{userId || "..."}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="relative w-14 h-5">
                    <img src={vipBadge} alt="VIP" className="w-full h-full object-contain" />
                    <span className="absolute inset-0 flex items-center justify-center pl-3 text-[10px] font-bold text-yellow-900">
                      VIP{vipLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Row */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-[#5a3000]/40 rounded-full px-3 py-0.5 text-xs text-[#3a1a00] font-semibold border border-yellow-800/30">
                    {currentDeposit} / ₹{requiredDeposit}
                  </div>
                </div>
                <Progress value={progressPercent} className="h-2 bg-[#8a5a10]/40 [&>div]:bg-[#5a3000]" />
              </div>
              <GameButton variant="gold" size="sm" className="text-xs h-7 w-24 shadow-md">
                Become VIP
              </GameButton>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Cards */}
      <div className="flex-1 px-2 pt-3 pb-24 space-y-3">
        {/* Upgrade VIP1 Card */}
        <GameCard className="p-0 overflow-hidden">
          <div className="flex items-center p-3 gap-3">
            <img src={upgradeIcon} alt="Upgrade" className="w-14 h-12 object-contain" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Upgrade VIP1</p>
              <p className="text-gray-300 text-xs">
                Claimable <span className="text-yellow-400 font-bold">₹2</span>
              </p>
            </div>
            <GameButton
              variant="mute"
              size="sm"
              className="text-xs h-7 w-20 border border-[rgba(183,69,83,0.5)]"
            >
              Upgrade
            </GameButton>
          </div>
        </GameCard>

        {/* VIP Check-In Card */}
        <GameCard className="p-0 overflow-hidden">
          <div className="flex items-center p-3 gap-3">
            <img src={checkinIcon} alt="Check-In" className="w-12 h-12 object-contain" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">VIP Check-In</p>
              <p className="text-gray-300 text-xs">Daily Cash</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-yellow-400 font-bold text-lg">₹160</span>
              <GameButton
                variant="mute"
                size="sm"
                className="text-xs h-6 w-14 border border-[rgba(183,69,83,0.5)]"
              >
                View
              </GameButton>
            </div>
          </div>
        </GameCard>

        {/* SVIP Unlock Rebate Card */}
        <GameCard className="p-0 overflow-hidden">
          <div className="flex items-center p-3 gap-3">
            <img src={svipIcon} alt="SVIP" className="w-12 h-12 object-contain" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">SVIP Unlock Rebate</p>
              <p className="text-gray-300 text-xs">Daily loss rebate up to 40%</p>
            </div>
            <GameButton
              variant="red"
              size="sm"
              className="text-xs h-7 w-20"
              onClick={() => navigate("/bank")}
            >
              Deposit
            </GameButton>
          </div>
        </GameCard>
      </div>
    </div>
  );
};

export default Vip;
