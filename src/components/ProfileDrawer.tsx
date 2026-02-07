import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
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

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileDrawer = ({ open, onOpenChange }: ProfileDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[90%] p-0 border-none  overflow-hidden flex flex-col h-full"
      >
        {/* Top Profile Section with PNG background - Fixed */}
        <div 
          className="relative p-2 pt-6 flex-shrink-0"
          style={{ backgroundImage: `url(${profileBg})`, backgroundSize: '140%', backgroundPosition: 'top left' }}
        >
          {/* Close button */}
          <SheetClose className="absolute right-4 top-4 z-10">
            
          </SheetClose>

          {/* Avatar and User Info */}
          <div className="flex items-start gap-3 mb-4">
            {/* Avatar with status */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/50">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {/* avatar change icon */}
              <div className="absolute -bottom-1 right-0 w-5 h-5">
                <img src={avatarChange} alt="Status" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* User details */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-lg">1xwin37859</span>
                <img src={pencilIcon} alt="Edit" className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-300 text-sm">ID:37859</span>
                <img src={vipBadge} alt="VIP" className="h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content area with hidden scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 pb-12 bg-[#470211]">
          {/* Balance and VIP Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-white">
              <span className="text-yellow-400">₹0</span>
              <span className="text-gray-400">/₹200</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">VIP1</span>
              <button className="px-4 py-1 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium">
                Upgrade
              </button>
            </div>
          </div>

          {/* Gold Balance Bar */}
          <div 
            className="relative h-14 rounded-lg overflow-hidden flex items-center px-4"
            style={{ backgroundImage: `url(${goldBar})`, backgroundSize: 'cover' }}
          >
            <div className="flex items-center gap-2 flex-1">
              <img src={rupeeCoin} alt="Rupee" className="w-8 h-8" />
              <span className="text-[#470211] font-bold text-xl">20</span>
            </div>
            <div className="flex items-center gap-3">
             
              <img src={withdraw} alt="Bank" className="w-8 h-8" />
            </div>
          </div>

          {/* Menu items */}
          <div className="mt-4 space-y-1">
            {[
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
                  <img src={backArrow} alt="Arrow" className="w-6 h-6 object-contain " />
                </div>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileDrawer;
