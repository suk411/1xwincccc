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

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    notifyListeners();
  },
};
