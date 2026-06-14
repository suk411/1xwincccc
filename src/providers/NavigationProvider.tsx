import { createContext, useContext, useCallback, useState } from "react";
import { useNavigate, useLocation, NavigateOptions, To } from "react-router-dom";

const navOrder = ["/", "/earn", "/bank", "/events", "/promo"];

function getDirection(from: string, to: string): number {
  const fromIdx = navOrder.indexOf(from);
  const toIdx = navOrder.indexOf(to);
  if (fromIdx !== -1 && toIdx !== -1) {
    return toIdx >= fromIdx ? 1 : -1;
  }
  return 1;
}

interface NavigationContextValue {
  navigateWithTransition: (to: To, options?: NavigateOptions) => void;
  goBack: () => void;
  direction: number;
  setDirection: React.Dispatch<React.SetStateAction<number>>;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [direction, setDirection] = useState(1);

  const navigateWithTransition = useCallback(
    (to: To, options?: NavigateOptions) => {
      const targetPath = typeof to === "string" ? to : to.pathname || "";
      const dir = getDirection(location.pathname, targetPath);
      setDirection(dir);
      navigate(to, options);
    },
    [navigate, location.pathname],
  );

  const goBack = useCallback(() => {
    setDirection(-1);
    navigate(-1);
  }, [navigate]);

  return (
    <NavigationContext.Provider value={{ navigateWithTransition, goBack, direction, setDirection }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useTransitionNavigate() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useTransitionNavigate must be used within NavigationProvider");
  return ctx;
}
