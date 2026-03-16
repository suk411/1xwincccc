import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import DownloadBanner from "./components/DownloadBanner";
import bgMain from "@/assets/bg-main.jpg";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("auth_token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isHomePage = location.pathname === "/";
  const showBottomNav = ["/", "/earn", "/bank", "/promo", "/events"].includes(location.pathname);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #320913 43%, #41131e 100%)", minHeight: "100vh" }}
    >
      
      {isHomePage && <DownloadBanner />}
      {isHomePage && <Header />}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/earn" element={<ProtectedRoute><Earn /></ProtectedRoute>} />
        <Route path="/bank" element={<ProtectedRoute><Bank /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/promo" element={<ProtectedRoute><Promo /></ProtectedRoute>} />
        <Route path="/community-event" element={<ProtectedRoute><CommunityEvent /></ProtectedRoute>} />
        <Route path="/bank/records" element={<ProtectedRoute><DepositRecords /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentGateway /></ProtectedRoute>} />
        <Route path="/game" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
        <Route path="/bet-records" element={<ProtectedRoute><BetRecords /></ProtectedRoute>} />
        <Route path="/vip" element={<ProtectedRoute><Vip /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {showBottomNav && !isAuthPage && <BottomNav />}
    </div>
  );
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
