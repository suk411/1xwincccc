import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import tabGlow from "@/assets/tab-active-glow.png";

interface RecordTab {
  label: string;
  value: string;
  path: string;
}

const RECORD_TABS: RecordTab[] = [
  { label: "Deposit", value: "deposit", path: "/bank/records" },
  { label: "Withdrawal", value: "withdrawal", path: "/bank/withdrawals" },
  { label: "Bet", value: "bet", path: "/bet-records" },
];

const RecordTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = RECORD_TABS.find((tab) => tab.path === location.pathname)?.value || "deposit";

  return (
    <div
      className="scrollbar-hide w-full sticky top-11 z-40"
      style={{
        backgroundColor: "#1a0a10",
        overflow: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <div className="flex w-full">
        {RECORD_TABS.map((tab) => {
          const isActive = tab.value === activeTab;
          return (
            <button
              key={tab.value}
              onClick={() => navigate(tab.path)}
              className={cn(
                "relative flex-1 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap py-3",
                isActive ? "text-white" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <img
                  src={tabGlow}
                  alt=""
                  className="absolute inset-x-0 bottom-0 w-full h-full object-cover object-bottom z-0 pointer-events-none opacity-50"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 z-20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecordTabs;
