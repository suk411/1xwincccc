import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPOSIT_BONUS_DATA = [
  { deposit: 30000, reward: 7500 },
  { deposit: 20000, reward: 6000 },
  { deposit: 10000, reward: 3000 },
  { deposit: 8000, reward: 2000 },
  { deposit: 5000, reward: 1250, isHot: true },
];

const PosterModal: React.FC<PosterModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[270px] flex flex-col items-center">
        {/* Main Content Area - Clickable */}
        <div 
          onClick={() => {
            navigate('/bank');
            onClose();
          }}
          className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl cursor-pointer active:scale-[0.98] transition-transform"
        >
          {/* Background Image */}
          <img 
            src="https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/assets/1stdepositbonus.png" 
            alt="Deposit Bonus"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=First+Deposit+Bonus';
            }}
          />

          {/* Overlay Content - No backgrounds, just text/amount alignment */}
          <div className="absolute inset-0 flex flex-col items-center pt-8 px-3">
            {/* Top Highlight Amount */}
            <div className="mt-[-10] ml-32 flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
           
              <span style={{ color: 'rgb(252, 246, 136)' }} className="font-black text-2xl italic tracking-tight">7500</span>
            </div>
             {/* Top deposit amount */}
              <div className="mt-5 ml-36 flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
           
              <span style={{ color: 'rgb(252, 246, 136)' }} className="font-light text-sm italic tracking-tight">30000</span>
            </div>
    
            {/* Table Area */}
            <div className="w-full mt-auto mb-12 mr-2">
              {/* Extra Highlight Amount on top of table */}
              <div className="flex justify-center mb-[6.5rem] ml-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                <span style={{ color: 'rgb(252, 246, 136)' }} className="font-black text-xl italic tracking-tight">7500</span>
              </div>

              {/* Table Rows - Simplified to text only */}
              <div className="flex flex-col gap-0">
                {DEPOSIT_BONUS_DATA.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between px-1 py-0 relative"
                  >
                    <div className="flex-1 text-center">
                      <span className="text-white font-semibold text-[11px]">{item.deposit.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex-shrink-0 mx-3">
                       <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-0.5 relative">
                      <span className="text-white font-semibold text-[11px]">+{item.reward.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Close Button - Bottom Center, Image based */}
        <button 
          onClick={onClose}
          className="mt-0 w-10 h-10 flex items-center justify-center active:scale-90 transition-transform"
        >
          <img 
            src="https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/assets/cross%20icon.png" 
            alt="Close" 
            className="w-5 h-5 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default PosterModal;
