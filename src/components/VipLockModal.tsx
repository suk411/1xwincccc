import React, { useEffect } from "react";
import { useTransitionNavigate } from "@/providers/NavigationProvider";
import { GameButton } from "./GameButton";
import type { GameObject } from "@/services/gameService";
import { withCacheBust } from "@/lib/cacheBust";

interface VipLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GameObject | null;
}

const IMG_BASE_URL = "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/vipdilog/";
const imgUrl = (name: string) => withCacheBust(IMG_BASE_URL + name);

const VipLockModal: React.FC<VipLockModalProps> = ({ isOpen, onClose, game }) => {
  const { navigateWithTransition } = useTransitionNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-[4px]"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-[340px] flex flex-col items-center animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-7 -right-0 w-7 h-7 z-[110] transition-transform active:scale-90"
        >
          <img src={imgUrl("croosiconvip.png")} alt="Close" className="w-full h-full object-contain" />
        </button>

        {/* Title */}
        <div className="w-[80%] mb-2 z-10">
          <img src={imgUrl("titlevip.png")} alt="VIP PRIVILEGES" className="w-full object-contain" />
        </div>

        {/* Visual Composition */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center -mt-2">
          <img
            src={imgUrl("bgcoinsvip.png")}
            alt=""
            className="absolute inset-0 w-full h-full object-contain z-0 scale-105"
          />
          <img
            src={imgUrl("bottomplatfromvip.png")}
            alt=""
            className="absolute bottom-2 w-[85%] object-contain z-[1]"
          />
          <div className="relative w-[85%] h-[85%] flex items-center justify-center z-[2]">
            <img src={imgUrl("golddaimondvip.png")} alt="" className="absolute w-[28%] object-contain z-[3]" />
            <img src={imgUrl("whitedaimondvip.png")} alt="" className="absolute w-[28%] object-contain z-[4] animate-pulse" />
            <img src={imgUrl("centervip.png")} alt="VIP" className="absolute w-[36%] object-contain z-[5]" />
            <img src={imgUrl("chainvip.png")} alt="" className="absolute w-[65%] object-contain z-[6]" />
            <img src={imgUrl("lockvip.png")} alt="Locked" className="absolute w-[10%] mt-8 object-contain z-[7]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-0.5 -mt-1 mb-3 z-10 w-full">
          <div className="flex items-center gap-1 text-white/90 text-[12px] font-medium">
             <img src={imgUrl("whitedaimondvip.png")} className="w-3 h-3" alt="" />
             <span>Only VIP users can play this game</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 w-full px-5">
            <img src={imgUrl("golddaimondvip.png")} className="w-3.5 h-3.5 shrink-0" alt="" />
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8a00] to-[#ffc700] text-sm font-bold text-center leading-tight">
              Deposit to become VIP and unlock access
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center w-full px-6 z-10">
          <GameButton
            variant="red"
            type="prompt"
            className="w-full"
            onClick={() => {
              onClose();
              navigateWithTransition("/bank");
            }}
          >
            Go to Deposit
          </GameButton>
        </div>
      </div>
    </div>
  );
};

export default VipLockModal;
