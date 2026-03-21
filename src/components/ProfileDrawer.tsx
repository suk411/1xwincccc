import { useEffect, useCallback, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { GameButton } from "./GameButton";
import { authService } from "@/services/authService";
import { useProfile } from "@/hooks/useProfile";
import { Progress } from "@/components/ui/progress";
import profileBg from "@/assets/profile/profile-bg.png";
import goldBar from "@/assets/profile/gold-bar.png";
import rupeeCoin from "@/assets/profile/coin-rupee.png";
import vipBadge from "@/assets/profile/vip-badge.png";
import withdraw from "@/assets/profile/withdrawal.png";

import avatar from "@/assets/profile/avatar.png";
import avatarChange from "@/assets/profile/avatar-change.png";
import pencilIcon from "@/assets/profile/pencil-icon.png";

// Menu icons
import logout from "@/assets/profile/logout.png";
import historyIcon from "@/assets/profile/history-icon.png";
import gameIcon from "@/assets/profile/game-icon.png";
import inviteIcon from "@/assets/profile/invite-icon.png";
import accountIcon from "@/assets/profile/account.png";
import languageIcon from "@/assets/profile/language-icon.png";

import mailicon from "@/assets/profile/mail-icon.png";
import backArrow from "@/assets/icons/back-arrow.png";
import vipIcon from "@/assets/profile/vip-icon.png";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VIP_THRESHOLDS = [0, 200, 400, 1000, 2000, 3000];

const ProfileDrawer = ({ open, onOpenChange }: ProfileDrawerProps) => {
  const navigate = useNavigate();
  const { balance, userId, refresh } = useProfile(false);
  const [vipData, setVipData] = useState<import("@/services/authService").VipResponse | null>(null);

  useEffect(() => {
    if (open) {
      refresh();
      authService.getVip().then(setVipData).catch(() => { });
    }
  }, [open]);

  const vipLevelRaw = vipData?.vipLevel ?? 0;
  const vipLevelStr = String(vipLevelRaw);
  const isSvip = vipLevelStr.toUpperCase().startsWith("SVIP");
  const vipLevelIndex = isSvip
    ? VIP_THRESHOLDS.length - 1
    : Math.min(VIP_THRESHOLDS.length - 1, Math.max(0, Number(vipLevelStr.replace(/\D/g, "")) || 0));
  const displayVipLevel = isSvip ? vipLevelStr : `VIP${vipLevelIndex}`;
  const totalDeposits = Number(vipData?.totalDeposits ?? 0);
  const nextThreshold = isSvip ? VIP_THRESHOLDS[VIP_THRESHOLDS.length - 1] : VIP_THRESHOLDS[Math.min(vipLevelIndex + 1, VIP_THRESHOLDS.length - 1)];
  const progressPercent = nextThreshold > 0 ? Math.min((totalDeposits / nextThreshold) * 100, 100) : 0;

  const appVersion = localStorage.getItem('app_version') || '1.0.0';

  const handleMenuClick = (label: string) => {
    onOpenChange(false);
    if (label === "Logout") {
      authService.logout();
      window.location.href = "/";
    } else if (label === "Deposit History") {
      navigate("/bank/records");
    } else if (label === "Withdrawal History") {
      navigate("/bank/withdrawals");
    } else if (label === "Deposit") {
      navigate("/bank");
    } else if (label === "Withdrawal") {
      navigate("/bank");
    } else if (label === "VIP") {
      navigate("/vip");
    } else if (label === "Game Records") {
      navigate("/bet-records");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[90%] p-0 border-none flex flex-col h-full"
      >
        {/* Top Profile Section */}
        <div
          className="relative p-2 pt-6 flex-shrink-0"
          style={{ backgroundImage: `url(${profileBg})`, backgroundSize: '140%', backgroundPosition: 'top left' }}
        >
          {/* Close button */}
          <SheetClose className="absolute right-4 top-4 z-10" />

          {/* Avatar and User Info */}
          <div className="flex items-start gap-3 mb-4">
            {/* Avatar with status */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/50">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {/* avatar change icon */}
              <div className="absolute -bottom-1 right-0 w-5 h-5">
                <img src={avatarChange} alt="Change" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* User details */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-lg">KING{userId || "..."}</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-gray-300 text-sm">ID:{userId || "..."}</span>
                <button
                  onClick={() => {
                    if (userId) {
                      navigator.clipboard.writeText(userId);
                      toast({ description: "User ID copied to clipboard" });
                    }
                  }}
                  className="ml-1 p-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                </button>

                {/* VIP badge with level text overlay */}
                <div className="relative ml-2 w-16 h-6">
                  <img src={vipBadge} alt="VIP" className="w-full h-full  object-contain" />
                  <span className="absolute inset-0 flex items-center justify-center pl-4 text-[12px] font-bold text-yellow-300">
                    {displayVipLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-2 pb-12 bg-[#470211] ">
          {/* VIP Progress Section */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-white">
              <span className="text-yellow-400">₹{totalDeposits.toLocaleString()}</span>
              <span className="text-gray-400">/₹{nextThreshold.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{isSvip ? displayVipLevel : `VIP${vipLevelIndex + 1}`}</span>
              <GameButton
                variant="red"
                size="sm"
                className="w-20 h-6 text-[10px]"
                onClick={() => { onOpenChange(false); navigate("/vip"); }}
              >
                Upgrade
              </GameButton>
            </div>
          </div>

          {/* VIP Progress Bar */}
          <Progress
            value={progressPercent}
            className="h-2 mb-4 border-[0.8px] border-[rgb(112,28,50)] bg-[rgb(112,28,50)] rounded-[20px] [&>div]:bg-[linear-gradient(105deg,#f5d742_100%,#51f542_90%,#a67a00_20%)]"
          />

          {/* Gold Balance Bar */}
          <div
            className="relative h-12 rounded-lg flex items-center px-4"
            style={{ backgroundImage: `url(${goldBar})`, backgroundSize: 'cover' }}
          >
            <div className="flex items-center gap-2 flex-1">
              <img src={rupeeCoin} alt="Rupee" className="w-8 h-8" />
              <span className="text-[#470211] font-bold text-xl">{balance.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={withdraw} alt="Bank" className="w-8 h-8" />
            </div>
          </div>

          {/* Menu items */}
          <div className="mt-4 space-y-1">
            {[
              { icon: withdraw, label: "Deposit" },
              { icon: withdraw, label: "Withdrawal" },
              { icon: vipIcon, label: "VIP" },
              { icon: logout, label: "Deposit History" },
              { icon: historyIcon, label: "Withdrawal History" },
              { icon: gameIcon, label: "Game Records" },
              { icon: inviteIcon, label: "Invitation Records" },
              { icon: mailicon, label: "Mail" },
              { icon: languageIcon, label: "Language", value: "English" },
              { icon: accountIcon, label: "Account Settings" },
              { icon: logout, label: "Logout" },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.label)}
                className="w-full flex items-center justify-between py-3 px-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={item.icon} alt={item.label} className="w-8 h-8 object-contain" />
                  <span className="text-white text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className="text-gray-400 text-sm">{item.value}</span>
                  )}
                  <img src={backArrow} alt="Arrow" className="w-6 h-6 object-contain" />
                </div>
              </button>
            ))}
          </div>

          {/* App Version Display */}
          <div className="mt-8 mb-4 flex justify-center">
            <span className="text-gray-500 text-xs font-mono">[{appVersion}]</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileDrawer;
