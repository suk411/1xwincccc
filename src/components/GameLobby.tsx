import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTransitionNavigate } from "@/providers/NavigationProvider";
import { GameObject, GAME_LIST } from "@/services/gameService";
import { withCacheBust } from "@/lib/cacheBust";
import { GameTabs, GameTab } from "./GameTabs";
import { GameButton } from "./GameButton";

import catpopularIcon from "@/assets/games/catpopular.webp";
import catslotIcon from "@/assets/games/catslot.webp";
import catcasinoIcon from "@/assets/games/catcasino.webp";
import catfishIcon from "@/assets/games/catfish.webp";
import catsportsIcon from "@/assets/games/catsports.webp";
import catcardsIcon from "@/assets/games/catcards.webp";

const IconImg = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} style={{ display: "block", width: 25, height: 25 }} />
);

const LOBBY_TABS: GameTab[] = [
  { label: "All", value: "all", icon: <IconImg src={catpopularIcon} alt="All" /> },
  { label: "Slots", value: "slot", icon: <IconImg src={catslotIcon} alt="Slots" /> },
  { label: "Cards", value: "card", icon: <IconImg src={catcardsIcon} alt="Cards" /> },
  { label: "Casino", value: "casino", icon: <IconImg src={catcasinoIcon} alt="Casino" /> },
  { label: "Sports", value: "sport", icon: <IconImg src={catsportsIcon} alt="Sports" /> },
  { label: "Fish", value: "fish", icon: <IconImg src={catfishIcon} alt="Fish" /> },
];

const HEADER_TITLES: Record<string, string> = {
  all: "Game Lobby",
  slots: "Slots",
  slot: "Slots",
  casino: "Casino",
  fish: "Fish",
  sport: "Sports",
  live: "Live",
  cards: "Cards",
  card: "Cards",
  top: "Game Lobby",
};

const PROVIDER_ICONS: Record<string, string> = {
  jili: withCacheBust("https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/JILI_LOGO.avif"),
  pg: withCacheBust("https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/PG_LOGO.avif"),
  jdb: withCacheBust("https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/JDB_LOGO.avif"),
  spribe: withCacheBust("https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/SPRIBE_LOGO.avif"),
  turbo: withCacheBust("https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/TURBO_LOGO.png"),
  ibc: withCacheBust("https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/SABAgamelogo/SABAplays.png"),
};

const GAMES_PER_PAGE = 21;

interface GameLobbyProps {
  activeTab: string;
  launchingGame: string | number | null;
  handleGameLaunch: (game: GameObject) => void;
}

