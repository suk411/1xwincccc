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
        "flex items-center rounded-lg overflow-hidden",
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
              "relative flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium transition-colors",
              isActive ? "text-white" : "text-muted-foreground"
            )}
          >
            {tab.icon && <span className="w-4 h-4 flex items-center justify-center">{tab.icon}</span>}
            <span>{tab.label}</span>

            {/* Active glow indicator */}
            {isActive && (
              <img
                src={tabGlow}
                alt=""
                className="absolute bottom-0 left-0 w-full h-[3px] object-cover"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

GameTabs.displayName = "GameTabs";

export { GameTabs };
