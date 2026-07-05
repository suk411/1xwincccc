import { useState, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import Index from "./pages/Index";
import Earn from "./pages/Earn";
import Bank from "./pages/Bank";
import Events from "./pages/Events";
import Promo from "./pages/Promo";
import CommunityEvent from "./pages/CommunityEvent";
import DepositRecords from "./pages/DepositRecords";
import WithdrawalRecords from "./pages/WithdrawalRecords";
import PaymentGateway from "./pages/PaymentGateway";
import GamePlay from "./pages/GamePlay";
import BetRecords from "./pages/BetRecords";
import Vip from "./pages/Vip";
import GameLobbyPage from "./pages/GameLobbyPage";
import SupportChat from "./pages/SupportChat";
import GameStatistics from "./pages/GameStatistics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import DownloadBanner from "./components/DownloadBanner";
import { VersionCheck } from "./components/VersionCheck";
import PosterModal from "./components/PosterModal";
import WinGo from "./components/games/WinGo";
import { NavigationProvider } from "./providers/NavigationProvider";
import bgMain from "@/assets/bg-main.jpg";
import btnClickSound from "@/assets/btn-click.mp3";
import { authService } from "./services/authService";
import { toast } from "@/hooks/use-toast";
import { API_ERROR_EVENT } from "./services/authService";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("auth_token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isHomePage = location.pathname === "/";
  const showBottomNav = ["/", "/earn", "/bank", "/promo", "/events"].includes(location.pathname);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(btnClickSound);
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (location.pathname === "/wingo") return;
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role=\"button\"], .cursor-pointer")) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [location.pathname]);

  useEffect(() => {
    const isLoggedIn = authService.isLoggedIn();
    if (isLoggedIn && !isAuthPage) {
      const lastShowTime = localStorage.getItem("last_poster_show_time");
      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;

      if (!lastShowTime || (now - parseInt(lastShowTime)) > ONE_HOUR) {
        // Show poster if never shown before or last shown more than 1h ago
        setIsPosterOpen(true);
        localStorage.setItem("last_poster_show_time", now.toString());
      }
    }
  }, [location.pathname, isAuthPage]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent).detail;
      toast({ description: message, variant: "destructive" });
    };
    window.addEventListener(API_ERROR_EVENT, handler);
    return () => window.removeEventListener(API_ERROR_EVENT, handler);
  }, []);

  return (
    <div className="mobile-app-shell">
      <VersionCheck />
      <PosterModal isOpen={isPosterOpen} onClose={() => setIsPosterOpen(false)} />
      <div className="mobile-app-scroll flex flex-col">
        {isHomePage && <DownloadBanner />}
        {isHomePage && <Header />}
        
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
            <Route path="/" element={<PageTransition><ProtectedRoute><Index /></ProtectedRoute></PageTransition>} />
            <Route path="/earn" element={<PageTransition><ProtectedRoute><Earn /></ProtectedRoute></PageTransition>} />
            <Route path="/bank" element={<PageTransition><ProtectedRoute><Bank /></ProtectedRoute></PageTransition>} />
            <Route path="/events" element={<PageTransition><ProtectedRoute><Events /></ProtectedRoute></PageTransition>} />
            <Route path="/promo" element={<PageTransition><ProtectedRoute><Promo /></ProtectedRoute></PageTransition>} />
            <Route path="/community-event" element={<PageTransition><ProtectedRoute><CommunityEvent /></ProtectedRoute></PageTransition>} />
            <Route path="/bank/records" element={<PageTransition><ProtectedRoute><DepositRecords /></ProtectedRoute></PageTransition>} />
            <Route path="/bank/withdrawals" element={<PageTransition><ProtectedRoute><WithdrawalRecords /></ProtectedRoute></PageTransition>} />
            <Route path="/payment" element={<PageTransition><ProtectedRoute><PaymentGateway /></ProtectedRoute></PageTransition>} />
            <Route path="/game" element={<PageTransition><ProtectedRoute><GamePlay /></ProtectedRoute></PageTransition>} />
            <Route path="/wingo" element={<PageTransition><ProtectedRoute><WinGo /></ProtectedRoute></PageTransition>} />
            <Route path="/bet-records" element={<PageTransition><ProtectedRoute><BetRecords /></ProtectedRoute></PageTransition>} />
            <Route path="/vip" element={<PageTransition><ProtectedRoute><Vip /></ProtectedRoute></PageTransition>} />
            <Route path="/lobby" element={<PageTransition><ProtectedRoute><GameLobbyPage /></ProtectedRoute></PageTransition>} />
            <Route path="/support" element={<PageTransition><ProtectedRoute><SupportChat /></ProtectedRoute></PageTransition>} />
            <Route path="/game-statistics" element={<PageTransition><ProtectedRoute><GameStatistics /></ProtectedRoute></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
      
      {showBottomNav && !isAuthPage && <BottomNav />}
    </div>
  );
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
