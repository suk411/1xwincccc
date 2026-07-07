import { useState, useRef, useEffect } from "react";
import { useTransitionNavigate } from "@/providers/NavigationProvider";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

type DateFilter = "today" | "yesterday" | "week" | "month";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDateRange(filter: DateFilter): { dateFrom: string; dateTo: string } {
  const today = new Date();
  const todayStr = formatDate(today);
  if (filter === "today") return { dateFrom: todayStr, dateTo: todayStr };
  if (filter === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = formatDate(yesterday);
    return { dateFrom: yStr, dateTo: yStr };
  }
  if (filter === "week") {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    return { dateFrom: formatDate(weekAgo), dateTo: todayStr };
  }
  const monthAgo = new Date(today);
  monthAgo.setDate(monthAgo.getDate() - 29);
  return { dateFrom: formatDate(monthAgo), dateTo: todayStr };
}

interface GameStatItem {
  gameTypeName: string;
  betAmount: number;
  betCount: number;
  totalpayout: number;
}

const LABEL_MAP: Record<string, string> = {
  lottery: "Lottery",
  Provider: "Provider",
};

const GameStatistics = () => {
  const { goBack } = useTransitionNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [stats, setStats] = useState<GameStatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { dateFrom, dateTo } = getDateRange(dateFilter);
    setLoading(true);
    authService.getGameStats(dateFrom, dateTo).then((res) => {
      setStats(res.data?.gameStatis ?? []);
    }).catch((e) => {
      setStats([]);
      toast({ description: e?.message || "Failed to load stats", variant: "destructive" });
    }).finally(() => {
      setLoading(false);
    });
  }, [dateFilter]);

  const totalBet = stats.reduce((sum, item) => sum + item.betAmount, 0);

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
    height: 87px;
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
  .TeamReport__C-body-item {
    background: linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    border-radius: 10px;
    padding: 0 10px;
    margin-bottom: 6px;
    border: 1px solid rgba(255,180,50,0.1);
  }
  .TeamReport__C-body-item-head {
    height: 30px;
    padding-top: 3px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 0.8px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.9);
    font-size: 16px;
    gap: 8px;
  }
  .TeamReport__C-body-item-detail {
    padding: 6px 0;
    font-size: 12px;
  }
  .TeamReport__C-body-item-detail > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 15px;
    margin-bottom: 4px;
    color: rgba(255,255,255,0.6);
  }
  .TeamReport__C-body-item-detail > div:last-child {
    margin-bottom: 0;
  }
  .val-orange { color: #feaa57; }
  .val-light { color: rgba(255,255,255,0.4); }
  .val-green { color: #18b660; }
  .val-red { color: #f2413b; }
  .svg-icon { width: 22px; height: 22px; }
  .section-title {
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    padding: 8px 0 4px;
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .slide-in-left {
    animation: slideInLeft 0.4s ease-out both;
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
        <div className="stats-card slide-in-left" style={{ animationDelay: "0s", height: "87px" }}>
          <div className="stats-card-label">Total bet amount</div>
          <div className="stats-amount">₹{totalBet.toFixed(2)}</div>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.5)" }}>Loading...</div>
        ) : stats.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.5)" }}>No data</div>
        ) : (
          stats.map((item, index) => {
            const netPL = item.totalpayout - item.betAmount;
            return (
              <div key={item.gameTypeName} className="TeamReport__C-body-item slide-in-left" style={{ marginBottom: "12px", animationDelay: `${index * 0.1 + 0.1}s` }}>
                <div className="TeamReport__C-body-item-head">
                  {item.gameTypeName === "lottery" ? (
                    <svg className="svg-icon icon-lottery" viewBox="0 0 48 48" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.4705 12.992C17.2079 14.0478 13.802 13.3906 11.2254 11.5176C8.65115 14.157 6.94305 17.5424 6.35131 21.184C9.24189 22.2447 11.6331 24.5757 12.6547 27.7324C13.6762 30.8888 13.1042 34.1786 11.3832 36.7317C14.3198 39.6583 18.2092 41.4967 22.3564 41.8918C23.627 39.7355 25.661 38.0177 28.2295 37.1865C30.8181 36.3488 33.4945 36.5589 35.7997 37.5825C38.9641 34.833 41.0645 31.0476 41.7397 26.9331C39.0138 25.7686 36.7873 23.4755 35.8028 20.4338C34.7996 17.3337 35.2977 14.1078 36.8953 11.5428C34.2573 8.83606 30.8169 7.02579 27.0991 6.38029C26.1085 9.40788 23.7332 11.9361 20.4705 12.992ZM28.0728 35.9093C33.8105 34.0525 36.9566 27.8958 35.0998 22.158C33.243 16.4202 27.0863 13.2741 21.3485 15.131C15.6107 16.9879 12.4646 23.1445 14.3215 28.8823C16.1784 34.62 22.335 37.7661 28.0728 35.9093Z" fill="currentColor"/><path d="M27.0008 29.6018C26.7496 29.841 26.425 30.0249 26.0271 30.1538C25.6331 30.2812 25.2622 30.3223 24.9146 30.2768C24.5659 30.2276 24.2672 30.1024 24.0184 29.9012C23.7686 29.6961 23.5893 29.4254 23.4805 29.0894C23.3692 28.7456 23.3561 28.4148 23.441 28.0971C23.5286 27.7743 23.6987 27.4887 23.9513 27.2406C24.2026 26.9885 24.5195 26.8006 24.9019 26.6768C25.2882 26.5518 25.6551 26.5184 26.0026 26.5767C26.3488 26.6311 26.652 26.7635 26.9122 26.9737C27.171 27.1801 27.3561 27.4554 27.4674 27.7992C27.5761 28.1352 27.5874 28.4602 27.5012 28.774C27.4176 29.0828 27.2508 29.3587 27.0008 29.6018Z" fill="currentColor"/><path d="M25.1322 24.3616C24.9171 24.5807 24.6434 24.7439 24.3113 24.8514C23.979 24.959 23.6616 24.987 23.359 24.9356C23.0564 24.8841 22.7929 24.7623 22.5686 24.5703C22.3443 24.3784 22.1815 24.1259 22.0802 23.8129C21.9802 23.4999 21.9493 23.1596 21.9876 22.7919C22.0272 22.433 22.1362 22.1016 22.3146 21.7976C22.493 21.4937 22.7223 21.2573 23.0024 21.0885L23.0093 21.0843L23.064 21.0446C23.3378 20.8202 23.6653 20.6538 24.0468 20.5454C24.4271 20.4335 24.792 20.4042 25.1416 20.4575C25.4912 20.5109 25.7974 20.6447 26.0603 20.8592C26.3221 21.0701 26.5105 21.3476 26.6257 21.6918C26.7396 22.032 26.7467 22.3659 26.6469 22.6933C26.5484 23.0245 26.3745 23.3077 26.1252 23.5427C25.8746 23.7739 25.5881 23.9282 25.2657 24.0057C24.9433 24.0831 24.6073 24.0789 24.2577 23.993C23.8943 23.9038 23.5788 23.7525 23.3113 23.5392L23.5428 24.5776C23.7132 25.0929 24.0611 25.4989 24.5864 25.7958C25.1117 26.0926 25.7026 26.222 26.3592 26.1839C27.0195 26.1448 27.6151 25.9591 28.146 25.6267C28.6769 25.2944 29.1187 24.8449 29.4717 24.278C29.8247 23.7112 30.0616 23.0789 30.1825 22.3812C30.3034 21.6835 30.2964 21.0021 30.1614 20.337C30.0251 19.6681 29.7748 19.0531 29.4104 18.4921C29.046 17.9311 28.5903 17.4791 28.0434 17.136L28.0348 17.1304L27.9797 17.0925C27.5632 16.7928 27.1025 16.5781 26.5977 16.4484C26.0929 16.3186 25.5683 16.2797 25.0237 16.3316C24.4791 16.3834 23.9621 16.5232 23.4726 16.751C22.9844 16.9751 22.5552 17.2741 22.1849 17.6479C21.8147 18.0217 21.5157 18.461 21.288 18.9658C21.0603 19.4706 20.9203 20.006 20.868 20.5721C20.817 21.1232 20.8469 21.656 20.9576 22.1705C21.0683 22.685 21.256 23.1551 21.5208 23.5809C21.7857 24.0066 22.1303 24.3804 22.5546 24.7022L22.5645 24.7095C22.88 24.9479 23.2225 25.1212 23.592 25.2293L23.3656 24.2102C23.1937 23.6825 22.8494 23.2887 22.3325 23.0289C21.8093 22.7658 21.2436 22.6512 20.6354 22.685C20.0271 22.7187 19.4631 22.8849 18.9431 23.1836C18.4232 23.4822 17.9797 23.9126 17.6128 24.4747C17.2459 25.0368 16.9878 25.6723 16.8385 26.3812C16.6891 27.0902 16.6804 27.7905 16.8125 28.4821C16.9446 29.1737 17.1978 29.8124 17.5721 30.3981C17.9464 30.9839 18.4136 31.4639 18.9739 31.8382L18.9808 31.8429L19.03 31.8781C19.4534 32.189 19.9181 32.4073 20.424 32.5329C20.9312 32.6588 21.4457 32.6969 21.9675 32.6472C22.4906 32.5974 22.9868 32.4571 23.4561 32.2262C23.9268 31.9916 24.3582 31.6955 24.7505 31.3378C25.144 30.9798 25.4788 30.5754 25.7549 30.1245C26.031 29.6737 26.2311 29.1863 26.3552 28.6623C26.4792 28.1384 26.505 27.5913 26.4325 27.0209C26.3601 26.4506 26.1799 25.8921 25.8921 25.3455C25.6137 24.8172 25.2587 24.3533 24.8272 23.9539L25.1322 24.3616Z" fill="currentColor"/></svg>
                  ) : (
                    <svg className="svg-icon icon-video" viewBox="0 0 48 48" fill="currentColor"><path d="M16.6044 8.59427C16.3396 8.03582 16.5807 7.36986 17.1427 7.10682C17.7048 6.84378 18.3751 7.08325 18.6399 7.6417L21.6149 13.9168C21.8796 14.4752 21.6386 15.1412 21.0765 15.4042C20.5144 15.6673 19.8441 15.4278 19.5794 14.8693L16.6044 8.59427Z"/><path d="M30.9957 8.59427C31.2605 8.03582 31.0194 7.36986 30.4573 7.10682C29.8953 6.84378 29.225 7.08325 28.9602 7.6417L25.9605 13.9689C25.6958 14.5274 25.9368 15.1933 26.4989 15.4564C27.061 15.7194 27.7313 15.4799 27.996 14.9215L30.9957 8.59427Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.625 13.8957C8.5184 13.8957 6 16.3978 6 19.4843V36.2501C6 39.3366 8.5184 41.8387 11.625 41.8387H36.375C39.4816 41.8387 42 39.3366 42 36.2501V19.4843C42 16.3978 39.4816 13.8957 36.375 13.8957H11.625ZM14.4375 16.1312C11.3309 16.1312 8.8125 18.6333 8.8125 21.7198V34.0147C8.8125 37.1012 11.3309 39.6033 14.4375 39.6033H33.5625C36.6691 39.6033 39.1875 37.1012 39.1875 34.0147V21.7198C39.1875 18.6333 36.6691 16.1312 33.5625 16.1312H14.4375Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.8065 17.8086C13.5996 17.8086 11 20.4082 11 23.615V32.1211C11 35.3279 13.5996 37.9275 16.8065 37.9275H31.0685C34.2754 37.9275 36.875 35.3279 36.875 32.1211V23.615C36.875 20.4082 34.2754 17.8086 31.0685 17.8086H16.8065ZM27.3776 29.5791C28.8784 28.6765 28.8784 26.5008 27.3776 25.5982L23.5195 23.2782C21.9715 22.3473 20 23.4623 20 25.2686L20 29.9087C20 31.715 21.9715 32.83 23.5195 31.8991L27.3776 29.5791Z"/></svg>
                  )}
                  <span>{LABEL_MAP[item.gameTypeName] ?? item.gameTypeName}</span>
                </div>
                <div className="TeamReport__C-body-item-detail">
                  <div>Total Bet <span className="val-light">₹{item.betAmount.toFixed(2)}</span></div>
                  <div>Number of Bets <span className="val-light">{item.betCount}</span></div>
                  <div>Total Payout <span className="val-light">₹{item.totalpayout.toFixed(2)}</span></div>
                  <div>Net Profit/Loss <span className={netPL >= 0 ? "val-green" : "val-red"}>{netPL >= 0 ? "+" : ""}₹{netPL.toFixed(2)}</span></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameStatistics;
