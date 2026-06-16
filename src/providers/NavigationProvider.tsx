import { createContext, useContext, useCallback, useState } from "react";
import { useNavigate, NavigateOptions, To } from "react-router-dom";

interface NavigationContextValue {
  navigateWithTransition: (to: To, options?: NavigateOptions) => void;
  goBack: () => void;
  direction: number;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);

  const navigateWithTransition = useCallback(
    (to: To, options?: NavigateOptions) => {
      setDirection(1);
      navigate(to, options);
    },
    [navigate],
  );

  const goBack = useCallback(() => {
    setDirection(-1);
    navigate(-1);
  }, [navigate]);

  return (
    <NavigationContext.Provider value={{ navigateWithTransition, goBack, direction }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useTransitionNavigate() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useTransitionNavigate must be used within NavigationProvider");
  return ctx;
}
