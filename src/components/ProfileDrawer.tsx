import { useEffect, useCallback, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { useTransitionNavigate } from "@/providers/NavigationProvider";
import { GameButton } from "./GameButton";
import { authService } from "@/services/authService";
import { useProfile } from "@/hooks/useProfile";
import profileBg from "@/assets/profile/profile-bg.png";
import goldBar from "@/assets/profile/gold-bar.png";
import rupeeCoin from "@/assets/profile/coin-rupee.png";
import deposit from "@/assets/bank/deposit-icon.png";
import withdraw from "@/assets/profile/withdrawal.png";
import vipBadge1 from "@/assets/vip/vip-badge-1.png";
import vipBadge2 from "@/assets/vip/vip-badge-2.png";
import vipBadge3 from "@/assets/vip/vip-badge-3.png";
import vipBadge4 from "@/assets/vip/vip-badge-4.png";
import vipBadge5 from "@/assets/vip/vip-badge-5.png";

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
import versionIcon from "@/assets/profile/version-info.png";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VIP_THRESHOLDS = [0, 200, 400, 1000, 2000, 3000];
const VIP_BADGES = [vipBadge1, vipBadge2, vipBadge3, vipBadge4, vipBadge5];
const getVipBadge = (idx: number) => VIP_BADGES[Math.min(idx, VIP_BADGES.length - 1)];

const ProfileDrawer = ({ open, onOpenChange }: ProfileDrawerProps) => {
  const { navigateWithTransition } = useTransitionNavigate();
  const { balance, userId, refresh } = useProfile(false);
  const { copyToClipboard } = useCopyToClipboard();
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


  const appVersion = localStorage.getItem('app_version') || '1.0.0';

  const handleMenuClick = (label: string) => {
    onOpenChange(false);
    if (label === "Logout") {
      authService.logout();
      window.location.href = "/";
    } else if (label === "Deposit History") {
      navigateWithTransition("/bank/records");
    } else if (label === "Withdrawal History") {
      navigateWithTransition("/bank/withdrawals");
    } else if (label === "Deposit") {
      navigateWithTransition("/bank");
    } else if (label === "Withdrawal") {
      navigateWithTransition("/bank");
    } else if (label === "VIP") {
      navigateWithTransition("/vip");
    } else if (label === "Game Records") {
      navigateWithTransition("/bet-records");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[81%] p-0 border-none flex flex-col h-full"
      >
        {/* Top Profile Section */}
        <div
          className="relative p-1.5 pt-4 flex-shrink-0"
          style={{ backgroundImage: `url(${profileBg})`, backgroundSize: '140%', backgroundPosition: 'top left' }}
        >
          {/* Close button */}
          <SheetClose className="absolute right-4 top-4 z-10" />

          {/* Avatar and User Info */}
          <div className="flex items-start gap-2 mb-2">
            {/* Avatar with status */}
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-500/50">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {/* avatar change icon */}
              <div className="absolute -bottom-1 right-0 w-5 h-5">
                <img src={avatarChange} alt="Change" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* User details */}
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="text-white font-semibold text-sm">KING{userId || "..."}</span>
              </div>
              <div className="flex items-center mt-0.5">
                <span className="text-gray-300 text-xs">ID:{userId || "..."}</span>
                <button
                  onClick={() => {
                    if (userId) {
                      copyToClipboard(userId, "Copied Success");
                    }
                  }}
                  className="ml-1 p-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                </button>

                {/* VIP badge - clickable to open VIP page */}
                <button
                  onClick={() => { onOpenChange(false); navigateWithTransition("/vip"); }}
                  className="ml-1 cursor-pointer"
                >
                  <img src={getVipBadge(vipLevelIndex)} alt="VIP" className="w-48 h-20 object-contain" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pt-1 pb-8 bg-[#470211] ">


          {/* Gold Balance Bar */}
          <div
            className="relative h-9 rounded-lg flex items-center px-3"
            style={{ backgroundImage: `url(${goldBar})`, backgroundSize: 'cover' }}
          >
            <div className="flex items-center gap-1.5 flex-1">
              <img src={rupeeCoin} alt="Rupee" className="w-6 h-6" />
              <span className="text-[#470211] font-bold text-sm">{balance.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={withdraw} alt="Bank" className="w-6 h-6" />
            </div>
          </div>

          {/* Menu items */}
          <div className="mt-2 space-y-0.5">
            {[
              { icon: deposit, label: "Deposit" },
              { icon: withdraw, label: "Withdrawal" },
              { icon: vipIcon, label: "VIP" },
              { icon: historyIcon, label: "Deposit History" },
              { icon: historyIcon, label: "Withdrawal History" },
              { icon: gameIcon, label: "Game Records" },
              { icon: inviteIcon, label: "Invitation Records" },
              { icon: mailicon, label: "Mail" },
              { icon: languageIcon, label: "Language", value: "English" },
              { icon: accountIcon, label: "Account Settings" },
              { icon: versionIcon, label: "Version Info", value: `v${appVersion}` },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.label)}
                className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={item.icon} alt={item.label} className="w-6 h-6 object-contain" />
                  <span className="text-white text-xs">{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.value && (
                    <span className="text-gray-400 text-xs">
                      {item.value}
                    </span>
                  )}
                  <img src={backArrow} alt="Arrow" className="w-5 h-5 object-contain" />
                </div>
              </button>
            ))}
            
            {/* Logout button with new UI */}
            <div className="mt-12 pt-4 border-t border-white/10 flex justify-center">
              <GameButton
                variant="red"
                style={{ width: "84%" }}
                onClick={() => handleMenuClick("Logout")}
              >
                Logout
              </GameButton>
            </div>
          </div>

          {/* App Version Display removed to use the new menu item instead */}
        </div>
      </SheetContent>

    </Sheet>
  );
};

export default ProfileDrawer;
