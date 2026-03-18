const API_BASE = "https://backend-ledger-0ra6.onrender.com";

const TOKEN_KEY = "auth_token";

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

const handleUnauthorized = (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }
};

export interface GameObject {
  name: string;
  logo: string;
  provider: string;
  provider_code: string;
  game_id: string | number;
  type: string;
  category: string;
}

export interface GameLaunchResponse {
  status: string;
  gameUrl: string;
  gameId?: string | number;
  type?: string;
  providerCode?: string;
  moveIn?: { amount: number; referenceId?: string | null };
}

export interface GameWithdrawResponse {
  status: string;
  msg?: string;
  moveOut: { amount: number; referenceId?: string | null };
  walletBalance?: number;
}


export const GAME_LIST: GameObject[] = [
   {
    name: "Fortune Gems 3",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-gem3.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 300,
    type: "SL",
    category: "slot",
  },
  {
    name: "Money Coming",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/money-coming.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 51,
    type: "SL",
    category: "slot",
  },
  {
    name: "Fortune Mouse",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-mouse%20(1).png",
    provider_code: "PG",
    provider: "pg",
    game_id: 68,
    type: "SL",
    category: "slot",
  },
  {
    name: "Fortune Gems 2",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-gem2.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 223,
    type: "SL",
    category: "slot",
  },
  {
    name: "Super Ace",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/super-ace.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 49,
    type: "SL",
    category: "slot",
  },
  {
    name: "Jackpot Joker",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/jackpot-joker.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 301,
    type: "SL",
    category: "slot",
  },
 
  {
    name: "Crazy777",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/carzy-777.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 35,
    type: "SL",
    category: "slot",
  },
  {
    name: "Fortune Rabbit",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-rabbit.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 1543462,
    type: "SL",
    category: "slot",
  },
  {
    name: "Fortune Ox",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-ox.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 98,
    type: "SL",
    category: "slot",
  },
  {
    name: "Fortune Tiger",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-tiger.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 126,
    type: "SL",
    category: "slot",
  },
  {
    name: "Dragon Hatch",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/dragon-hatch.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 57,
    type: "SL",
    category: "slot",
  },
  {
    name: "Wild Bandito",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/wild-bandito.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 104,
    type: "SL",
    category: "slot",
  },
  {
    name: "Mermaid Riches",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/mermaid-riches.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 102,
    type: "SL",
    category: "slot",
  },
  {
    name: "Leprechaun Riches",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/leprechaun-riches.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 60,
    type: "SL",
    category: "slot",
  },
  {
    name: "Captain's Bounty",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/captains-bounty.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 54,
    type: "SL",
    category: "slot",
  },
  {
    name: "Queen of Bounty",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/queen-bounty.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 84,
    type: "SL",
    category: "slot",
  },
  {
    name: "Wild Bounty Showdown",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/wild-bounty-showdown.png",
    provider_code: "PG",
    provider: "pg",
    game_id: 135,
    type: "SL",
    category: "slot",
  },
  {
    name: "Dragon Tiger",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/dravstig.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 123,
    type: "CB",
    category: "casino",
  },
  {
    name: "Aviator",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/aviator.png",
    provider_code: "SPRIBE",
    provider: "spribe",
    game_id: "22_22001",
    type: "MG",
    category: "casino",
  },
  {
    name: "7Up 7Down",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/7up7downJLIjili.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 124,
    type: "CB",
    category: "casino",
  },
  {
    name: "Mines",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/mines.png",
    provider_code: "SPRIBE",
    provider: "spribe",
    game_id: 229,
    type: "MG",
    category: "casino",
  },
  {
    name: "Tongits Go",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/TongitsGo.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 199,
    type: "PK",
    category: "casino",
  },
  {
    name: "Big Small",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/BigSmall.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 524,
    type: "CB",
    category: "casino",
  },
  {
    name: "Ludo Quick",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/LudoQuick.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 163,
    type: "CB",
    category: "casino",
  },
  {
    name: "Color Prediction",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/ColorPrediction.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 204,
    type: "CB",
    category: "casino",
  },
  {
    name: "Plinko",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/Plinkojili.png",
    provider_code: "SPRIBE",
    provider: "spribe",
    game_id: 242,
    type: "MG",
    category: "casino",
  },
  {
    name: "Chicken Dash",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/chicken%20dash.png",
    provider_code: "SPRIBE",
    provider: "spribe",
    game_id: 690,
    type: "MG",
    category: "casino",
  },
  {
    name: "JDB Slot",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/jackpot-joker.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: 999,
    type: "SL",
    category: "slot",
  },
  {
    name: "Black Jack",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/black%20jack.png",
    provider_code: "JE",
    provider: "jili",
    game_id: 219,
    type: "CB",
    category: "casino",
  },
  
  {
    name: "Mines 2",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/Mines2.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: "9_9021",
    type: "MG",
    category: "casino",
  },
  {
    name: "Mines",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/Mines3.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: "9_9014",
    type: "MG",
    category: "casino",
  },
  {
    name: "Dice",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/Dice123.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: "9_9019",
    type: "MG",
    category: "casino",
  },
  {
    name: "Hilo",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/Hilo123.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: "9_9017",
    type: "MG",
    category: "casino",
  },
  {
    name: "Mole Crash",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/MoleCrash.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: "9_9020",
    type: "MG",
    category: "casino",
  },
  {
    name: "Dragon Tiger Joker Bonus",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/DragonTigerJokerBonus.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: "18_18026",
    type: "CB",
    category: "casino",
  },
  {
    name: "Goal",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/Goal123.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: "9_9016",
    type: "MG",
    category: "casino",
  },
  {
    name: "Lucky Colour Game",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/LuckyColorGame.png",
    provider_code: "JD",
    provider: "jdb",
    game_id: "9_9010",
    type: "CB",
    category: "casino",
  },

];

export const gameService = {
  async launch(game: GameObject): Promise<GameLaunchResponse> {
    const params = new URLSearchParams({
      g_id: String(game.game_id),
      p_code: game.provider_code,
      type: game.type,
      lang: "en-US",
      html5: "1",
    });
    const res = await fetch(`${API_BASE}/api/game/launch?${params}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const rawData = await res.json();
    const data = Array.isArray(rawData) ? rawData[0] : rawData;
    if (!res.ok || data.status !== "success") {
      throw new Error(data.msg || data.error || data.message || "Game launch failed");
    }
    return data;
  },

  async withdraw(providerCode: string): Promise<GameWithdrawResponse> {
    const res = await fetch(`${API_BASE}/api/game/withdraw`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ p_code: providerCode }),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok || (data.status !== "success" && !data.moveOut)) {
      throw new Error(data.msg || data.error || data.message || "Withdraw failed");
    }
    return data;
  },
};
