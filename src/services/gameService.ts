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
    sessionStorage.setItem("session_expired", "Session expired. Please login again.");
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
  isVipOnly?: boolean;
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


export { GAME_LIST } from "./games";

export interface GameBalanceResponse {
  status: string;
  walletBalance: number;
  gameBalance: Record<string, number>;
  totalBalance: number;
}

export const gameService = {
  async watch(game: GameObject): Promise<GameLaunchResponse> {
    const params = new URLSearchParams({
      g_id: String(game.game_id),
      p_code: game.provider_code,
      type: game.type,
      lang: "en-US",
      html5: "1",
    });
    const res = await fetch(`${API_BASE}/game/watch?${params}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const rawData = await res.json();
    const data = Array.isArray(rawData) ? rawData[0] : rawData;
    if (!res.ok || data.status !== "success") {
      throw new Error(data.msg || data.error || data.message || "Demo launch failed");
    }
    return data;
  },

  async getBalance(): Promise<GameBalanceResponse> {
    const res = await fetch(`${API_BASE}/api/game/balance`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.msg || "Failed to fetch balances");
    }
    return data;
  },

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

