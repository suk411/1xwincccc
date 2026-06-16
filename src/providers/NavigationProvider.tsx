import { createContext, useContext, useCallback } from "react";
import { useNavigate, NavigateOptions, To } from "react-router-dom";

interface NavigationContextValue {
  navigateWithTransition: (to: To, options?: NavigateOptions) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const navigateWithTransition = useCallback(
    (to: To, options?: NavigateOptions) => {
      navigate(to, options);
    },
    [navigate],
  );

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <NavigationContext.Provider value={{ navigateWithTransition, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useTransitionNavigate() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useTransitionNavigate must be used within NavigationProvider");
  return ctx;
}
