import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { GameObject, GAME_LIST } from "@/services/gameService";
import { GameTabs, GameTab } from "./GameTabs";
import { GameButton } from "./GameButton";

import allTabIcon from "@/assets/tabs/all-icon.png";
import recentTabIcon from "@/assets/tabs/recent-icon.png";
import slotsTabIcon from "@/assets/tabs/slots-icon.png";
import casinoTabIcon from "@/assets/tabs/casino-icon.png";
import fishTabIcon from "@/assets/tabs/fish-icon.png";
import liveTabIcon from "@/assets/tabs/live-icon.png";
import sportTabIcon from "@/assets/tabs/sport-icon.png";

const IconImg = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="w-5 h-5 object-contain" />
);

const LOBBY_TABS: GameTab[] = [
  { label: "All", value: "all", icon: <IconImg src={allTabIcon} alt="All" /> },
  { label: "Slots", value: "slot", icon: <IconImg src={slotsTabIcon} alt="Slots" /> },
  { label: "Casino", value: "casino", icon: <IconImg src={casinoTabIcon} alt="Casino" /> },
  { label: "FISH", value: "fish", icon: <IconImg src={fishTabIcon} alt="Fish" /> },
  { label: "LIVE", value: "live", icon: <IconImg src={liveTabIcon} alt="Live" /> },
  { label: "SPORT", value: "sport", icon: <IconImg src={sportTabIcon} alt="Sport" /> },
];

const PROVIDER_ICONS: Record<string, string> = {
  jili: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/JILI_LOGO.avif",
  pg: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/PG_LOGO.avif",
  jdb: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/JDB_LOGO.avif",
  spribe: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/SPRIBE_LOGO.avif",
  turbo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/TURBO_LOGO.png",
};

const PROVIDER_LABELS: Record<string, string> = {
  jili: "JILI",
  pg: "PG",
  jdb: "JDB",
  spribe: "SPRIBE",
  turbo: "TURBO",
};

const GAMES_PER_PAGE = 21;

interface GameLobbyProps {
  activeTab: string;
  launchingGame: string | number | null;
  handleGameLaunch: (game: GameObject) => void;
}

const GameLobby = ({ activeTab, launchingGame, handleGameLaunch }: GameLobbyProps) => {
  const location = useLocation();
  const [selectedProvider, setSelectedProvider] = useState(GAME_LIST[0]?.provider?.toLowerCase() || "jili");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(GAMES_PER_PAGE);

  useEffect(() => {
    if (location.state?.selectedProvider) {
      setSelectedProvider(location.state.selectedProvider.toLowerCase());
    }
  }, [location.state]);

  // Reset visible count when provider or filter changes
  useEffect(() => {
    setVisibleCount(GAMES_PER_PAGE);
  }, [selectedProvider, selectedFilter, activeTab]);

  // Get unique providers from GAME_LIST
  const providers = useMemo(() => {
    const codes = new Set(GAME_LIST.map((g) => g.provider.toLowerCase()));
    return Array.from(codes);
  }, []);

  // Filter games
  const filteredGames = useMemo(() => {
    let games = [...GAME_LIST];

    // Provider filter
    games = games.filter((g) => g.provider.toLowerCase() === selectedProvider.toLowerCase());

    // Category filter from horizontal tabs
    if (selectedFilter !== "all") {
      games = games.filter((g) => g.category.toLowerCase() === selectedFilter.toLowerCase());
    }

    // Tab-level filter (from top level category)
    if (activeTab !== "all" && activeTab !== "top") {
      // If activeTab is something like 'slots', 'casino', etc.
      const categoryMapping: Record<string, string> = {
        slots: "slot",
        casino: "casino",
        fish: "fish",
        sport: "sport",
        live: "live",
      };
      const targetCategory = categoryMapping[activeTab.toLowerCase()] || activeTab.toLowerCase();
      games = games.filter((g) => g.category.toLowerCase() === targetCategory);
    }

    return games;
  }, [selectedProvider, selectedFilter, activeTab]);

  const visibleGames = useMemo(() => {
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, visibleCount]);

  // Reset page when filters change
  const handleProviderChange = (code: string) => {
    setSelectedProvider(code);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + GAMES_PER_PAGE);
  };

  return (
    <div className="flex flex-col gap-2 mt-2 h-full overflow-hidden scrollbar-hide">
      {/* Secondary Filter Bar - Now using GameTabs */}
      <div className="w-full flex-shrink-0 overflow-hidden scrollbar-hide">
        <GameTabs
          tabs={LOBBY_TABS}
          value={selectedFilter}
          onChange={handleFilterChange}
          className="rounded-lg scrollbar-hide"
        />
      </div>

      {/* Provider Sidebar + Game Grid */}
      <div className="flex gap-1.5 flex-1 overflow-hidden scrollbar-hide">
        {/* Left Provider Sidebar */}
        <div
          className="flex flex-col gap-1 py-2 px-1 rounded-lg flex-shrink-0 h-full overflow-y-auto scrollbar-hide"
          style={{
            backgroundColor: "#120810",
            width: "4.5rem",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {providers.map((code) => {
            const isActive = selectedProvider === code;
            const iconUrl = PROVIDER_ICONS[code];
            if (!iconUrl) return null;

            return (
              <button
                key={code}
                onClick={() => handleProviderChange(code)}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all flex-shrink-0"
                style={{
                  background: isActive
                    ? "linear-gradient(180deg, #5b0116 0%, #35030c 100%)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(255,180,50,0.35)"
                    : "1px solid transparent",
                }}
              >
                <img
                  src={iconUrl}
                  alt={code}
                  className="w-10 h-10 object-contain rounded"
                />
              </button>
            );
          })}
        </div>

        {/* Right Game Grid */}
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide pb-4">
          {visibleGames.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
              No games found
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 pb-4">
              {visibleGames.map((game, i) => (
                <button
                  key={`${game.game_id}-${i}`}
                  disabled={launchingGame === game.game_id}
                  onClick={() => handleGameLaunch(game)}
                  className="flex flex-col rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  style={{
                    background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)",
                    border: "1px solid rgba(255,180,50,0.25)",
                  }}
                >
                  <div className="h-full w-full overflow-hidden">
                    <img
                      src={game.logo}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Load More Section */}
          {!visibleGames.length || visibleCount >= filteredGames.length ? null : (
            <div className="flex flex-col items-center gap-2 pb-10">
              <span className="text-white/60 text-xs">
                Showing {visibleGames.length} of {filteredGames.length} games
              </span>
              <GameButton
                variant="mute"
                size="lg"
                onClick={handleLoadMore}
                className="w-full max-w-[200px]"
              >
                Load More
              </GameButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