const GameLobby = ({ activeTab, launchingGame, handleGameLaunch }: GameLobbyProps) => {
  const { goBack } = useTransitionNavigate();
  const location = useLocation();
  const [selectedProvider, setSelectedProvider] = useState(GAME_LIST[0]?.provider?.toLowerCase() || "jili");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(GAMES_PER_PAGE);

  useEffect(() => {
    if (location.state?.selectedProvider) {
      setSelectedProvider(location.state.selectedProvider.toLowerCase());
    }
  }, [location.state]);

  const providers = useMemo(() => {
    let games = [...GAME_LIST];
    if (activeTab !== "all" && activeTab !== "top") {
      const categoryMapping: Record<string, string> = {
        slots: "slot",
        slot: "slot",
        casino: "casino",
        fish: "fish",
        sport: "sport",
        live: "live",
        cards: "card",
      };
      const targetCategory = categoryMapping[activeTab.toLowerCase()] || activeTab.toLowerCase();
      games = games.filter((g) => g.category.toLowerCase() === targetCategory);
    }
    if (selectedFilter !== "all") {
      games = games.filter((g) => g.category.toLowerCase() === selectedFilter.toLowerCase());
    }
    const codes = new Set(games.map((g) => g.provider.toLowerCase()));
    return Array.from(codes);
  }, [activeTab, selectedFilter]);

  useEffect(() => {
    setVisibleCount(GAMES_PER_PAGE);
  }, [selectedProvider, selectedFilter, activeTab, searchQuery]);

  useEffect(() => {
    if (providers.length > 0 && !providers.includes(selectedProvider)) {
      setSelectedProvider(providers[0]);
    }
  }, [providers, selectedProvider]);

  const filteredGames = useMemo(() => {
    let games = [...GAME_LIST];

    games = games.filter((g) => g.provider.toLowerCase() === selectedProvider.toLowerCase());

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      games = games.filter((g) => g.name.toLowerCase().includes(q));
    }

    if (selectedFilter !== "all") {
      games = games.filter((g) => g.category.toLowerCase() === selectedFilter.toLowerCase());
    }

    if (activeTab !== "all" && activeTab !== "top") {
      const categoryMapping: Record<string, string> = {
        slots: "slot",
        casino: "casino",
        fish: "fish",
        sport: "sport",
        live: "live",
        cards: "card",
      };
      const targetCategory = categoryMapping[activeTab.toLowerCase()] || activeTab.toLowerCase();
      games = games.filter((g) => g.category.toLowerCase() === targetCategory);
    }

    return games;
  }, [selectedProvider, selectedFilter, activeTab, searchQuery]);

  const visibleGames = useMemo(() => {
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, visibleCount]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredGames.length) {
          setVisibleCount(prev => prev + GAMES_PER_PAGE);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredGames.length]);

  const handleProviderChange = (code: string) => {
    setSelectedProvider(code);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + GAMES_PER_PAGE);
  };

  const headerTitle = HEADER_TITLES[activeTab.toLowerCase()] || activeTab;

  return (
    <div className="flex flex-col h-full overflow-hidden scrollbar-hide">
      {/* Navbar Header (Invitation Rules style) */}
      <div style={{ display: "block", position: "static", width: "100%", height: 46, boxSizing: "border-box", zIndex: 100, background: "none", flexShrink: 0 }}>
        <div style={{
          width: "100%", height: 46,
          background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)",
          color: "#fff", boxSizing: "border-box", userSelect: "none",
          display: "flex", alignItems: "center", position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer", flexShrink: 0, padding: "0 12px" }} onClick={() => goBack()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
          <div style={{ flex: searchOpen ? 0 : 1, transition: "flex 0.3s ease" }} />
          <div style={{ position: "absolute", left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", height: "100%", pointerEvents: "none", opacity: searchOpen ? 0 : 1, transform: searchOpen ? "scale(0.5)" : "scale(1)", transition: "opacity 0.25s ease, transform 0.3s ease" }}>
            <span style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.2, color: "#fff", textAlign: "center" }}>{headerTitle}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", height: "100%", flex: searchOpen ? 1 : 0, justifyContent: "flex-end", overflow: "hidden", marginRight: searchOpen ? 12 : 0 }}>
            <div style={{ flex: 1, overflow: "hidden", transition: "opacity 0.25s ease", opacity: searchOpen ? 1 : 0, height: 36, borderRadius: 19, border: "1px solid rgba(255,180,50,0.15)", boxSizing: "border-box" }}>
              <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", borderRadius: 19 }}>
                <svg width="16" height="16" viewBox="0 0 1024 1024" fill="rgba(255,255,255,0.4)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none" }}>
                  <path d="M956.8 905.6L723.2 672c54.4-64 86.4-147.2 86.4-236.8 0-204.8-166.4-371.2-371.2-371.2S67.2 230.4 67.2 435.2s166.4 371.2 371.2 371.2c89.6 0 172.8-32 236.8-86.4l233.6 233.6c6.4 6.4 16 9.6 25.6 9.6s19.2-3.2 25.6-9.6c12.8-12.8 12.8-32 0-44.8zM131.2 435.2c0-169.6 137.6-307.2 307.2-307.2s307.2 137.6 307.2 307.2-137.6 307.2-307.2 307.2-307.2-137.6-307.2-307.2z" />
                </svg>
                <input ref={searchRef} type="text" placeholder="Search games" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
                  style={{ width: "100%", height: "100%", border: "none", padding: "0 8px 0 36px", fontSize: 12, boxSizing: "border-box", color: "rgba(255,255,255,0.9)", outline: "none", backgroundColor: "transparent", borderRadius: 19 }}
                />
              </div>
            </div>
          </div>
          <GameButton variant={searchOpen ? "mute" : "dark"}
            onClick={() => { if (searchOpen) { setSearchOpen(false); setSearchQuery(""); } else { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 200); } }}
            style={{ flexShrink: 0, width: searchOpen ? 64 : 36, height: 36, borderRadius: 19, padding: searchOpen ? "0 12px" : 0, fontSize: 13, minWidth: searchOpen ? 64 : 36, color: "rgba(255,255,255,0.8)", marginRight: 12, transition: "width 0.3s ease, padding 0.3s ease" }}
          >
            {searchOpen ? "Cancel" : (
              <svg width="16" height="16" viewBox="0 0 1024 1024" fill="white">
                <path d="M956.8 905.6L723.2 672c54.4-64 86.4-147.2 86.4-236.8 0-204.8-166.4-371.2-371.2-371.2S67.2 230.4 67.2 435.2s166.4 371.2 371.2 371.2c89.6 0 172.8-32 236.8-86.4l233.6 233.6c6.4 6.4 16 9.6 25.6 9.6s19.2-3.2 25.6-9.6c12.8-12.8 12.8-32 0-44.8zM131.2 435.2c0-169.6 137.6-307.2 307.2-307.2s307.2 137.6 307.2 307.2-137.6 307.2-307.2 307.2-307.2-137.6-307.2-307.2z" />
              </svg>
            )}
          </GameButton>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="flex flex-col gap-2 mt-2 flex-1 overflow-hidden scrollbar-hide" style={{ padding: "0 8px" }}>
        <div className="w-full flex-shrink-0 overflow-hidden scrollbar-hide">
          <GameTabs
            tabs={LOBBY_TABS}
            value={selectedFilter}
            onChange={handleFilterChange}
            className="rounded-lg scrollbar-hide"
          />
        </div>

        <div className="flex gap-1.5 flex-1 overflow-hidden scrollbar-hide">
          {/* Provider Sidebar */}
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

          {/* Game Grid */}
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

            {visibleGames.length > 0 && visibleCount < filteredGames.length && (
              <div ref={sentinelRef} className="h-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
