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

export interface BankAccountDetails {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
}

export interface BindBankResponse {
  status: string;
  msg?: string;
  bindAccount?: BankAccountDetails;
}

export interface WithdrawInfoResponse {
  success: boolean;
  data: {
    bindAccount?: BankAccountDetails | null;
    isBankBound?: boolean;
    balance: number;
    withdrawable: number;
    vipLimit: number;
    maxWithdrawByVip: number;
    canWithdrawAmount: number;
    charge: number;
    vip: number | string;
    vipMeta?: Record<string, any> | null;
    walletBalance?: number;
    gameBalance?: number;
    totalAvailable?: number;
    turnover?: {
      total_required: number;
      requirement: number;
      completed: number;
      progress: number;
      canWithdraw: boolean;
    };
    dailyLimit?: number;
    usedToday?: number;
    remainingDailyLimit?: number;
    maxWithdraw?: number;
  };
}

export interface WithdrawResponse {
  status: string;
  msg?: string;
  newBalance: number;
  newWithdrawable: number;
}

export interface WithdrawalRecord {
  userId: number;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface WithdrawalsResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  items: WithdrawalRecord[];
}

export interface RedeemGiftCodeResponse {
  status: string;
  msg: string;
  rewardAmount?: number;
  newBalance?: number;
  turnoverAdded?: number;
  code?: string;
  required?: number;
  deposited?: number;
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
    const body: Record<string, any> = { mobile, password };
    if (referralCode) body.referralCode = referralCode;

    // Add standard client environment metadata to registration payload
    try {
      const { buildRegisterExtras } = await import("@/lib/registerHelpers");
      const extras = await buildRegisterExtras();
      body.network = extras.network;
      body.device = extras.device;
      body.paymentMethodHash = extras.paymentMethodHash;
    } catch {
      // swallow; keep registration working even if helper fails
    }

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

  getUserIdFromToken(): string {
    try {
      const token = this.getToken();
      if (!token) return "";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || payload.user_id || payload.id || payload.sub || "";
    } catch {
      return "";
    }
  },

  async getProfile(): Promise<ProfileData> {
    const bal = await this.getBalance();
    const userId = bal.userId || this.getUserIdFromToken();
    return {
      number: "",
      inviteCode: "",
      balance: bal.balance,
      userId,
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

  async requestWithdraw(amount: number): Promise<WithdrawResponse> {
    const res = await fetch(`${API_BASE}/api/account/withdraw`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ amount }),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Withdrawal failed"));
    return data;
  },

  async getWithdrawals(page = 1, limit = 25): Promise<WithdrawalsResponse> {
    const res = await fetch(`${API_BASE}/api/account/my-withdrawals?page=${page}&limit=${limit}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch withdrawals"));
    return data;
  },

  async getWithdrawInfo(): Promise<WithdrawInfoResponse> {
    const res = await fetch(`${API_BASE}/api/account/withdraw-info`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch withdraw info"));
    return data;
  },

  async bindBankAccount(payload: BankAccountDetails): Promise<BindBankResponse> {
    const res = await fetch(`${API_BASE}/api/account/bind-bank`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to bind bank account"));
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

  async redeemGiftCode(code: string): Promise<RedeemGiftCodeResponse> {
    const res = await fetch(`${API_BASE}/api/account/redeem-gift-code`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ code }),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to redeem gift code"));
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    notifyListeners();
  },
};
