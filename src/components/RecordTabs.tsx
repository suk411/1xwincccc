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
      }}
    >
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          <tr>
            {RECORD_TABS.map((tab) => {
              const isActive = tab.value === activeTab;
              return (
                <td key={tab.value} style={{ padding: 0, border: "none", width: "33.33%" }}>
                  <button
                    onClick={() => navigate(tab.path)}
                    className={cn(
                      "relative flex items-center justify-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap w-full",
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

export default RecordTabs;
