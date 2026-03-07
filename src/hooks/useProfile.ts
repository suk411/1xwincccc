import { useState, useEffect } from "react";
import { authService } from "@/services/authService";

interface ProfileState {
  balance: number;
  userId: string;
  loading: boolean;
}

export const useProfile = () => {
  const [state, setState] = useState<ProfileState>({ balance: 0, userId: "", loading: true });

  const refresh = async () => {
    try {
      if (!authService.isLoggedIn()) return;
      setState((s) => ({ ...s, loading: true }));
      const profile = await authService.getProfile();
      setState({ balance: profile.balance, userId: profile.userId, loading: false });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { ...state, refresh };
};
