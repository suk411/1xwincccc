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
  provider_code: string;
  game_id: string | number;
  type: string;
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
    name: "Money Coming",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/money-coming.png",
    provider_code: "JE",
    game_id: 51,
    type: "SL",
  },
  {
    name: "Fortune Mouse",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-mouse%20(1).png",
    provider_code: "PG",
    game_id: 68,
    type: "SL",
  },
  {
    name: "Fortune Gems 2",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-gem2.png",
    provider_code: "JE",
    game_id: 223,
    type: "SL",
  },
  {
    name: "Super Ace",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/super-ace.png",
    provider_code: "JE",
    game_id: 49,
    type: "SL",
  },
  {
    name: "Jackpot Joker",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/jackpot-joker.png",
    provider_code: "JE",
    game_id: 301,
    type: "SL",
  },
  {
    name: "Fortune Gems 3",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-gem3.png",
    provider_code: "JE",
    game_id: 300,
    type: "SL",
  },
  {
    name: "Crazy777",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/carzy-777.png",
    provider_code: "JE",
    game_id: 35,
    type: "SL",
  },
  {
    name: "Fortune Rabbit",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-rabbit.png",
    provider_code: "PG",
    game_id: 1543462,
    type: "SL",
  },
  {
    name: "Fortune Ox",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-ox.png",
    provider_code: "PG",
    game_id: 98,
    type: "SL",
  },
  {
    name: "Fortune Tiger",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-tiger.png",
    provider_code: "PG",
    game_id: 126,
    type: "SL",
  },
  {
    name: "Dragon Hatch",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/dragon-hatch.png",
    provider_code: "PG",
    game_id: 57,
    type: "SL",
  },
  {
    name: "Wild Bandito",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/wild-bandito.png",
    provider_code: "PG",
    game_id: 104,
    type: "SL",
  },
  {
    name: "Mermaid Riches",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/mermaid-riches.png",
    provider_code: "PG",
    game_id: 102,
    type: "SL",
  },
  {
    name: "Leprechaun Riches",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/leprechaun-riches.png",
    provider_code: "PG",
    game_id: 60,
    type: "SL",
  },
  {
    name: "Captain's Bounty",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/captains-bounty.png",
    provider_code: "PG",
    game_id: 54,
    type: "SL",
  },
  {
    name: "Queen of Bounty",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/queen-bounty.png",
    provider_code: "PG",
    game_id: 84,
    type: "SL",
  },
  {
    name: "Wild Bounty Showdown",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/wild-bounty-showdown.png",
    provider_code: "PG",
    game_id: 135,
    type: "SL",
  },
  {
    name: "Dragon Tiger",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/dravstig.png",
    provider_code: "JE",
    game_id: 123,
    type: "CB",
  },
  {
    name: "Aviator",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/aviator.png",
    provider_code: "JD",
    game_id: "22_22001",
    type: "MG",
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
