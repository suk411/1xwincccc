import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameButton } from "./GameButton";

interface VipLockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IMG_BASE_URL = "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/vipdilog/";

const VipLockModal: React.FC<VipLockModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

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
          className="absolute -top-8 -right-0 w-8 h-8 z-[110] transition-transform active:scale-90"
        >
          <img src={`${IMG_BASE_URL}croosiconvip.png`} alt="Close" className="w-full h-full object-contain" />
        </button>

        {/* Title */}
        <div className="w-[80%] mb-2 z-10">
          <img src={`${IMG_BASE_URL}titlevip.png`} alt="VIP PRIVILEGES" className="w-full object-contain" />
        </div>

        {/* Visual Composition */}
        <div className="relative w-full aspect-square flex items-center justify-center -mt-4">
          {/* Background Coins */}
          <img
            src={`${IMG_BASE_URL}bgcoinsvip.png`}
            alt=""
            className="absolute inset-0 w-full h-full object-contain z-0 scale-105"
          />
          
          {/* Platform */}
          <img
            src={`${IMG_BASE_URL}bottomplatfromvip.png`}
            alt=""
            className="absolute bottom-2 w-[85%] object-contain z-[1]"
          />

          {/* Center Visuals Stack */}
          <div className="relative w-full h-full flex items-center justify-center z-[2]">
             {/* Gold Diamond Behind */}
            <img
              src={`${IMG_BASE_URL}golddaimondvip.png`}
              alt=""
              className="absolute w-[30%] object-contain z-[3]"
            />
            
            {/* White Diamond Highlight */}
            <img
              src={`${IMG_BASE_URL}whitedaimondvip.png`}
              alt=""
              className="absolute w-[30%] object-contain z-[4] animate-pulse"
            />

            {/* Center Badge */}
            <img
              src={`${IMG_BASE_URL}centervip.png`}
              alt="VIP"
              className="absolute w-[40%] object-contain z-[5]"
            />

            {/* Chain Overlay */}
            <img
              src={`${IMG_BASE_URL}chainvip.png`}
              alt=""
              className="absolute w-[75%] object-contain z-[6]"
            />

            {/* Lock Icon */}
            <img
              src={`${IMG_BASE_URL}lockvip.png`}
              alt="Locked"
              className="absolute w-[12%] mt-10 object-contain z-[7]"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-1 -mt-2 mb-4 z-10 w-full">
          <div className="flex items-center gap-1.5 text-white/90 text-[13px] font-medium">
             <img src={`${IMG_BASE_URL}whitedaimondvip.png`} className="w-3.5 h-3.5" alt="" />
             <span>Only VIP users can play this game</span>
          </div>
          <div className="relative flex items-start justify-center w-full px-5">
            <img src={`${IMG_BASE_URL}golddaimondvip.png`} className="absolute left-4 top-0.5 w-4 h-4 shrink-0" alt="" />
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8a00] to-[#ffc700] text-base font-bold text-center leading-tight">
              Deposit to become VIP and unlock access
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full px-8 z-10">
          <GameButton
            variant="red"
            className="w-full h-11 text-lg font-bold shadow-lg"
            onClick={() => {
              onClose();
              navigate("/bank");
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
