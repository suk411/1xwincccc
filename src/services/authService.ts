const API_BASE = "https://backend-1xwinccc.onrender.com";

export interface AuthResponse {
  message: string;
  token?: string;
  userId?: string;
}

export interface ProfileResponse {
  number: string;
  inviteCode: string;
  balance: number;
  userId: string;
}

const TOKEN_KEY = "auth_token";

export const authService = {
  async register(number: string, password: string, inviteCode?: string): Promise<AuthResponse> {
    const body: Record<string, string> = { number, password };
    if (inviteCode) body.inviteCode = inviteCode;

    const res = await fetch(`${API_BASE}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  },

  async login(number: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async getProfile(): Promise<ProfileResponse> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API_BASE}/api/user/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
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
  },
};
