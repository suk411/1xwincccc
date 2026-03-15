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
  game_id: number;
}

export interface GameLaunchResponse {
  status: string;
 game: GameObject
  type: string;
  providerCode: string;
  gameUrl: string;
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
  },
  {
    name: "Fortune Mouse",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-mouse%20(1).png",
    provider_code: "PG",
    game_id: 68,
  },
  {
    name: "Fortune Gems 2",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-gem2.png",
    provider_code: "JE",
    game_id: 223,
  },
  {
    name: "Super Ace",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/super-ace.png",
    provider_code: "JE",
    game_id: 49,
  },
  {
    name: "Jackpot Joker",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/jackpot-joker.png",
    provider_code: "JE",
    game_id: 301,
  },
  {
    name: "Fortune Gems 3",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-gem3.png",
    provider_code: "JE",
    game_id: 300,
  },
  {
    name: "Crazy777",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/carzy-777.png",
    provider_code: "JE",
    game_id: 35,
  },
  {
    name: "Fortune Rabbit",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-rabbit.png",
    provider_code: "PG",
    game_id: 1543462,
  },
  {
    name: "Fortune Ox",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-ox.png",
    provider_code: "PG",
    game_id: 98,
  },
  {
    name: "Fortune Tiger",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-tiger.png",
    provider_code: "PG",
    game_id: 126,
  },
  {
    name: "Dragon Hatch",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/dragon-hatch.png",
    provider_code: "PG",
    game_id: 57,
  },
  {
    name: "Wild Bandito",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/wild-bandito.png",
    provider_code: "PG",
    game_id: 104,
  },
  {
    name: "Mermaid Riches",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/mermaid-riches.png",
    provider_code: "PG",
    game_id: 102,
  },
  {
    name: "Leprechaun Riches",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/leprechaun-riches.png",
    provider_code: "PG",
    game_id: 60,
  },
  {
    name: "Captain's Bounty",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/captains-bounty.png",
    provider_code: "PG",
    game_id: 54,
  },
  {
    name: "Queen of Bounty",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/queen-bounty.png",
    provider_code: "PG",
    game_id: 84,
  },
  {
    name: "Wild Bounty Showdown",
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/wild-bounty-showdown.png",
    provider_code: "PG",
    game_id: 135,
  },
];

export const gameService = {
  async launch(game: GameObject): Promise<GameLaunchResponse> {
    const params = new URLSearchParams({
      g_id: String(game.game_id),
      p_code: game.provider_code,
      type: "SL",
      lang: "en-US",
      html5: "1",
    });
    const res = await fetch(`${API_BASE}/api/game/launch?${params}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
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
