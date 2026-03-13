import { useEffect, useSyncExternalStore } from "react";
import { authService } from "@/services/authService";

const CACHE_KEY = "profile_cache";

interface ProfileData {
  balance: number;
  userId: string;
  loading: boolean;
}

// ---- Shared global store ----
let current: ProfileData = (() => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { balance: parsed.balance ?? 0, userId: parsed.userId ?? "", loading: false };
    }
  } catch {}
  return { balance: 0, userId: "", loading: false };
})();

const subs = new Set<() => void>();
const notify = () => subs.forEach((fn) => fn());
const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb); }; };
const getSnapshot = () => current;

let fetching = false;

const refresh = async () => {
  if (fetching || !authService.isLoggedIn()) return;
  fetching = true;
  current = { ...current, loading: true };
  notify();
  try {
    const profile = await authService.getProfile();
    const userId = profile.userId || authService.getUserIdFromToken();
    current = { balance: profile.balance, userId, loading: false };
    localStorage.setItem(CACHE_KEY, JSON.stringify({ balance: current.balance, userId: current.userId }));
  } catch {
    // If API fails, still try to get userId from token
    const tokenUserId = authService.getUserIdFromToken();
    if (tokenUserId && !current.userId) {
      current = { ...current, userId: tokenUserId, loading: false };
    } else {
      current = { ...current, loading: false };
    }
  }
  fetching = false;
  notify();
};

// Clear cache on logout
authService.subscribe(() => {
  if (!authService.isLoggedIn()) {
    localStorage.removeItem(CACHE_KEY);
    current = { balance: 0, userId: "", loading: false };
    notify();
  }
});

// ---- Hook ----
export const useProfile = (autoFetch = true) => {
  const state = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    if (autoFetch) refresh();
  }, []);

  return { ...state, refresh };
};

export const refreshProfile = refresh;
