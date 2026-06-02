import PageLayout from "@/components/PageLayout";

import { useTransitionNavigate } from "@/providers/NavigationProvider";
import bannerVideo from "@/assets/banner-video.mp4";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
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
import { GameTabs, GameTab } from "@/components/GameTabs";
import allTabIcon from "@/assets/tabs/all-icon.png";
import recentTabIcon from "@/assets/tabs/recent-icon.png";
import slotsTabIcon from "@/assets/tabs/slots-icon.png";
import casinoTabIcon from "@/assets/tabs/casino-icon.png";
import fishTabIcon from "@/assets/tabs/fish-icon.png";
import liveTabIcon from "@/assets/tabs/live-icon.png";
import sportTabIcon from "@/assets/tabs/sport-icon.png";
import GameProviderSection from "@/components/GameProviderSection";
import GameLobby from "@/components/GameLobby";
import { GAME_LIST, gameService, GameObject, GameBalanceResponse } from "@/services/gameService";
import { toast } from "@/hooks/use-toast";
import wingoLogo from "@/assets/wingo/WinGo-logo.png";
import { refreshProfile } from "@/hooks/useProfile";
import { BalanceDetailsDialog } from "@/components/BalanceDetailsDialog";
import VipLockModal from "@/components/VipLockModal";
import googlePlayBadge from "@/assets/download/google-play.png";
import appStoreBadge from "@/assets/download/app-store.png";
import LotteryCard from "@/components/LotteryCard";
import GameConfirmDialog from "@/components/GameConfirmDialog";
import Loader from "@/components/Loader";
import { GameButton } from "@/components/GameButton";

import phoneMockup from "@/assets/download/phone-mockup.png";
import promoCharacter from "@/assets/download/promo-character.png";
import officialPartners from "@/assets/partners/official-partners.png";
import verifiedCertification from "@/assets/partners/verified-certification.png";
import securityProtection from "@/assets/partners/security-protection.png";
import telegramPartner from "@/assets/partners/telegram-icon.png";
import responsibleGaming from "@/assets/partners/responsible-gaming.png";



const IconImg = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="w-5 h-5 object-contain" />
);


const gameTabs: GameTab[] = [
  { label: "TOP", value: "top" },
  { label: "All", value: "all", icon: <IconImg src={allTabIcon} alt="All" /> },
  { label: "Recent", value: "recent", icon: <IconImg src={recentTabIcon} alt="Recent" /> },
  { label: "Slots", value: "slots", icon: <IconImg src={slotsTabIcon} alt="Slots" /> },
  { label: "Casino", value: "casino", icon: <IconImg src={casinoTabIcon} alt="Casino" /> },
  { label: "FISH", value: "fish", icon: <IconImg src={fishTabIcon} alt="Fish" /> },
  { label: "LIVE", value: "live", icon: <IconImg src={liveTabIcon} alt="Live" /> },
  { label: "SPORT", value: "sport", icon: <IconImg src={sportTabIcon} alt="Sport" /> },
];






const winMessages = [
  "Congratulations! User Sarah won ₹5000 on Slots.",
  "Big Win! User Alex hit the jackpot and won ₹10000 on Roulette.",
  "Amazing! User Emily just won ₹7500 on Blackjack.",
  "Jackpot! User David won ₹12000 on Poker.",
  "Fantastic! User Jessica won ₹6000 on Baccarat.",
  "Incredible! User Michael won ₹9000 on Bingo.",
  "Sensational! User Ashley won ₹8000 on Keno.",
  "Spectacular! User Kevin won ₹11000 on Craps.",
  "Unbelievable! User Brittany won ₹7000 on Scratch Cards.",
  "Magnificent! User Justin won ₹13000 on Wheel of Fortune.",
];

const WINGO_GAME: GameObject = {
  name: "Win Go",
  logo: wingoLogo,
  provider: "1XKING",
  provider_code: "WINGO",
  game_id: "wingo",
  type: "wingo",
  category: "lottery",
};

