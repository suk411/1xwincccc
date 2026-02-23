import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Earn from "./pages/Earn";
import Bank from "./pages/Bank";
import Events from "./pages/Events";
import Promo from "./pages/Promo";
import CommunityEvent from "./pages/CommunityEvent";
import DepositRecords from "./pages/DepositRecords";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import DownloadBanner from "./components/DownloadBanner";
import bgMain from "@/assets/bg-main.jpg";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div 
      className="min-h-screen flex flex-col bg-background bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgMain})` }}
    >
      {/* Overlay for better readability */}
      <div className="fixed inset-0 bg-background/60 pointer-events-none" />
      
      <DownloadBanner />
      {isHomePage && <Header />}
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/events" element={<Events />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/community-event" element={<CommunityEvent />} />
        <Route path="/bank/records" element={<DepositRecords />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <BottomNav />
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
