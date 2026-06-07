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

export interface VipTierInfo {
  minDeposit: number;
  weeklyBonus: number;
  upgradeBonus: number;
  weeklyDepositRequirement: number;
}

export interface VipResponse {
  status: string;
  vipLevel: string;
  vipSince: string;
  totalDeposits: number;
  weeklyStatus: "eligible" | "claimed" | "deposit_not_met";
  upgradeStatus: "claimed" | "unclaimed";
  vipLevels: Record<string, VipTierInfo>;
}

export interface WeeklyBonusResponse {
  status: string;
  userId: number;
  weeklyBonus: number;
  balanceAfter: number;
  vipLevel: string;
}

export interface UpgradeBonusResponse {
  status: string;
  userId: number;
  upgradeBonus: number;
  balanceAfter: number;
  vipLevel: string;
}

export interface DepositOrder {
  [key: string]: any;
}

export interface DepositsResponse {
  success: boolean;
  items: DepositOrder[];
  total?: number;
  page?: number;
  limit?: number;
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

export interface DepositConfigItem {
  channel: string;
  name: string;
  isActive: boolean;
  minAmount: number;
  maxAmount: number;
  exchangeRate: number;
  sortOrder: number;
}

export interface DepositBonusInfo {
  status: string;
  hasBonusAvailable: boolean;
  nextDepositCount: number;
  nextBonusRate: number;
  nextBonusExample: string;
  turnoverMultiplier: number;
  successfulDeposits: number;
  allRates: Array<{
    depositCount: number;
    bonusRate: number;
  }>;
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
    paymentMethods?: {
      userId?: number;
      holderName?: string;
      bank?: {
        bankName?: string;
        ifsc?: string;
        accountNo?: string;
        isDefault?: boolean;
        isActive?: boolean;
        createdAt?: string;
        updatedAt?: string;
      } | null;
      upi?: {
        address?: string;
        isDefault?: boolean;
        isActive?: boolean;
        createdAt?: string;
        updatedAt?: string;
      } | null;
      upay?: {
        address?: string;
        isDefault?: boolean;
        isActive?: boolean;
        createdAt?: string;
        updatedAt?: string;
      } | null;
    };
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
    chargeInfo?: {
      percentage: number;
      flat: number;
      description: string;
    };
    limits?: {
      BANK: { min: number; max: number };
      UPI: { min: number; max: number };
      UPAY: { min: number; max: number };
      perDay: number;
      usedToday: number;
      remainingToday: number;
    };
  };
}

export interface WithdrawResponse {
  status: string;
  msg?: string;
  amount?: number;
  newBalance: number;
  orderId?: string;
  paymentMethod?: string;
  bankDetails?: {
    bankName?: string;
    bankCode?: string;
    accountNumber?: string;
    accountHolder?: string;
    ifsc?: string;
  };
}

export interface PaymentMethodResponse {
  status: string;
  data?: {
    _id: string;
    type: string;
    upiId?: string;
    rplId?: string;
    accountNo?: string;
    ifsc?: string;
    bankName?: string;
    holderName: string;
    isDefault: boolean;
    isActive: boolean;
  };
  msg?: string;
}

export interface ListPaymentMethodsResponse {
  status: string;
  data: Array<{
    _id: string;
    type: "UPI" | "BANK" | "UPAY";
    upiId?: string;
    rplId?: string;
    accountNo?: string;
    ifsc?: string;
    bankName?: string;
    holderName: string;
    isDefault: boolean;
    isActive: boolean;
  }>;
}

export interface WithdrawalRecord {
  [key: string]: unknown;
  userId: number;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  orderId?: string;
  _id?: string;
  charge?: number;
  currency?: string;
  paymentMethod?: string;
  paymentDetails?: {
    upiId?: string;
    holderName?: string;
  };
  channelName?: string;
  gatewayResponse?: any;
  note?: string;
  updatedAt?: string;
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

const checkAccountInactive = (data: any) => {
  if (data?.status === "failed" && data?.msg === "Account is inactive") {
    localStorage.removeItem(TOKEN_KEY);
    notifyListeners();
    if (!window.location.pathname.startsWith("/login")) {
      setTimeout(() => { window.location.href = "/login"; }, 100);
    }
    throw new Error("Account is locked. Please contact customer support.");
  }
};

export interface IpData {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export const authService = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  async fetchIpData(): Promise<IpData> {
    let ipv4 = "";
    try {
      const ipifyRes = await fetch("https://api4.ipify.org?format=json");
      if (ipifyRes.ok) {
        const ipifyData = await ipifyRes.json();
        ipv4 = ipifyData?.ip || "";
      }
    } catch {
      // fall through
    }

    const url = ipv4 ? `https://ipapi.co/${encodeURIComponent(ipv4)}/json/` : "https://ipapi.co/json/";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch IP data");
    return res.json();
  },

  async registerWithIpData(name: string, email: string, password: string): Promise<AuthResponse> {
    const ipData = await this.fetchIpData();
    const payload = { name, email, password, ...ipData };
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Registration failed"));
    persistTokenIfPresent(data);
    return data;
  },

