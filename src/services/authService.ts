const API_BASE = "https://backend-1xwinccc.onrender.com";

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  userId?: string;
}

export interface ProfileData {
  number: string;
  inviteCode: string;
  balance: number;
  userId: string;
}

export interface ProfileResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

const TOKEN_KEY = "auth_token";

const listeners = new Set<() => void>();
const notifyListeners = () => listeners.forEach((l) => l());

export const authService = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  async register(number: string, password: string, inviteCode?: string): Promise<AuthResponse> {
    const body: Record<string, string> = { number, password };
    if (inviteCode) body.inviteCode = inviteCode;

    const res = await fetch(`${API_BASE}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Registration failed");
    return data;
  },

  async login(number: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Login failed");
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      notifyListeners();
    }
    return data;
  },

  async getProfile(): Promise<ProfileData> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API_BASE}/api/user/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: ProfileResponse = await res.json();
    if (!data.success || !data.data) throw new Error(data.error || "Failed to fetch profile");
    return data.data;
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
