const API_BASE = "https://backend-ledger-0ra6.onrender.com";

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  user?: { id: string };
}

export interface ProfileData {
  number: string;
  inviteCode: string;
  balance: number;
  userId: string;
}

export interface BalanceResponse {
  status: string;
  userId: string;
  balance: number;
}

export interface VipResponse {
  status: string;
  vipLevel: number | string;
  vipSince: string;
  totalDeposits: number;
  withdrawDailyLimit: number;
  monthlyCheckinBonus: number;
  canClaimMonthly: boolean;
  pendingUpgradeBonus: number;
  canClaimUpgrade: boolean;
}

export interface VipCheckinResponse {
  status: string;
  userId: string;
  monthlyBonus: number;
  upgradeBonus: number;
  totalCredited: number;
  balanceAfter: number;
  vipLevel: number;
}

export interface DepositOrder {
  [key: string]: any;
}

export interface DepositsResponse {
  status: string;
  total: number;
  page: number;
  limit: number;
  items: DepositOrder[];
}

export interface DepositResponse {
  success: boolean;
  paymentUrl?: string;
  merOrderNo?: string;
  amount?: number;
  currency?: string;
  status?: string;
  msg?: string;
}

export interface LedgerResponse {
  [key: string]: any;
}

const TOKEN_KEY = "auth_token";

const extractErrorMessage = (data: any, fallback: string): string => {
  if (typeof data === "string") return data;
  const msg = data?.error || data?.message || data?.msg || data?.detail || data?.errors?.[0]?.message || data?.errors?.[0]?.msg;
  if (msg) return typeof msg === "string" ? msg : JSON.stringify(msg);
  // If no known field, stringify the whole response so user sees full API error
  try {
    const str = JSON.stringify(data);
    return str !== "{}" ? str : fallback;
  } catch {
    return fallback;
  }
};

const listeners = new Set<() => void>();
const notifyListeners = () => listeners.forEach((l) => l());

const extractToken = (payload: any): string | undefined => {
  return (
    payload?.token ??
    payload?.data?.token ??
    payload?.data?.accessToken ??
    payload?.data?.jwt ??
    payload?.data?.user?.token
  );
};

const persistTokenIfPresent = (payload: any) => {
  const token = extractToken(payload);
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  notifyListeners();
};

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

const handleUnauthorized = (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    notifyListeners();
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }
};

export const authService = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  async register(mobile: string, password: string, referralCode?: string): Promise<AuthResponse> {
    const body: Record<string, string> = { mobile, password };
    if (referralCode) body.referralCode = referralCode;
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Registration failed"));
    persistTokenIfPresent(data);
    return data;
  },

  async login(mobile: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Login failed"));
    persistTokenIfPresent(data);
    return data;
  },

  async getBalance(): Promise<BalanceResponse> {
    const res = await fetch(`${API_BASE}/api/account/balance`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch balance"));
    return data;
  },

  async getVip(): Promise<VipResponse> {
    const res = await fetch(`${API_BASE}/api/account/vip`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch VIP info"));
    return data;
  },

  async checkinVip(): Promise<VipCheckinResponse> {
    const res = await fetch(`${API_BASE}/api/account/vip/checkin`, {
      method: "POST",
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Check-in failed"));
    return data;
  },

  async getProfile(): Promise<ProfileData> {
    const bal = await this.getBalance();
    return {
      number: "",
      inviteCode: "",
      balance: bal.balance,
      userId: bal.userId,
    };
  },

  async getDeposits(page = 1, limit = 15): Promise<DepositsResponse> {
    const res = await fetch(`${API_BASE}/api/account/my-deposits?page=${page}&limit=${limit}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch deposits"));
    return data;
  },

  async getLedger(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/wallet/ledger`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch ledger"));
    return data;
  },

  async deposit(amount: number): Promise<DepositResponse> {
    const res = await fetch(`${API_BASE}/api/payment/deposit`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ amount }),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Deposit failed"));
    return data;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  async getReferrals(page = 1, limit = 20): Promise<any> {
    const res = await fetch(`${API_BASE}/api/auth/referrals?page=${page}&limit=${limit}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch referrals"));
    return data;
  },

  async getCommissions(claim?: boolean, page = 1, limit = 25): Promise<any> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (claim !== undefined) params.set("claim", String(claim));
    const res = await fetch(`${API_BASE}/api/agent/commissions?${params}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch commissions"));
    return data;
  },

  async getBonusSummary(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/agent/bonus/summary`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch bonus summary"));
    return data;
  },

  async getDailyBonus(date?: string): Promise<any> {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    const query = params.toString();
    const res = await fetch(`${API_BASE}/api/agent/bonus/daily${query ? `?${query}` : ""}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch daily bonus"));
    return data;
  },

  async claimBonus(upTo?: string): Promise<any> {
    const body = upTo ? JSON.stringify({ upTo }) : undefined;
    const res = await fetch(`${API_BASE}/api/agent/bonus/claim`, {
      method: "POST",
      headers: authHeaders(),
      body,
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Claim failed"));
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    notifyListeners();
  },
};
