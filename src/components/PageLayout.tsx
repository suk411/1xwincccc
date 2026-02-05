import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import bgMain from "@/assets/bg-main.jpg";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <div 
      className="min-h-screen min-h-dvh flex flex-col bg-background bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgMain})` }}
    >
      {/* Overlay for better readability */}
      <div className="fixed inset-0 bg-background/60 pointer-events-none" />
      
      {/* Main content */}
      <main className="relative flex-1 flex flex-col pb-20 px-4 pt-4 max-w-screen-lg mx-auto w-full">
        {title && (
          <h1 className="text-2xl font-bold text-foreground mb-4 text-glow">
            {title}
          </h1>
        )}
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PageLayout;
