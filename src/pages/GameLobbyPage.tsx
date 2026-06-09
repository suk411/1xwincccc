import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTransitionNavigate } from "@/providers/NavigationProvider";
import PageHeader from "@/components/PageHeader";
import GameLobby from "@/components/GameLobby";
import { GameObject, gameService } from "@/services/gameService";
import { useProfile, refreshProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import VipLockModal from "@/components/VipLockModal";
import GameConfirmDialog from "@/components/GameConfirmDialog";
import Loader from "@/components/Loader";

const GameLobbyPage = () => {
  const { navigateWithTransition } = useTransitionNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [launchingGame, setLaunchingGame] = useState<string | number | null>(null);
  const [showVipModal, setShowVipModal] = useState(false);
  const [pendingGame, setPendingGame] = useState<GameObject | null>(null);
  const [showGameConfirm, setShowGameConfirm] = useState(false);
  const [gameForConfirm, setGameForConfirm] = useState<GameObject | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const { vipLevel } = useProfile();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleGameLaunch = async (game: GameObject) => {
    // Check VIP requirement
    // Require VIP 2 or above to play
    if (vipLevel < 2) {
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
    setGameForConfirm(null);
    
    const gameWindow = window.open("", "_blank");
    setIsLaunching(true);
    setLaunchingGame(gameForConfirm.game_id);
    
    try {
      const result = await gameService.launch(gameForConfirm);
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

  const titleMapping: Record<string, string> = {
    all: "Game Lobby",
    slots: "Slots",
    casino: "Casino",
    fish: "Fish",
    sport: "Sports",
    live: "Live",
    cards: "Cards",
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0508] overflow-hidden scrollbar-hide">
      {/* Header */}
      <PageHeader title={titleMapping[activeTab.toLowerCase()] || activeTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden scrollbar-hide">
        <GameLobby 
          activeTab={activeTab}
          launchingGame={launchingGame}
          handleGameLaunch={handleGameLaunch}
        />
      </div>

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

      <VipLockModal
        isOpen={showVipModal}
        onClose={() => {
          setShowVipModal(false);
          setPendingGame(null);
        }}
        game={pendingGame}
      />
    </div>
  );
};

export default GameLobbyPage;
