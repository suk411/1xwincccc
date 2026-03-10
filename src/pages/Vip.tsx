import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { GameCard } from "@/components/GameCard";
import { GameButton } from "@/components/GameButton";
import { useProfile } from "@/hooks/useProfile";
import { Progress } from "@/components/ui/progress";

import avatar from "@/assets/profile/avatar.png";
import vipBadge from "@/assets/profile/vip-badge.png";
import vipHeaderBg from "@/assets/vip/vip-header-bg.png";
import upgradeIcon from "@/assets/vip/vip-upgrade-icon.png";
import checkinIcon from "@/assets/vip/checkin-icon.png";
import svipIcon from "@/assets/vip/svip-icon.png";

const Vip = () => {
  const navigate = useNavigate();
  const { userId } = useProfile();
  const vipLevel = 0;
  const currentDeposit = 0;
  const requiredDeposit = 200;
  const progressPercent = Math.min((currentDeposit / requiredDeposit) * 100, 100);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="VIP" />

      <div className="flex-1 px-2 pt-3 pb-24 space-y-3">
        {/* Profile Card */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={vipHeaderBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 p-4">
            {/* Avatar + Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-500/50">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-base">
                  User 1xwin{userId || "..."}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="relative w-14 h-5">
                    <img src={vipBadge} alt="VIP" className="w-full h-full object-contain" />
                    <span className="absolute inset-0 flex items-center justify-center pl-3 text-[10px] font-bold text-yellow-300">
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
                  <div className="bg-[#521222]/80 rounded-full px-3 py-0.5 text-xs text-white border border-yellow-600/40">
                    {currentDeposit} / ₹{requiredDeposit}
                  </div>
                </div>
                <Progress value={progressPercent} className="h-2 bg-[#521222]/60" />
              </div>
              <GameButton variant="gold" size="sm" className="text-xs h-7 w-24">
                Become VIP
              </GameButton>
            </div>
          </div>
        </div>

        {/* Upgrade VIP1 Card */}
        <GameCard className="p-0 overflow-hidden">
          <div className="flex items-center p-3 gap-3">
            <img src={upgradeIcon} alt="Upgrade" className="w-16 h-12 object-contain rounded-lg" />
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
