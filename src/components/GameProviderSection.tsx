import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GameObject, GAME_LIST } from "../services/gameService";

const providerLogos: Record<string, string> = {
  jili: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/JILI_LOGO.avif",
  pg: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/PG_LOGO.avif",
  jdb: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/JDB_LOGO.avif",
  spribe: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/SPRIBE_LOGO.avif",
  turbo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/TURBO_LOGO.png",
};

const providerNames: Record<string, string> = {
  jili: "JILI",
  pg: "PG",
  jdb: "JDB",
  spribe: "SPRIBE",
  turbo: "TURBO",
};

const GAMES_PER_PAGE = 6;

const getProviderSections = () => {
  const providers = ["jili", "pg", "jdb", "spribe", "turbo"];
  const gameNames: Record<string, string[]> = {
    jili: ["Money Coming", "Fortune Gems 2", "Black Jack", "Mega Ace", "Super Ace", "Dragon Tiger"],
    pg: ["Fortune Rabbit", "Leprechaun Riches", "Captain's Bounty", "Anubis Wrath", "Treasures of Aztec", "Lucky Neko"],
    jdb: ["Mines 2", "Trump Card", "Bull Treasure", "Fortune Neko", "Super Niubi Deluxe", "Lucky Color Game"],
    spribe: ["Aviator", "Mines", "Plinko", "Goal", "Hilo", "Dice"],
    turbo: ["Vortex", "Chicken Route", "Limbo Rider", "Vortex Halloween", "Mysteco", "Turbo Plinko"],
  };

  return providers.map((provider) => {
    const targetNames = gameNames[provider];
    const games = targetNames
      .map((name) => {
        // Search for the game by name and provider
        const found = GAME_LIST.find(
          (g) => g.name.toLowerCase() === name.toLowerCase() && g.provider.toLowerCase() === provider
        );
        return found;
      })
      .filter((g): g is GameObject => g !== undefined);

    return {
      provider,
      displayName: providerNames[provider],
      games,
    };
  });
};

interface GameProviderSectionProps {
  launchingGame: string | number | null;
  handleGameLaunch: (game: GameObject) => void;
  vipLevel?: number;
}

const GameProviderSection = ({ launchingGame, handleGameLaunch, vipLevel }: GameProviderSectionProps) => {
  const navigate = useNavigate();
  const providerSections = getProviderSections();

  const navigateToLobby = (provider: string) => {
    if (vipLevel === 0) {
      // Find a VIP game from this provider to trigger the modal
      const providerVipGame = GAME_LIST.find(g => g.provider.toLowerCase() === provider.toLowerCase() && g.isVipOnly);
      if (providerVipGame) {
        handleGameLaunch(providerVipGame);
        return;
      }
    }
    navigate("/lobby", { state: { activeTab: "all", selectedProvider: provider } });
  };

  return (
    <div className="flex flex-col gap-3 mt-2">
      {providerSections.map((section) => {
        const visibleGames = section.games;

        return (
          <div key={section.provider} className="rounded-lg overflow-hidden" style={{ backgroundColor: "#1a0a10" }}>
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2">
                <img
                  src={providerLogos[section.provider] || ""}
                  alt={section.displayName}
                  className="w-24 h-8 object-contain"
                />
                <span className="text-white text-sm font-bold tracking-wider">
                  {section.displayName}
                </span>
              </div>
              <button
                onClick={() => navigateToLobby(section.provider)}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10 active:scale-90"
                style={{ backgroundColor: "#2a1520", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <ChevronRight size={16} className="text-white" />
              </button>
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
