import * as React from "react";
import { cn } from "@/lib/utils";

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
      className={cn("scrollbar-hide", className)}
      style={{
        display: "flex",
        width: "100%",
        height: 60,
        background: "transparent",
        alignItems: "center",
        padding: "0 10px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <div
            key={tab.value}
            style={{
              display: "block",
              width: 100,
              height: 50,
              boxSizing: "border-box",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => onChange(tab.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: 95,
                height: 50,
                margin: "0 2.5px",
                cursor: "pointer",
                background: isActive
                  ? "linear-gradient(90deg, rgb(206, 2, 4) 0%, rgb(242, 64, 58) 100%)"
                  : "#1a0a10",
                boxShadow: isActive
                  ? "none"
                  : "0 6px 16px rgba(0,0,0,0.4), 2px 0 6px rgba(0,0,0,0.25), -2px 0 6px rgba(0,0,0,0.25)",
                borderRadius: 8,
                border: "none",
                color: "#fff",
                padding: 0,
              }}
              className={cn(
                isActive ? "text-white" : "text-white/70"
              )}
            >
              {tab.icon && (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 25, height: 25, marginBottom: 2 }}>
                  {tab.icon}
                </span>
              )}
              <span
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: "normal",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                }}
              >
                {tab.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

GameTabs.displayName = "GameTabs";

export { GameTabs };
