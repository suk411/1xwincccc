import { X, Pencil } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import profileBg from "@/assets/profile/profile-bg.png";
import goldBar from "@/assets/profile/gold-bar.png";
import rupeeCircle from "@/assets/profile/rupee-circle.png";
import vipBadge from "@/assets/profile/vip-badge.png";
import rupeeGold from "@/assets/profile/rupee-gold.png";
import coins from "@/assets/profile/coins.png";
import avatar from "@/assets/profile/avatar.png";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileDrawer = ({ open, onOpenChange }: ProfileDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[90%] p-0 border-none bg-[#470211] overflow-hidden"
      >
        {/* Top Profile Section with PNG background */}
        <div 
          className="relative p-4 pt-6"
          style={{ backgroundImage: `url(${profileBg})`, backgroundSize: '120%', backgroundPosition: 'center' }}
        >
          {/* Close button */}
          <SheetClose className="absolute right-4 top-4 z-10">
            <div className="w-8 h-8 rounded-full bg-[#8B0000]/80 flex items-center justify-center">
              <X className="h-5 w-5 text-yellow-400" />
            </div>
          </SheetClose>

          {/* Avatar and User Info */}
          <div className="flex items-start gap-3 mb-4">
            {/* Avatar with status */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/50">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {/* Online status */}
              <div className="absolute -bottom-1 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-[#470211] flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>

            {/* User details */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-lg">1xwin37859</span>
                <Pencil className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-300 text-sm">ID:37859</span>
                <img src={vipBadge} alt="VIP" className="h-5" />
              </div>
            </div>
          </div>
        </div>
        {/* Rest of drawer with solid bg */}
        <div className="flex-1 p-4 bg-[#470211]">
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
              <img src={rupeeCircle} alt="Rupee" className="w-8 h-8" />
              <span className="text-[#470211] font-bold text-xl">20</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={coins} alt="Coins" className="w-8 h-8" />
              <img src={rupeeGold} alt="Add Money" className="w-8 h-8" />
            </div>
          </div>

          {/* Menu items will go here later */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileDrawer;
