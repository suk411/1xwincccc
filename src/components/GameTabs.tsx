import * as React from "react";
import { cn } from "@/lib/utils";
import tabGlow from "@/assets/tab-active-glow.png";

export interface GameTab {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface GameTabsProps {
  tabs: GameTab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const GameTabs: React.FC<GameTabsProps> = ({ tabs, value, onChange, className }) => {
  return (
    <div
      className={cn(
<<<<<<< HEAD
        "flex items-center rounded-[1%] overflow-hidden",
=======
        "flex items-center rounded-lg overflow-x-auto scrollbar-hide",
>>>>>>> 2903fe8d13cc40fd1548aaeca1e9995ad25efb52
        className
      )}
      style={{ backgroundColor: "#1a0a10" }}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-1.5 py-1 px-3 text-sm font-medium transition-colors",
              isActive ? "text-white" : "text-muted-foreground"
            )}
          >
            {/* Glow image behind everything */}
            {isActive && (
              <img
                src={tabGlow}
                alt=""
                className="absolute inset-x-0 bottom-0 w-full h-full object-cover object-bottom z-0 pointer-events-none"
              />
            )}

            {tab.icon && <span className="relative z-10 w-4 h-4 flex items-center justify-center">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

GameTabs.displayName = "GameTabs";

export { GameTabs };
