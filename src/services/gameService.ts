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
    logo: "https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/gamelogo/fortune-mouse.png",
    provider_code: "PG",
    game_id: 68,
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
