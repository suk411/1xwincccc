import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import GameLobby from "@/components/GameLobby";
import { GameObject, gameService } from "@/services/gameService";
import { useProfile, refreshProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import VipLockModal from "@/components/VipLockModal";

const GameLobbyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [launchingGame, setLaunchingGame] = useState<string | number | null>(null);
  const [showVipModal, setShowVipModal] = useState(false);
  const [pendingGame, setPendingGame] = useState<GameObject | null>(null);

  const { vipLevel } = useProfile();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleGameLaunch = async (game: GameObject) => {
    // Check VIP requirement
    // Strictly restrict ALL games if vipLevel is 0
    if (vipLevel === 0) {
      setPendingGame(game);
      setShowVipModal(true);
      return;
    }

    setLaunchingGame(game.game_id);
    try {
      // Backend request is ONLY made if user is VIP 1 or more
      const result = await gameService.launch(game);
      await refreshProfile();
      if (result.gameUrl) {
        navigate("/game", { state: { gameUrl: result.gameUrl } });
      }
    } catch (e: any) {
      toast({ title: "Launch failed", description: e.message, variant: "destructive" });
    } finally {
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

      <VipLockModal
        isOpen={showVipModal}
        onClose={() => {
          setShowVipModal(false);
          setPendingGame(null);
        }}
      />
    </div>
  );
};

export default GameLobbyPage;
