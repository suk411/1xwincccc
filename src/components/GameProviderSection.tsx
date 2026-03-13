import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

import jiliLogo from "@/assets/providers/jili-logo.png";
import pgLogo from "@/assets/providers/pg-logo.png";
import ppLogo from "@/assets/providers/pp-logo.png";
import hotLogo from "@/assets/providers/hot-logo.png";

import blackjack from "@/assets/games/blackjack.png";
import dragonTiger from "@/assets/games/dragon-tiger.png";
import richWheel from "@/assets/games/rich-wheel.png";
import fortuneGems from "@/assets/games/fortune-gems.png";

const providerLogos: Record<string, string> = {
  JILI: jiliLogo,
  PG: pgLogo,
  PP: ppLogo,
  HOT: hotLogo,
};

const gameImages = [blackjack, dragonTiger, richWheel, fortuneGems];

export interface GameItem {
  name: string;
  image: string;
}

interface ProviderGames {
  provider: string;
  games: GameItem[];
}

// Default games per provider using the 4 uploaded images
const defaultProviderGames: ProviderGames[] = [
  {
    provider: "HOT",
    games: [
      { name: "BLACKJACK", image: blackjack },
      { name: "DRAGON TIGER", image: dragonTiger },
      { name: "RICH WHEEL", image: richWheel },
      { name: "FORTUNE GEMS 2", image: fortuneGems },
      { name: "BLACKJACK", image: blackjack },
      { name: "DRAGON TIGER", image: dragonTiger },
    ],
  },
  {
    provider: "JILI",
    games: [
      { name: "FORTUNE GEMS 2", image: fortuneGems },
      { name: "BLACKJACK", image: blackjack },
      { name: "RICH WHEEL", image: richWheel },
      { name: "DRAGON TIGER", image: dragonTiger },
      { name: "FORTUNE GEMS 2", image: fortuneGems },
      { name: "BLACKJACK", image: blackjack },
    ],
  },
  {
    provider: "PG",
    games: [
      { name: "DRAGON TIGER", image: dragonTiger },
      { name: "FORTUNE GEMS 2", image: fortuneGems },
      { name: "BLACKJACK", image: blackjack },
      { name: "RICH WHEEL", image: richWheel },
      { name: "DRAGON TIGER", image: dragonTiger },
      { name: "FORTUNE GEMS 2", image: fortuneGems },
    ],
  },
  {
    provider: "PP",
    games: [
      { name: "RICH WHEEL", image: richWheel },
      { name: "DRAGON TIGER", image: dragonTiger },
      { name: "FORTUNE GEMS 2", image: fortuneGems },
      { name: "BLACKJACK", image: blackjack },
      { name: "RICH WHEEL", image: richWheel },
      { name: "DRAGON TIGER", image: dragonTiger },
    ],
  },
];

const GameProviderSection = ({ data = defaultProviderGames }: { data?: ProviderGames[] }) => {
  return (
    <div className="flex flex-col gap-3 mt-2">
      {data.map((section) => (
        <div key={section.provider} className="rounded-lg overflow-hidden" style={{ backgroundColor: "#1a0a10" }}>
          {/* Provider Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <img
                src={providerLogos[section.provider] || hotLogo}
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

          {/* Game Grid - 3 columns, 2 rows */}
          <div className="grid grid-cols-3 gap-2 px-2 pb-3">
            {section.games.slice(0, 6).map((game, i) => (
              <button key={i} className="flex flex-col items-center gap-0 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full aspect-square object-cover rounded-xl"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameProviderSection;
