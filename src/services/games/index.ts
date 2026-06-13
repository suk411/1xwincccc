import { withCacheBust } from "@/lib/cacheBust";
import { JE_GAMES } from "./je";
import { JD_GAMES } from "./jd";
import { TU_GAMES } from "./tu";
import { PG_GAMES } from "./pg";
import { IB_GAMES } from "./ib";

const ALL_GAMES = [
  ...JE_GAMES,
  ...JD_GAMES,
  ...TU_GAMES,
  ...PG_GAMES,
  ...IB_GAMES,
];

export const GAME_LIST = ALL_GAMES.map((game) => ({
  ...game,
  logo: withCacheBust(game.logo),
}));
