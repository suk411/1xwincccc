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
        "overflow-x-auto scrollbar-hide",
        className
      )}
      style={{
        backgroundColor: "#1a0a10",
        touchAction: "pan-x",
        WebkitOverflowScrolling: "touch",
        overflowX: "auto",
      }}
    >
      <div className="flex w-max px-2 space-x-2">
        {tabs.map((tab) => {
          const isActive = tab.value === value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative flex-shrink-0 flex items-center justify-center gap-1.5 py-1 px-4 text-sm font-medium transition-colors whitespace-nowrap min-w-[80px]",
                isActive ? "text-white" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <img
                  src={tabGlow}
                  alt=""
                  className="absolute inset-x-0 bottom-0 w-full h-full object-cover object-bottom z-0 pointer-events-none"
                />
              )}

              {tab.icon && (
                <span className="relative z-10 w-4 h-4 flex items-center justify-center">
                  {tab.icon}
                </span>
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

GameTabs.displayName = "GameTabs";

export { GameTabs };
