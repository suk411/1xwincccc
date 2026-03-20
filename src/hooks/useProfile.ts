import { useEffect, useSyncExternalStore } from "react";
import { authService } from "@/services/authService";

const CACHE_KEY = "profile_cache";

interface ProfileData {
  balance: number;
  userId: string;
  vipLevel: number;
  loading: boolean;
}

// ---- Shared global store ----
let current: ProfileData = (() => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { balance: parsed.balance ?? 0, userId: parsed.userId ?? "", vipLevel: parsed.vipLevel ?? 0, loading: false };
    }
  } catch {}
  return { balance: 0, userId: "", vipLevel: 0, loading: false };
})();

const subs = new Set<() => void>();
const notify = () => subs.forEach((fn) => fn());
const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb); }; };
const getSnapshot = () => current;

let fetching = false;

const refresh = async (force = false) => {
  if (fetching || !authService.isLoggedIn()) return;
  
  // If we already have a vipLevel > 0 and not forcing, we can skip re-fetching VIP
  // but we still want to refresh balance regularly.
  // For the purpose of "caching vip0", if we already fetched it once, 
  // we can avoid the extra API call for every game launch.
  
  fetching = true;
  current = { ...current, loading: true };
  notify();
  try {
    const profile = await authService.getProfile();
    const userId = profile.userId || authService.getUserIdFromToken();
    
    let vipLevel = current.vipLevel;
    
    // Fetch VIP level only if we don't have it or if forced
    if (force || vipLevel === 0) {
      try {
        const vipData = await authService.getVip();
        const rawVip = vipData.vipLevel;
        if (typeof rawVip === 'number') {
          vipLevel = rawVip;
        } else if (typeof rawVip === 'string') {
          const match = rawVip.match(/\d+/);
          if (match) {
            vipLevel = parseInt(match[0], 10);
          } else if (rawVip.toLowerCase().startsWith('svip')) {
            vipLevel = 5;
          }
        }
      } catch (err) {
        console.error("Failed to fetch VIP:", err);
      }
    }
    
    current = { balance: profile.balance, userId, vipLevel, loading: false };
    localStorage.setItem(CACHE_KEY, JSON.stringify({ 
      balance: current.balance, 
      userId: current.userId, 
      vipLevel: current.vipLevel 
    }));
  } catch {
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
    current = { balance: 0, userId: "", vipLevel: 0, loading: false };
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
