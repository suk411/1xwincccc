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

const extractErrorMessage = (data: any, fallback: string) => {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data.msg || data.message || data.error || fallback;
};

function rejectWithError(data: any, fallback: string): never {
  const msg = extractErrorMessage(data, fallback);
  throw new Error(msg);
}

const rejectIfFailed = (data: any, fallback: string) => {
  if (data?.status === "failed") {
    rejectWithError(data, fallback);
  }
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
  mode?: string;
}

export interface WingoBetResponse {
  status: string;
  msg?: string;
}

export interface WingoUserBetItem {
  issueNumber: string;
  gameMode: string;
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
  async getCurrent(mode?: string): Promise<WingoCurrentResponse> {
    const qs = mode ? `?mode=${mode}` : "";
    const res = await fetch(`${API_BASE}/api/wingo/current${qs}`);
    const data = await res.json();
    rejectIfFailed(data, "Operation failed");
    if (!res.ok) rejectWithError(data, "Failed to sync current round");
    return data;
  },

  async getHistory(pageNo = 1, mode?: string): Promise<WingoHistoryResponse> {
    const qs = mode ? `?pageNo=${pageNo}&mode=${mode}` : `?pageNo=${pageNo}`;
    const res = await fetch(`${API_BASE}/api/wingo/history${qs}`);
    const data = await res.json();
    rejectIfFailed(data, "Operation failed");
    if (!res.ok) rejectWithError(data, "Failed to fetch history");
    return data;
  },

  async getTrends(mode?: string): Promise<WingoTrendsResponse> {
    const qs = mode ? `?mode=${mode}` : "";
    const res = await fetch(`${API_BASE}/api/wingo/trends${qs}`);
    const data = await res.json();
    rejectIfFailed(data, "Operation failed");
    if (!res.ok) rejectWithError(data, "Failed to fetch trends");
    return data;
  },

  async getMyBets(params?: { page?: number; limit?: number; status?: string; issueNumber?: string; mode?: string }): Promise<WingoBetsResponse> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    if (params?.issueNumber) qs.set("issueNumber", params.issueNumber);
    if (params?.mode) qs.set("mode", params.mode);
    const query = qs.toString();

    const res = await fetch(`${API_BASE}/api/wingo/my-bets${query ? `?${query}` : ""}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    rejectIfFailed(data, "Operation failed");
    if (!res.ok) rejectWithError(data, "Failed to fetch my bets");
    return data;
  },

  async checkWin(issue: string, mode?: string): Promise<{ status: string; issue: string; result: number; winamt: number[] }> {
    const qs = mode ? `?issue=${issue}&mode=${mode}` : `?issue=${issue}`;
    const res = await fetch(`${API_BASE}/api/wingo/iswin${qs}`, {
      headers: authHeaders(),
    });
    handleUnauthorized(res);
    const data = await res.json();
    rejectIfFailed(data, "Operation failed");
    if (!res.ok) rejectWithError(data, "Failed to check win");
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
    rejectIfFailed(data, "Operation failed");
    if (!res.ok) rejectWithError(data, "Failed to place bet");
    if (data?.status && data.status !== "success") rejectWithError(data, "Failed to place bet");
    return data;
  },
};

