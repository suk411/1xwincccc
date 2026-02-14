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

  // Convert vertical mouse wheel into horizontal scroll
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "overflow-x-auto scrollbar-hide bg-[#1a0a10] px-2",
        className
      )}
      style={{
        touchAction: "pan-x",
        WebkitOverflowScrolling: "touch", // smooth flick scrolling on iOS
      }}
    >
      <div className="flex space-x-2">
        {tabs.map((tab) => {
          const isActive = tab.value === value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative flex-shrink-0 items-center justify-center gap-1.5 py-1 px-4 text-sm font-medium transition-colors min-w-[120px]",
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