const SABAPLAY_GAME: GameObject = {
  name: "SABAPLAY",
  logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/SABAgamelogo/SABAplays.png",
  provider: "IBC",
  provider_code: "IB",
  game_id: "0",
  type: "SL",
  category: "sport",
};

const categoryTabs = [
  { icon: giftIcon, label: "1ST DEPOSIT" },
  { icon: telegramIcon, label: "GROUP" },
];

const Index = () => {
  const { navigateWithTransition } = useTransitionNavigate();
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [activeGameTab, setActiveGameTab] = useState("top");
  const [launchingGame, setLaunchingGame] = useState<string | number | null>(null);
  const [pendingGame, setPendingGame] = useState<GameObject | null>(null);
  const [showGameConfirm, setShowGameConfirm] = useState(false);
  const [gameForConfirm, setGameForConfirm] = useState<GameObject | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const showTopGames = true;
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawCountdown, setWithdrawCountdown] = useState(0);
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [gameBalances, setGameBalances] = useState<Record<string, number>>({});
  const [totalGameBalance, setTotalGameBalance] = useState(0);

  const { balance, vipLevel } = useProfile();

  const fetchBalances = async () => {
    try {
      const data = await gameService.getBalance();
      setGameBalances(data.gameBalance);
      // Cache the balances in local storage
      localStorage.setItem("cached_game_balances", JSON.stringify(data.gameBalance));
      
      // Sum up only the game balances for the display on the card
      const total = Object.values(data.gameBalance).reduce((sum, val) => sum + val, 0);
      setTotalGameBalance(total);
      await refreshProfile();
    } catch (e) {
      console.error("Failed to fetch game balances:", e);
    }
  };

  useEffect(() => {
    // Load initial balances from cache if available
    const cached = localStorage.getItem("cached_game_balances");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setGameBalances(parsed);
        const total = Object.values(parsed as Record<string, number>).reduce((sum, val) => sum + val, 0);
        setTotalGameBalance(total);
      } catch (e) {
        console.error("Failed to parse cached balances:", e);
      }
    }
    fetchBalances();
  }, []);

  const handleWithdrawAll = async () => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);

    const providers = ["JE", "PG", "TU", "JD", "IB"];

    // 1. Trigger API calls immediately
    const apiPromise = (async () => {
      try {
        const results = await Promise.allSettled(
          providers.map((p_code) => gameService.withdraw(p_code))
        );
        const successful = results.filter((r) => r.status === "fulfilled").length;
        if (successful > 0) {
          await refreshProfile();
          return successful;
        }
        return 0;
      } catch (e) {
        console.error("Withdrawal error:", e);
        return -1;
      }
    })();

    // 2. Start visual countdown (5 to 1)
    for (let i = 5; i > 0; i--) {
      setWithdrawCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 3. Wait for API to finish if it hasn't already
    const successfulCount = await apiPromise;

    if (successfulCount > 0) {
      toast({ title: "Withdrawal Successful", description: `Recall success` });
      await fetchBalances(); // Update balances after withdrawal
    } else if (successfulCount === 0) {
      toast({ title: "Try again.", description: "Try again", variant: "destructive" });
    } else if (successfulCount === -1) {
      toast({ title: "Try again", description: "Try again.", variant: "destructive" });
    }

    setWithdrawCountdown(0);
    setIsWithdrawing(false);
  };

  const handleGameLaunch = async (game: GameObject) => {
    // Check VIP requirement immediately using cached vipLevel from useProfile hook
    // Strictly restrict ALL games if vipLevel is 0
    if (vipLevel === 0) {
      setPendingGame(game);
      setShowVipModal(true);
      return;
    }

    // Show confirmation dialog
    setGameForConfirm(game);
    setShowGameConfirm(true);
  };

  const handleConfirmGameLaunch = async () => {
    if (!gameForConfirm) return;
    
    // Close dialog immediately
    setShowGameConfirm(false);
    const game = gameForConfirm;
    setGameForConfirm(null);
    
    // Handle Wingo separately (built-in game, no launch API)
    if (game.game_id === "wingo") {
      navigateWithTransition("/wingo");
      return;
    }
    
    // Start loading overlay
    const gameWindow = window.open("", "_blank");
    setIsLaunching(true);
    setLaunchingGame(game.game_id);
    
    try {
      const result = await gameService.launch(game);
      await refreshProfile();
      
      if (result.gameUrl) {
        if (gameWindow) {
          gameWindow.location.href = result.gameUrl;
        } else {
          window.location.href = result.gameUrl;
        }
      } else {
        if (gameWindow) gameWindow.close();
      }
    } catch (e: any) {
      toast({ title: "Launch failed", description: e.message, variant: "destructive" });
    } finally {
      setIsLaunching(false);
      setLaunchingGame(null);
    }
  };


  const handleTickerEnd = () => {
    setTickerIndex((prev) => (prev + 1) % winMessages.length);
  };

  const handleGroupClick = (label: string) => {
    if (label === "GROUP") {
      navigateWithTransition("/community-event");
    }
  };

  const handleTabChange = (tabValue: string) => {
    if (tabValue === "top") {
      setActiveGameTab("top");
    } else {
      // Regardless of which category tab is clicked (all, slots, casino, etc.), 
      // always open the lobby with "all" active.
      navigateWithTransition("/lobby", { state: { activeTab: "all" } });
    }
  };

  return (
    <PageLayout>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes goldShine {
          0% { left: -100%; }
          50%, 100% { left: 200%; }
        }
      `}} />
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
        <div className="w-full h-6 bg-[#3d0a0a] border border-[#471414] overflow-hidden flex items-center gap-2 px-2 mt-2 mx-0.5 rounded-[6px]">
          <Volume2 size={16}/> 
          <div className="overflow-hidden flex-1 relative">
            <div
              ref={tickerRef}
              key={tickerIndex}
              onAnimationEnd={handleTickerEnd}
              className="whitespace-nowrap animate-ticker text-xs text-muted-foreground"
            >
              {winMessages[tickerIndex]}
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
            <span className="text-white font-bold text-[14px]">{balance.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4 mr-2">
            <button onClick={() => navigateWithTransition("/bank")} className="flex flex-col items-center gap-0.3">
              <img src={depositIcon} alt="Deposit" style={{width: '19.2px', height: '19.2px'}} className="object-contain" />
              <span className="text-[7.2px]">Deposit</span>
            </button>
            <button onClick={() => navigateWithTransition("/bank")}  className="flex flex-col items-center gap-0.3">
              <img src={withdrawIcon} alt="Withdraw" style={{width: '19.2px', height: '19.2px'}} className="object-contain" />
              <span className="text-[7.2px]">Withdraw</span>
            </button>
            <button onClick={() => navigateWithTransition("/vip")} className="flex flex-col items-center gap-0.3">
              <img src={vipIcon} alt="VIP" style={{width: '19.2px', height: '19.2px'}} className="object-contain" />
              <span className="text-[7.2px]">VIP</span>
            </button>
          </div>
        </div>

        {/* Category Tabs & Game Wallet Withdrawal */}
        <div className="flex items-center justify-between px-2 pt-1 mt-2 bg-black rounded-lg overflow-x-auto scrollbar-hide pb-1">
          {categoryTabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleGroupClick(tab.label)}
              className="flex flex-col items-center gap-0.5 flex-shrink-0 w-[70px] cursor-pointer hover:scale-105 transition-transform"
            >
              <div
                className="relative w-[70px] h-[70px] rounded-2xl overflow-hidden flex items-center justify-center"
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
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[5px] font-bold  leading-tight text-center">
                  {tab.label}
                </span>
              </div>
            </button>
          ))}

          {/* Game Wallet Withdrawal Card */}
          <div 
            className="relative flex-shrink-0 min-w-[170px] h-[70px] rounded-xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)",
              border: "1px solid rgba(255,180,50,0.25)",
            }}
          >
            {/* Icon on left top */}
            <img 
              src="https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/GAME_wallet.png" 
              alt="Game Wallet" 
              className="absolute top-2 left-2 w-6 h-6 object-contain"
            />
            {/* Text on top center */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold whitespace-nowrap leading-tight">
              Game Wallet
            </span>

            {/* Amount in the center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-[12px] font-mono font-bold">₹{totalGameBalance.toFixed(2)}</span>
            </div>

            {/* Details Button on top right */}
            <button
              onClick={() => {
                setShowBalanceDialog(true);
                fetchBalances();
              }}
              className="absolute top-2 right-2 text-[7px] text-yellow-500 underline uppercase font-bold"
            >
              Details
            </button>

            {/* Button on lower right side */}
            <div className="absolute bottom-2 right-2">
              <button
                onClick={handleWithdrawAll}
                disabled={isWithdrawing}
                className="relative inline-flex items-center justify-center border-0 outline-none cursor-pointer overflow-hidden transition-transform active:scale-96 disabled:opacity-60"
                style={{
                  background: "linear-gradient(145deg, rgb(255, 215, 0) 0%, rgb(240, 184, 0) 40%, rgb(232, 165, 58) 100%)",
                  color: "rgb(139, 69, 19)",
                  boxShadow: "rgba(228, 165, 58, 0.45) 0px 3px 12px 0px, rgba(255, 255, 255, 0.5) 0px 1px 2px 0px inset, rgba(255, 215, 0, 0.3) 0px 0px 0px 1px",
                  height: "24px",
                  fontSize: "8px",
                  fontWeight: "700",
                  paddingLeft: "14px",
                  paddingRight: "14px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    content: "",
                    position: "absolute",
                    top: 0,
                    left: "8%",
                    width: "84%",
                    height: "50%",
                    background: "linear-gradient(rgba(255, 255, 255, 0.5), transparent)",
                    borderRadius: "12px 12px 50% 50%",
                    pointerEvents: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "50%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
                    animation: "goldShine 2.5s ease-in-out infinite",
                  }}
                />
                <span className="relative z-10">
                  {isWithdrawing ? (withdrawCountdown > 0 ? `${withdrawCountdown}` : "...") : "Recall"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <BalanceDetailsDialog 
          isOpen={showBalanceDialog} 
          onClose={() => setShowBalanceDialog(false)} 
          balances={gameBalances} 
          onRefresh={() => {
            fetchBalances();
            refreshProfile();
          }}
        />

        <VipLockModal
          isOpen={showVipModal}
          onClose={() => {
            setShowVipModal(false);
            setPendingGame(null);
          }}
          game={pendingGame}
        />

        <GameConfirmDialog
          isOpen={showGameConfirm}
          game={gameForConfirm}
          isLoading={isLaunching}
          onConfirm={handleConfirmGameLaunch}
          onCancel={() => {
            setShowGameConfirm(false);
            setGameForConfirm(null);
          }}
        />

        {isLaunching && (
          <Loader
            overlay
            label="Launching game..."
          />
        )}

        {/* Game Category Tabs */}
        <div className="mt-2 rounded-lg overflow-hidden">
          <GameTabs
            tabs={gameTabs}
            value={activeGameTab}
            onChange={handleTabChange}
            className="rounded-lg"
          />
        </div>

        {/* Lottery Card Section */}
        <div className="mt-3 rounded-lg overflow-hidden" style={{ backgroundColor: "#1a0a10" }}>
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold tracking-wider">LOTTERY</span>
            </div>
          </div>
          <div className="px-2 pb-3">
            <LotteryCard 
              name="Win Go" 
              hint="Guess the number"
              tag="HOT"
              onClick={() => handleGameLaunch(WINGO_GAME)}
            />
          </div>
        </div>

        {/* SABAPLAY Card Section */}
        <div className="mt-3 rounded-lg overflow-hidden" style={{ backgroundColor: "#1a0a10" }}>
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold tracking-wider">SPORT BOOK</span>
            </div>
          </div>
          <div className="px-2 pb-3">
            <LotteryCard 
              icon="https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/SABAgamelogo/SABAplays.png"
              name="SABAPLAY" 
              hint="Sports betting"
              tag="NEW"
              rightIcon="https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/SABAgamelogo/IPL.png"
              onClick={() => handleGameLaunch(SABAPLAY_GAME)}
            />
          </div>
        </div>

        {activeGameTab === "top" ? (
          showTopGames && (
            <GameProviderSection 
              launchingGame={launchingGame}
              handleGameLaunch={handleGameLaunch}
            />
          )
        ) : (
          <GameLobby
            activeTab={activeGameTab}
            launchingGame={launchingGame}
            handleGameLaunch={handleGameLaunch}
          />
        )}

        
{/* Download App Section */}

<div className="w-full rounded-xl mt-2 overflow-hidden">

{/* Header */}

  <div className="relative flex flex-col items-center">
    <h3 className="relative top-6 z-10">Download App</h3>
    <img
      src={headerGlow}
      alt="Header glow"
      className="w-1/2 opacity-60 mx-auto"
    />
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-3"></div>
  </div>

{/* Content */}

  <div className="grid grid-cols-2 gap-4 items-center px-3 pb-4">

{/* Left Side */}
<div className="flex flex-col items-center gap-3 w-full">

  <img
    src={promoCharacter}
    alt="Promo"
    className="w-4/5 object-contain"
  />

  <button className="w-3/4">
    <img
      src={appStoreBadge}
      alt="App Store"
      className="w-full object-contain"
    />
  </button>

  <button className="w-3/4">
    <img
      src={googlePlayBadge}
      alt="Google Play"
      className="w-full object-contain"
    />
  </button>

</div>

{/* Right Side */}
<div className="flex items-center justify-center w-full">

  <img
    src={phoneMockup}
    alt="App Preview"
    className="w-4/5 px-1  object-contain"
  />

</div>


  </div>

</div>


        {/* Official Partners Section */}
        <div className="w-full rounded-xl mt-2 overflow-hidden">
          <div className="relative flex flex-col items-center">
            <h3 className="relative top-8 z-10">Official Partners</h3>
            <img src={headerGlow} alt="Header glow" className="w-1/2 object-cover opacity-60 mx-auto" />
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-2"></div>
          </div>
          <div className="px-4 pb-4">
            <img src={officialPartners} alt="Official Partners" className="w-full object-contain" />
          </div>
        </div>

        {/* About Section */}
        <div className="w-full rounded-xl mt-2 overflow-hidden">
          <div className="relative flex flex-col items-center">
            <h3 className="relative top-8 z-10">About 1XKING</h3>
            <img src={headerGlow} alt="Header glow" className="w-1/2 object-cover opacity-60 mx-auto" />
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-2"></div>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            <div className="flex flex-col items-center">
              <h4 className="text-white text-xs mb-2">Verified Certification</h4>
              <div className="w-full rounded-lg overflow-hidden">
                <img src={verifiedCertification} alt="Verified Certification" className="w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-white text-xs mb-2">Security Protection</h4>
              <div className="w-full rounded-lg overflow-hidden">
                <img src={securityProtection} alt="Security Protection" className="w-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Follow Us & Responsible Gaming */}
        <div className="w-full rounded-xl mt-2 overflow-hidden">
          <div className="grid grid-cols-2 gap-0">
            <div className="flex flex-col items-center py-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-3"></div>
              <h4 className="text-white text-xs mb-3">Follow Us</h4>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                <img src={telegramPartner} alt="Telegram" className="w-16 h-14 rounded-sm object-contain" />
              </a>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-3"></div>
              <h4 className="text-xs mb-3">Responsible Gaming Statement</h4>
              <img src={responsibleGaming} alt="Responsible Gaming" className="w-4/5 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
