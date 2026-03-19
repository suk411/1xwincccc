import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GameObject, GAME_LIST } from "../services/gameService";

import jiliLogo from "@/assets/providers/jili-logo.png";
import pgLogo from "@/assets/providers/pg-logo.png";

const providerLogos: Record<string, string> = {
  JILI: jiliLogo,
  JE: jiliLogo,
  PG: pgLogo,
};

const providerNames: Record<string, string> = {
  JE: "JILI",
  PG: "PG",
};

const GAMES_PER_PAGE = 6;

const getProviderSections = () => {
  const grouped: Record<string, GameObject[]> = {};
  for (const game of GAME_LIST) {
    const key = game.provider_code;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(game);
  }
  return Object.entries(grouped).map(([provider, games]) => ({
    provider,
    displayName: providerNames[provider] || provider,
    games,
  }));
};

interface GameProviderSectionProps {
  launchingGame: string | number | null;
  handleGameLaunch: (game: GameObject) => void;
}

const GameProviderSection = ({ launchingGame, handleGameLaunch }: GameProviderSectionProps) => {
  const navigate = useNavigate();
  const providerSections = getProviderSections();
  const [pageMap, setPageMap] = useState<Record<string, number>>({});

  const changePage = (provider: string, delta: number, totalGames: number) => {
    // If we're on the TOP section and try to change page, navigate to lobby instead
    navigate("/lobby", { state: { activeTab: "all" } });
  };

  return (
    <div className="flex flex-col gap-3 mt-2">
      {providerSections.map((section) => {
        const page = pageMap[section.provider] || 0;
        const totalPages = Math.ceil(section.games.length / GAMES_PER_PAGE);
        const visibleGames = section.games.slice(page * GAMES_PER_PAGE, (page + 1) * GAMES_PER_PAGE);

        return (
          <div key={section.provider} className="rounded-lg overflow-hidden" style={{ backgroundColor: "#1a0a10" }}>
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center ">
                <img
                  src={providerLogos[section.provider] || pgLogo}
                  alt={section.displayName}
                  className="w-24 h-8 object-contain"
                />
               
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => changePage(section.provider, -1, section.games.length)}
                    disabled={page === 0}
                    className="w-7 h-7 rounded-md flex items-center justify-center disabled:opacity-30"
                    style={{ backgroundColor: "#2a1520", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <ChevronLeft size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => changePage(section.provider, 1, section.games.length)}
                    disabled={page >= totalPages - 1}
                    className="w-7 h-7 rounded-md flex items-center justify-center disabled:opacity-30"
                    style={{ backgroundColor: "#2a1520", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 px-2 pb-3">
              {visibleGames.map((game, index) => (
                <button
                  key={`${game.game_id}-${index}`}
                  disabled={launchingGame === game.game_id}
                  onClick={() => handleGameLaunch(game)}
                  className="flex flex-col rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group "
                  style={{
                    background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)",
                    border: "1px solid rgba(255,180,50,0.25)",
                  
                  }}
                >
                  <div className="h-full w-full overflow-hidden">
                    <img
                      src={game.logo}
                    
                      className="w-full h-full   object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                 
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameProviderSection;
