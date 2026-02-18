import PageLayout from "@/components/PageLayout";
import bannerVideo from "@/assets/banner-video.mp4";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ChevronRight } from "lucide-react";
import avatar from "@/assets/profile/avatar.png";
import rupeeCoin from "@/assets/profile/coin-rupee.png";
import depositIcon from "@/assets/bank/deposit-icon.png";
import withdrawIcon from "@/assets/bank/withdraw-icon.png";
import vipIcon from "@/assets/bank/vip-icon.png";
import tabCardBg from "@/assets/tabs/tab-card-bg.png";
import firstDepositIcon from "@/assets/tabs/first-deposit-icon.png";
import giftIcon from "@/assets/tabs/gift-icon.png";
import slotsIcon from "@/assets/tabs/slots-icon.png";
import casinoIcon from "@/assets/tabs/casino-icon.png";
import telegramIcon from "@/assets/tabs/telegram-icon.png";

const winMessages = [
  "User d****z successfully withdrew 20000!",
  "User q*******i won 3000 in mahjongS!",
  "User v****k successfully withdrew 10000!",
  "User a****m won 5000 in Roulette!",
  "User s****p successfully withdrew 8000!",
  "User r****j won 15000 in Teen Patti!",
  "User m****n successfully withdrew 25000!",
  "User k****l won 7500 in Slots!",
  "User b****t successfully withdrew 12000!",
  "User h****e won 9000 in Crash!",
];

const categoryTabs = [
  { icon: firstDepositIcon, label: "1ST DEPOSIT" },
  { icon: giftIcon, label: "RELIEF" },
  { icon: slotsIcon, label: "SLOTS" },
  { icon: casinoIcon, label: "CASINO REBET" },
  { icon: telegramIcon, label: "GROUP" },
];

const Index = () => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerText, setTickerText] = useState("");

  useEffect(() => {
    const repeated = [...winMessages, ...winMessages, ...winMessages].join("   🎰   ");
    setTickerText(repeated);
  }, []);

  return (
    <PageLayout>
      <div className="flex-1 flex flex-col gap-0 -mt-4">
        {/* Video Banner */}
        <div className="relative w-full rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={bannerVideo}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="w-full h-auto block"
          />
          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
          >
            {muted ? (
              <VolumeX size={16} className="text-white" />
            ) : (
              <Volume2 size={16} className="text-white" />
            )}
          </button>
        </div>

        {/* Scrolling Notice Ticker */}
        <div className="w-full bg-[#1a1028] border-y border-[#2a1a3a] py-1.5 overflow-hidden flex items-center gap-2 px-2 mt-2 rounded-lg">
          <span className="text-xs flex-shrink-0">🔊</span>
          <div className="overflow-hidden flex-1 relative">
            <div
              ref={tickerRef}
              className="whitespace-nowrap animate-ticker text-xs text-muted-foreground"
            >
              {tickerText}
            </div>
          </div>
        </div>

        {/* Profile Wallet Bar */}
        <div
          className="relative w-full rounded-full flex items-center px-1.5 py-1.5 mt-2"
          style={{
            background: 'linear-gradient(135deg, #5a0a1a 0%, #3a0611 50%, #4a0915 100%)',
            border: '1.5px solid rgba(255, 180, 50, 0.45)',
            boxShadow: '0 0 8px rgba(255, 150, 30, 0.15)',
          }}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500/60 flex-shrink-0">
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-1.5 ml-3 flex-1">
            <img src={rupeeCoin} alt="₹" className="w-5 h-5 object-contain" />
            <span className="text-yellow-400 font-bold text-base">1.40</span>
          </div>
          <div className="flex items-center gap-3 mr-1">
            <button className="flex flex-col items-center gap-0.5">
              <img src={depositIcon} alt="Deposit" className="w-6 h-6 object-contain" />
              <span className="text-[8px] text-muted-foreground leading-none">Deposit</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <img src={withdrawIcon} alt="Withdraw" className="w-6 h-6 object-contain" />
              <span className="text-[8px] text-muted-foreground leading-none">Withdraw</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <img src={vipIcon} alt="VIP" className="w-6 h-6 object-contain" />
              <span className="text-[8px] text-muted-foreground leading-none">VIP</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {categoryTabs.map((tab, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-1 flex-shrink-0 w-[72px]"
            >
              <div
                className="w-[68px] h-[68px] rounded-2xl overflow-hidden flex items-center justify-center p-2"
                style={{
                  backgroundImage: `url(${tabCardBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <img src={tab.icon} alt={tab.label} className="w-12 h-12 object-contain" />
              </div>
              <span className="text-[9px] text-muted-foreground font-semibold leading-tight text-center">
                {tab.label}
              </span>
            </button>
          ))}
          <button className="flex-shrink-0 w-8 h-[68px] flex items-center justify-center">
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
