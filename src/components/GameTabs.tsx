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

  // Scroll active tab to the left side
  React.useEffect(() => {
    const container = scrollRef.current;
    const activeEl = activeRef.current;
    if (!container || !activeEl) return;

    const offset = activeEl.offsetLeft;
    container.scrollTo({ left: Math.max(0, offset - 8), behavior: "smooth" });
  }, [value]);

  return (
    <div
      ref={scrollRef}
      className={cn("scrollbar-hide", className)}
      style={{
        backgroundColor: "#1a0a10",
        overflow: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            {tabs.map((tab) => {
              const isActive = tab.value === value;
              return (
                <td key={tab.value} style={{ padding: 0, border: "none" }}>
                  <button
                    ref={isActive ? activeRef : undefined}
                    onClick={() => onChange(tab.value)}
                    className={cn(
                      "relative flex items-center justify-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                      isActive ? "text-white" : "text-muted-foreground"
                    )}
                    style={{ minWidth: 80, padding: "6px 16px" }}
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
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

GameTabs.displayName = "GameTabs";

export { GameTabs };
