import { useState, useRef } from "react";
import { useTransitionNavigate } from "@/providers/NavigationProvider";

type DateFilter = "today" | "yesterday" | "week" | "month";

const GameStatistics = () => {
  const { goBack } = useTransitionNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="x-page">
      <style>{`
  .x-page {
    --main-color: #f2413b;
    min-height: calc(100vh - 120px);
    color: #fff;
    width: 100%;
  }
  .x-page .navbar {
    display: block;
    position: static;
    width: 100%;
    height: 46px;
    box-sizing: border-box;
    z-index: 100;
    background: none;
  }
  .x-page .navbar-fixed {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: var(--app-max-width);
    height: 46px;
    background: linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    color: #fff;
    z-index: 101;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
  }
  .x-page .navbar__content {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
  .x-page .navbar__content-left {
    position: absolute;
    left: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
  }
  .x-page .navbar__content-center {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .x-page .navbar__content-title {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.2;
    color: #fff;
    text-align: center;
  }
  .x-page .navbar__content-right {
    position: absolute;
    right: 12px;
  }
  .x-page .back-arrow {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
  .scroll-snap-x { scroll-snap-type: x mandatory; }
  .scroll-snap-item { scroll-snap-align: center; }
  .stats-card {
    background: linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    border-radius: 10px;
    padding: 0 10px;
    margin-bottom: 6px;
    border: 1px solid rgba(255,180,50,0.1);
    height: 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .stats-card-label {
    color: rgba(255,255,255,0.9);
    font-size: 16px;
  }
  .stats-amount {
    font-size: 18px;
    font-weight: 600;
    background: linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`}</style>
      <div className="navbar"><div className="navbar-fixed"><div className="navbar__content"><div className="navbar__content-left" onClick={() => goBack()}><svg className="back-arrow" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></div><div className="navbar__content-center"><div className="navbar__content-title">Game Statistics</div></div><div className="navbar__content-right"></div></div></div></div>
      <div className="bet-container-sticky"><div className="van-sticky"><div>
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto px-3 py-2 hide-scrollbar scroll-snap-x" style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}>
          {(["today", "yesterday", "week", "month"] as const).map((key) => {
            const label = key === "today" ? "Today" : key === "yesterday" ? "Yesterday" : key === "week" ? "This Week" : "This Month";
            const isActive = key === dateFilter;
            return (
              <div key={key} onClick={() => setDateFilter(key)} className={`scroll-snap-item shrink-0 px-[14px] py-[7px] rounded-full text-[13px] cursor-pointer transition-all whitespace-nowrap ${isActive ? "text-white" : "text-white/50"}`} style={{ background: isActive ? "rgb(177, 44, 73)" : "rgba(255,255,255,0.08)" }}>
                {label}
              </div>
            );
          })}
        </div>
      </div></div></div>
      <div className="x-page-list" style={{ padding: "10px" }}>
        <div className="stats-card">
          <div className="stats-card-label">Total bet amount</div>
          <div className="stats-amount">₹0.00</div>
        </div>
      </div>
    </div>
  );
};

export default GameStatistics;
