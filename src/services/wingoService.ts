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

const extractErrorMessage = (data: any, fallback: string) => {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data.msg || data.message || data.error || fallback;
};

export interface WingoCurrentResponse {
  gameCode: string;
  intervalMinute: number;
  state: number;
  previous?: { issueNumber: string; startTime: number; endTime: number };
  current: { issueNumber: string; startTime: number; endTime: number };
  next?: { issueNumber: string; startTime: number; endTime: number };
}

export interface WingoHistoryResponse {
  code: number;
  msg: string;
  data: {
    list: Array<{ issueNumber: string; number: number }>;
    pageNo: number;
    totalPage: number;
    totalCount: number;
  };
}

export interface WingoTrendItem {
  number: number;
  missingCount: number;
  avgMissing: number;
  openCount: number;
  maxContinuous: number;
}

export interface WingoTrendsResponse {
  code: number;
  msg: string;
  data: WingoTrendItem[];
}

export interface WingoBetRequest {
  issueNumber: string;
  betamount: number;
  selectType: string;
}

export interface WingoBetResponse {
  status: string;
  msg?: string;
}

export interface WingoUserBetItem {
  issueNumber: string;
  orderNumber: string;
  betamount: number;
  fee: number;
  realAmount: number;
  selectType: string;
  status: "pending" | "won" | "lost" | string;
  result?: {
    number?: string;
    selectType?: string;
    colour?: string;
    premium?: string;
    profitAmount?: number;
    timestamp?: string;
  } | null;
  timestamp: string;
}

export interface WingoBetsResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  items: WingoUserBetItem[];
  msg?: string;
}

export const wingoService = {
  async getCurrent(): Promise<WingoCurrentResponse> {
    const res = await fetch(`${API_BASE}/api/wingo/current`);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to sync current round"));
    return data;
  },

  async getHistory(pageNo = 1): Promise<WingoHistoryResponse> {
    const res = await fetch(`${API_BASE}/api/wingo/history?pageNo=${pageNo}`);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch history"));
    return data;
  },

  async getTrends(): Promise<WingoTrendsResponse> {
    const res = await fetch(`${API_BASE}/api/wingo/trends`);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch trends"));
    return data;
  },

  async getMyBets(params?: { page?: number; limit?: number; status?: string; issueNumber?: string }): Promise<WingoBetsResponse> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    if (params?.issueNumber) qs.set("issueNumber", params.issueNumber);
    const query = qs.toString();

    const res = await fetch(`${API_BASE}/api/wingo/bets${query ? `?${query}` : ""}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch my bets"));
    return data;
  },

  async checkWin(issue: string): Promise<{ status: string; issue: string; result: number; winamt: number[] }> {
    const res = await fetch(`${API_BASE}/api/wingo/iswin?issue=${issue}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to check win"));
    return data;
  },

  async placeBet(payload: WingoBetRequest): Promise<WingoBetResponse> {
    const res = await fetch(`${API_BASE}/api/wingo/bet`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    handleUnauthorized(res);
    const data = await res.json();
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to place bet"));
    if (data?.status && data.status !== "success") throw new Error(extractErrorMessage(data, "Failed to place bet"));
    return data;
  },
};

