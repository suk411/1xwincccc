import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Earn from "./pages/Earn";
import Bank from "./pages/Bank";
import Events from "./pages/Events";
import Promo from "./pages/Promo";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import DownloadBanner from "./components/DownloadBanner";
import bgMain from "@/assets/bg-main.jpg";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div 
          className="min-h-screen min-h-dvh flex flex-col bg-background bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${bgMain})` }}
        >
          {/* Overlay for better readability */}
          <div className="fixed inset-0 bg-background/60 pointer-events-none" />
          
          <DownloadBanner />
          <Header />
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/bank" element={<Bank />} />
            <Route path="/events" element={<Events />} />
            <Route path="/promo" element={<Promo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
