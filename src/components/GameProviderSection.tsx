import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { GameObject } from "../services/gameService";

import jiliLogo from "@/assets/providers/jili-logo.png";
import pgLogo from "@/assets/providers/pg-logo.png";

const providerLogos: Record<string, string> = {
  JILI: jiliLogo,
  PG: pgLogo,
};

const generateProviderGames = () => {
  const pgGame = {
    name: "Fortune Mouse",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-mouse.png",
    provider_code: "PG",
    game_id: 68,
  };

  const jiliGame = {
    name: "Money Coming",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/money-coming.png",
    provider_code: "JE", 
    game_id: 51,
  };

  // ✅ UNIQUE OBJECTS - React can track clicks properly
  const pgGames = Array.from({ length: 6 }, (_, i) => ({ ...pgGame }));
  const jiliGames = Array.from({ length: 6 }, (_, i) => ({ ...jiliGame }));
  
  return [
    { provider: "PG", games: pgGames },
    { provider: "JILI", games: jiliGames },
  ];
};

interface GameProviderSectionProps {
  launchingGame: number | null;
  handleGameLaunch: (game: GameObject) => void;
}

const GameProviderSection = ({ launchingGame, handleGameLaunch }: GameProviderSectionProps) => {
  const providerGames = generateProviderGames();

  return (
    <div className="flex flex-col gap-3 mt-2">
      {providerGames.map((section) => (
        <div key={section.provider} className="rounded-lg overflow-hidden" style={{ backgroundColor: "#1a0a10" }}>
          {/* Provider Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <img
                src={providerLogos[section.provider as keyof typeof providerLogos] || pgLogo}
                alt={section.provider}
                className="w-6 h-6 object-contain"
              />
              <span className="text-white text-sm font-bold">{section.provider}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#2a1520", border: "1px solid rgba(255,255,255,0.1)" }}>
                <ChevronLeft size={14} className="text-muted-foreground" />
              </button>
              <button className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#2a1520", border: "1px solid rgba(255,255,255,0.1)" }}>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
              <button className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#2a1520", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Maximize2 size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* 🔥 PERFECTLY WORKING BUTTONS */}
          <div className="grid grid-cols-3 gap-2 px-2 pb-3">
            {section.games.map((game, index) => (
              <button
                key={`${game.game_id}-${index}`} // ✅ UNIQUE KEY
                disabled={launchingGame === game.game_id}
                onClick={() => handleGameLaunch(game)} // ✅ WORKS WITH YOUR EXACT HANDLER
                className="flex flex-col rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                style={{ 
                  background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)", 
                  border: "1px solid rgba(255,180,50,0.25)",
                  height: "140px" // ✅ Fixed height like Featured Games
                }}
              >
                <div className="flex-1 w-full overflow-hidden">
                  <img 
                    src={game.logo} 
                    alt={game.name} 
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
                  />
                </div>
                <div className="w-full py-2 px-2 text-center bg-black/20">
                  <p className="text-white text-xs font-bold truncate">{game.name}</p>
                  <p className="text-muted-foreground text-[10px]">{game.provider_code}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameProviderSection;
