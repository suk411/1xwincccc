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
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef<HTMLButtonElement>(null);

  // Scroll active tab into view (aligned to the left)
  React.useEffect(() => {
    const container = scrollRef.current;
    const activeEl = activeRef.current;
    if (!container || !activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const offset = activeRect.left - containerRect.left + container.scrollLeft;

    container.scrollTo({ left: Math.max(0, offset - 8), behavior: "smooth" });
  }, [value]);

  return (
    <div
      ref={scrollRef}
      className={cn("scrollbar-hide", className)}
      style={{
        backgroundColor: "#1a0a10",
        overflowX: "scroll",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div style={{ display: "inline-flex", gap: "8px", padding: "0 8px", whiteSpace: "nowrap" }}>
        {tabs.map((tab) => {
          const isActive = tab.value === value;
          return (
            <button
              key={tab.value}
              ref={isActive ? activeRef : undefined}
              onClick={() => onChange(tab.value)}
              style={{ minWidth: 80, padding: "4px 16px", position: "relative", flexShrink: 0 }}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-colors",
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