  async register(mobile: string, password: string, referralCode?: string): Promise<AuthResponse> {
    const body: Record<string, any> = { mobile, password };
    if (referralCode) body.referralCode = referralCode;

    try {
      const ipData = await this.fetchIpData();
      Object.assign(body, ipData);
    } catch {
      // swallow; keep registration working even if IP fetch fails
    }

    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    checkAccountInactive(data);
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
    checkAccountInactive(data);
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
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch balance"));
    return data;
  },

  async getVip(): Promise<VipResponse> {
    const res = await fetch(`${API_BASE}/api/account/vip`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch VIP info"));
    return data;
  },

  async claimWeeklyBonus(): Promise<WeeklyBonusResponse> {
    const res = await fetch(`${API_BASE}/api/account/vip/weekly-bonus`, {
      method: "POST",
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to claim weekly bonus"));
    return data;
  },

  async claimUpgradeBonus(): Promise<UpgradeBonusResponse> {
    const res = await fetch(`${API_BASE}/api/account/vip/upgrade-bonus`, {
      method: "POST",
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to claim upgrade bonus"));
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
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch deposits"));
    return data;
  },

  async getLedger(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/wallet/ledger`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch ledger"));
    return data;
  },

  async requestWithdraw(amount: number, type?: string): Promise<WithdrawResponse> {
    const body: Record<string, any> = { amount };
    if (type) body.type = type;
    const res = await fetch(`${API_BASE}/api/account/withdraw`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Withdrawal failed"));
    return data;
  },

  async getWithdrawals(page = 1, limit = 25): Promise<WithdrawalsResponse> {
    const res = await fetch(`${API_BASE}/api/account/my-withdrawals?page=${page}&limit=${limit}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch withdrawals"));
    return data;
  },

  async getWithdrawInfo(): Promise<WithdrawInfoResponse> {
    const res = await fetch(`${API_BASE}/api/account/withdraw-info`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
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
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to bind bank account"));
    return data;
  },

  async addPaymentMethod(type: "UPI" | "BANK" | "UPAY", data: Record<string, string>): Promise<PaymentMethodResponse> {
    const res = await fetch(`${API_BASE}/api/account/payment-methods`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ type, ...data }),
    });
    handleUnauthorized(res);
    const result = await res.json();
    checkAccountInactive(result);
    if (!res.ok) throw new Error(extractErrorMessage(result, "Failed to add payment method"));
    return result;
  },

  async listPaymentMethods(): Promise<ListPaymentMethodsResponse> {
    const res = await fetch(`${API_BASE}/api/account/payment-methods`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch payment methods"));
    return data;
  },

  async setDefaultPaymentMethod(id: string): Promise<{ status: string; data: any }> {
    const res = await fetch(`${API_BASE}/api/account/payment-methods/${id}/default`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to set default payment method"));
    return data;
  },

  async getDepositConfig(): Promise<{ status: string; data: DepositConfigItem[] }> {
    const res = await fetch(`${API_BASE}/api/account/deposit-config`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch deposit config"));
    return data;
  },

  async getDepositBonusInfo(): Promise<DepositBonusInfo> {
    const res = await fetch(`${API_BASE}/api/account/deposit-bonus-info`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch deposit bonus info"));
    return data;
  },

  async deposit(amount: number, channel: string = "simplypay", bonusOptIn?: boolean): Promise<DepositResponse> {
    const res = await fetch(`${API_BASE}/api/payment/deposit`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ amount, channel, ...(bonusOptIn ? { bonusOptIn } : {}) }),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Deposit failed"));
    return data;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  async getAgencyNewSub(fromDate: string, toDate: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/agency/newsub?fromDate=${fromDate}&toDate=${toDate}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch new subscribers"));
    return data;
  },

  async getAgencyDaily(date?: string): Promise<any> {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    const query = params.toString();
    const res = await fetch(`${API_BASE}/api/agency/daily${query ? `?${query}` : ""}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch daily stats"));
    return data;
  },

  async getAgencyCommissions(page = 1, limit = 25): Promise<any> {
    const res = await fetch(`${API_BASE}/api/agency/commissions?page=${page}&limit=${limit}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch commissions"));
    return data;
  },

  async getAgencyTeam(params?: { tier?: number; userId?: number; fromDate?: string; toDate?: string; page?: number; limit?: number }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.tier) searchParams.set("tier", String(params.tier));
    if (params?.userId) searchParams.set("userId", String(params.userId));
    if (params?.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params?.toDate) searchParams.set("toDate", params.toDate);
    searchParams.set("page", String(params?.page || 1));
    searchParams.set("limit", String(params?.limit || 25));
    const res = await fetch(`${API_BASE}/api/agency/team?${searchParams}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch team"));
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
    checkAccountInactive(data);
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to redeem gift code"));
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    notifyListeners();
  },
};
