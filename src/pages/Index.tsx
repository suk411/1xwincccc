import PageLayout from "@/components/PageLayout";
import { useNavigate } from "react-router-dom"; // Add this import
import bannerVideo from "@/assets/banner-video.mp4";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import avatar from "@/assets/profile/avatar.png";
import rupeeCoin from "@/assets/profile/coin-rupee.png";
import depositIcon from "@/assets/bank/deposit-icon.png";
import withdrawIcon from "@/assets/bank/withdraw-icon.png";
import vipIcon from "@/assets/bank/vip-icon.png";
import tabCardBg from "@/assets/tabs/tab-card-bg.png";
import giftIcon from "@/assets/bank/gift-box-small.png";
import telegramIcon from "@/assets/tabs/telegram-icon.png";
import headerGlow from "@/assets/header-glow.png";
import googlePlayBadge from "@/assets/download/google-play.png";
import appStoreBadge from "@/assets/download/app-store.png";
import logo from "@/assets/logo.png";
import phoneMockup from "@/assets/download/phone-mockup.png";
import promoCharacter from "@/assets/download/promo-character.png";

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
  { icon: giftIcon, label: "1ST DEPOSIT" },
  { icon: telegramIcon, label: "GROUP" },
];

const Index = () => {
  const navigate = useNavigate(); // Add navigation hook
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerText, setTickerText] = useState("");

  useEffect(() => {
    const repeated = [...winMessages, ...winMessages, ...winMessages].join("      ");
    setTickerText(repeated);
  }, []);

  // Handle tab navigation
  const handleTabClick = (label: string) => {
    if (label === "GROUP") {
      navigate("/community-event");
    }
    // Add more tab navigation logic here if needed
  };

  return (
    <PageLayout>
      <div className="flex-1 flex flex-col gap-0 pb-12 -mt-4">
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
            className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center"
          >
            {muted ? (
              <VolumeX size={12} className="text-white" />
            ) : (
              <Volume2 size={12} className="text-white" />
            )}
          </button>
        </div>

        {/* Scrolling Notice Ticker */}
        <div className="w-full h-6 bg-[#3d0a0a] border border-[#471414]  overflow-hidden flex items-center gap-2 px-2 mt-2 mx-0.5 rounded-[6px]">
          <Volume2 size={16}/> 
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
          className="relative h-11 w-full rounded-full flex items-center px-3 mt-2"
          style={{
            background: 'linear-gradient(135deg, #5a0a1a 0%, #3a0611 50%, #4a0915 100%)',
            border: '1.5px solid rgba(255, 180, 50, 0.45)',
            boxShadow: '0 0 8px rgba(255, 150, 30, 0.15)',
          }}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-yellow-500/60 flex-shrink-0">
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-1.5 ml-3 flex-1">
            <img src={rupeeCoin} alt="₹" className="w-4 h-4 object-contain" />
            <span className="text-white font-bold  text-[14px] ">1.40</span>
          </div>
          <div className="flex items-center gap-4 mr-3">
            <button className="flex flex-col items-center gap-0.5">
              <img src={depositIcon} alt="Deposit" className="w-5 h-5 object-contain" />
              <span className="text-[8px] ">Deposit</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <img src={withdrawIcon} alt="Withdraw" className="w-5 h-5 object-contain" />
              <span className="text-[8px] ">Withdraw</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <img src={vipIcon} alt="VIP" className="w-5 h-5 object-contain" />
              <span className="text-[8px] ">VIP</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center  pt-1 mt-2 bg-black rounded-lg overflow-x-auto scrollbar-hide pb-1">
          {categoryTabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(tab.label)} // Add click handler
              className="flex flex-col ml-2 items-center gap-0.5 flex-shrink-0 w-[70px] cursor-pointer hover:scale-105 transition-transform"
            >
              <div
                className="relative w-[70px] h-[70px] rounded-2xl overflow-hidden flex items-center justify-center "
                style={{
                  backgroundImage: `url(${tabCardBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <img
                  src={tab.icon}
                  alt={tab.label}
                  className="w-16 h-16 object-contain"
                />
                {/* Label anchored at bottom */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[5px]  font-bold text-muted-foreground leading-tight text-center">
                  {tab.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Text Card */}
        <div
          className="w-full rounded-xl p-4 mt-2"
          style={{ background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)" }}
        >
          <h3 className="text-white font-bold text-sm">Welcome to the Platform</h3>
          <p className="text-white/60 text-xs mt-1">
            Play exciting games, earn rewards, and withdraw your winnings instantly. Join millions of players winning big every day!
          </p>
        </div>

        {/* Download App Section */}
        <div
          className="w-full rounded-xl mt-2 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #1a0a10 0%, #2a0515 100%)", border: '1px solid rgba(255,50,80,0.3)' }}
        >
          {/* Header with glow bg */}
          <div className="relative flex flex-col items-center justify-center pt-3 pb-2">
            <img src={headerGlow} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <h3 className="relative text-white font-bold text-base tracking-wide">Download App</h3>
            <div className="relative w-16 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent mt-1" />
          </div>

          {/* Content - character left, phone right */}
          <div className="flex items-center px-4 pb-2">
            {/* Promo character */}
            <div className="flex-shrink-0 w-[140px] h-[180px] relative -ml-2">
              <img src={promoCharacter} alt="Promo" className="w-full h-full object-contain" />
            </div>

            {/* Phone mockup */}
            <div className="flex-1 flex justify-center -ml-4">
              <img src={phoneMockup} alt="App Preview" className="h-[200px] object-contain drop-shadow-2xl" />
            </div>
          </div>

          {/* Download buttons */}
          <div className="flex flex-col items-center gap-3 px-6 pb-4">
            <button onClick={() => window.open('#', '_blank')} className="w-full">
              <img src={appStoreBadge} alt="Download on App Store" className="h-12 w-full object-contain" />
            </button>
            <button onClick={() => window.open('#', '_blank')} className="w-full">
              <img src={googlePlayBadge} alt="Get it on Google Play" className="h-12 w-full object-contain" />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
