import { useState, useEffect } from "react";
import { authService } from "@/services/authService";

const CACHE_KEY = "profile_cache";

const getCached = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw) as { balance: number; userId: string };
  } catch {}
  return { balance: 0, userId: "" };
};

interface ProfileState {
  balance: number;
  userId: string;
  loading: boolean;
}

export const useProfile = () => {
  const cached = getCached();
  const [state, setState] = useState<ProfileState>({ balance: cached.balance, userId: cached.userId, loading: true });

  const refresh = async () => {
    try {
      if (!authService.isLoggedIn()) return;
      setState((s) => ({ ...s, loading: true }));
      const profile = await authService.getProfile();
      const next = { balance: profile.balance, userId: profile.userId };
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      setState({ ...next, loading: false });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { ...state, refresh };
};
