import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import GameLobby from "@/components/GameLobby";
import { GameObject, gameService } from "@/services/gameService";
import { refreshProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const GameLobbyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [launchingGame, setLaunchingGame] = useState<string | number | null>(null);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleGameLaunch = async (game: GameObject) => {
    setLaunchingGame(game.game_id);
    try {
      const result = await gameService.launch(game);
      await refreshProfile();
      navigate("/game", { state: { gameUrl: result.gameUrl } });
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
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <GameLobby 
          activeTab={activeTab}
          launchingGame={launchingGame}
          handleGameLaunch={handleGameLaunch}
        />
      </div>
    </div>
  );
};

export default GameLobbyPage;
