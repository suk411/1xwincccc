import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameObject, GAME_LIST } from "@/services/gameService";

const PROVIDER_ICONS: Record<string, string> = {
  ALL: "",
  JE: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/buttonIcon/JILI.avif",
  JILI: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/buttonIcon/JILI.avif",
  PG: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/buttonIcon/pg.png",
  JDB: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/buttonIcon/JDB.avif",
  JD: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/buttonIcon/spribe.avif",
};

const PROVIDER_LABELS: Record<string, string> = {
  ALL: "All",
  JE: "JILI",
  PG: "PG",
  JDB: "JDB",
  JD: "MG",
};

const SECONDARY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Slot", value: "SL" },
  { label: "Casino", value: "CB" },
  { label: "Fish", value: "FH" },
  { label: "Sports", value: "SB" },
];

const GAMES_PER_PAGE = 9;
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
  const [selectedProvider, setSelectedProvider] = useState("ALL");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);

  // Get unique providers from GAME_LIST
  const providers = useMemo(() => {
    const codes = new Set(GAME_LIST.map((g) => g.provider_code));
    return ["ALL", ...Array.from(codes)];
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
    if (selectedProvider !== "ALL") {
      games = games.filter((g) => g.provider_code === selectedProvider);
    }

    // Type filter from secondary bar
    if (selectedFilter !== "all") {
      games = games.filter((g) => g.type === selectedFilter);
    }

    // Tab-level filter (from top tabs)
    if (activeTab === "slots") {
      games = games.filter((g) => g.type === "SL");
    } else if (activeTab === "casino") {
      games = games.filter((g) => g.type === "CB");
    } else if (activeTab === "fish") {
      games = games.filter((g) => g.type === "FH");
    } else if (activeTab === "sport") {
      games = games.filter((g) => g.type === "SB");
    } else if (activeTab === "live") {
      games = games.filter((g) => g.type === "LV");
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

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / GAMES_PER_PAGE));
  const visibleGames = filteredGames.slice(
    currentPage * GAMES_PER_PAGE,
    (currentPage + 1) * GAMES_PER_PAGE
  );
  const visibleGames = useMemo(() => {
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, visibleCount]);

  // Reset page when filters change
  const handleProviderChange = (code: string) => {
    setSelectedProvider(code);
    setCurrentPage(0);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setCurrentPage(0);
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* Secondary Filter Bar */}
      <div
        className="flex items-center gap-2 px-2 py-2 overflow-x-auto"
        style={{ backgroundColor: "#1a0a10", scrollbarWidth: "none" }}
      >
        {SECONDARY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background:
                selectedFilter === f.value
                  ? "linear-gradient(135deg, #d4a017 0%, #b8860b 100%)"
                  : "rgba(255,255,255,0.08)",
              color: selectedFilter === f.value ? "#1a0a10" : "rgba(255,255,255,0.6)",
              border:
                selectedFilter === f.value
                  ? "1px solid rgba(255,200,50,0.5)"
                  : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Provider Sidebar + Game Grid */}
      <div className="flex gap-1.5" style={{ minHeight: "20rem" }}>
        {/* Left Provider Sidebar */}
        <div
          className="flex flex-col gap-1 py-2 px-1 rounded-lg flex-shrink-0"
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
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all"
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
                {code !== "ALL" && PROVIDER_ICONS[code] ? (
                  <img
                    src={PROVIDER_ICONS[code]}
                    alt={PROVIDER_LABELS[code] || code}
                    className="w-8 h-8 object-contain rounded"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                    style={{
                      background: isActive
                        ? "rgba(255,180,50,0.2)"
                        : "rgba(255,255,255,0.08)",
                      color: isActive ? "#ffd700" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    All
                  </div>
                )}
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: isActive ? "#ffd700" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {PROVIDER_LABELS[code] || code}
                </span>
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
        <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide pb-4">
          {visibleGames.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
              No games found
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
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
                  <div className="w-full aspect-square overflow-hidden">
                  <div className="h-full w-full overflow-hidden">
                    <img
                      src={game.logo}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-1 py-1">
                    <span className="text-[10px] text-white/80 line-clamp-1 text-center block">
                      {game.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3 pb-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="w-7 h-7 rounded flex items-center justify-center disabled:opacity-30"
                style={{ backgroundColor: "#2a1520", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <ChevronLeft size={14} className="text-white/60" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className="w-7 h-7 rounded flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: currentPage === i ? "#5b0116" : "#2a1520",
                    border:
                      currentPage === i
                        ? "1px solid rgba(255,180,50,0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                    color: currentPage === i ? "#ffd700" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="w-7 h-7 rounded flex items-center justify-center disabled:opacity-30"
                style={{ backgroundColor: "#2a1520", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <ChevronRight size={14} className="text-white/60" />
              </button>
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
