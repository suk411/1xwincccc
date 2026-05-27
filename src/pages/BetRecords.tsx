import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import { GAME_LIST } from "@/services/gameService";
import { GameButton } from "@/components/GameButton";
import { wingoService, WingoUserBetItem } from "@/services/wingoService";
import noDataImg from "@/assets/wingo/nodata.png";

const API_BASE = "https://backend-ledger-0ra6.onrender.com";
const CACHE_KEY = "bet_records_cache";

const loadCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const saveCache = (data: { items: BetItem[]; total: number; page: number }) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
};

interface BetItem {
  _id: string;
  site?: string;
  gameId: string;
  betTime: string;
  bet: number;
  payout?: number;
}

const getGameCategory = (gameId: string): string => {
  if (String(gameId) === "wingo") return "lottery";
  const gameObj = GAME_LIST.find(g => String(g.game_id) === String(gameId));
  return gameObj?.category || "other";
};

const gameTabs = ["Lottery", "Casino"];

const StatusDot = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9.4" fill="white" stroke="#ffb753" strokeWidth="1.2" />
    <circle cx="10" cy="10" r="5" fill="#ffb753" />
  </svg>
);

const BetRecords = () => {
  const cached = loadCache();
  const [items, setItems] = useState<BetItem[]>(cached?.items || []);
  const [loading, setLoading] = useState(!cached);
  const [page, setPage] = useState(cached?.page || 1);
  const [total, setTotal] = useState(cached?.total || 0);
  const [gameTab, setGameTab] = useState(0);
  const limit = 25;

  const [wingoItems, setWingoItems] = useState<WingoUserBetItem[]>([]);
  const [wingoTotal, setWingoTotal] = useState(0);
  const [wingoPage, setWingoPage] = useState(1);
  const [wingoLoading, setWingoLoading] = useState(false);
  const wingoLimit = 25;

  const fetchWingoBets = async (p: number) => {
    setWingoLoading(true);
    try {
      const res = await wingoService.getMyBets({ page: p, limit: wingoLimit });
      setWingoItems(res.items || []);
      setWingoTotal(res.total || 0);
    } catch {
      // silent
    }
    setWingoLoading(false);
  };

  const fetchBets = async (p: number) => {
    if (items.length === 0) setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/game/bets?page=${p}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (data.status === "success") {
        const newItems = data.items || [];
        const newTotal = data.total || 0;
        setItems(newItems);
        setTotal(newTotal);
        saveCache({ items: newItems, total: newTotal, page: p });
      }
    } catch {
      // silent
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBets(page);
  }, [page]);

  useEffect(() => {
    if (gameTab === 0) {
      fetchWingoBets(wingoPage);
    }
  }, [gameTab, wingoPage]);

  const filteredItems = items.filter(item => {
    const cat = getGameCategory(item.gameId);
    if (gameTab === 0) return cat === "lottery" && String(item.gameId) !== "wingo";
    if (gameTab === 1) return cat === "casino";
    return true;
  });

  const renderWingoCard = (item: WingoUserBetItem) => {
    const isWin = item.status === "won";
    const isPending = item.status === "pending";
    const isLoss = item.status === "lost";
    const date = new Date(item.timestamp);
    const dateStr = `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;

    const statusText = isWin ? "Win" : isLoss ? "Lose" : "Pending";
    const statusColor = isWin ? "#22c55e" : isLoss ? "#3b82f6" : "#fbbf24";

    return (
      <div
        key={item.orderNumber}
        className="rounded-xl px-4 py-3 shadow-lg relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)", border: "1px solid rgba(255,180,50,0.25)" }}
      >
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div className="flex flex-col">
            <span className="text-white text-base font-bold">Win Go</span>
            <span className="text-white/50 text-xs mt-0.5">{dateStr}</span>
          </div>
          <span
            className="text-sm px-3 py-0.5 rounded-md border"
            style={{ color: statusColor, borderColor: statusColor }}
          >
            {statusText}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusDot />
              <span className="text-white/70 text-sm">Type</span>
            </div>
            <span className="text-white text-sm">Win Go 30s</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusDot />
              <span className="text-white/70 text-sm">Period</span>
            </div>
            <span className="text-white text-sm">{item.issueNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusDot />
              <span className="text-white/70 text-sm">Order number</span>
            </div>
            <span className="text-white text-sm text-right max-w-[180px] truncate">{item.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusDot />
              <span className="text-white/70 text-sm">Select</span>
            </div>
            <span className="text-white text-sm capitalize">{item.selectType}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusDot />
              <span className="text-white/70 text-sm">Total bet</span>
            </div>
            <span className="text-white text-sm">₹{item.betamount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultCard = (item: BetItem) => {
    const profit = (item.payout ?? 0) - item.bet;
    const hasPayout = item.payout !== undefined;
    const isWin = hasPayout && profit > 0;
    const isLoss = hasPayout && profit < 0;
    const date = new Date(item.betTime);
    const dateStr = `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;

    const gameObj = GAME_LIST.find(g => String(g.game_id) === String(item.gameId));
    const gameName = gameObj ? gameObj.name : `Game ${item.gameId}`;
    const gameLogo = gameObj ? gameObj.logo : "";

    return (
      <div
        key={item._id}
        className="rounded-xl px-4 py-3 shadow-lg relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)", border: "1px solid rgba(255,180,50,0.25)" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-white text-base">{gameName}</span>
            {hasPayout && (
              <div className="flex items-center gap-1">
                <span className="text-white/60 text-sm font-medium">Payout:</span>
                <span className={`font-bold text-sm ${isWin ? "text-green-500" : isLoss ? "text-red-500" : "text-gray-300"}`}>
                  {profit > 0 ? "+" : ""}{profit.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          {gameLogo && (
            <img
              src={gameLogo}
              alt={gameName}
              className="w-12 h-12 object-cover rounded-lg shadow-md border border-white/10"
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
          <div className="flex flex-col">
             <div className="flex items-center gap-1">
               <span className="text-white/60 text-sm font-medium">Bet:</span>
               <span className="text-green-500 font-bold text-sm">{item.bet.toFixed(2)}</span>
             </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-white text-xs">{dateStr}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col pb-32" style={{ background: "linear-gradient(180deg, #320913 43%, #41131e 100%)" }}>
      <div className="sticky top-0 z-50">
        <PageHeader title="Game Records" backPath="/" />
      </div>
      <style>{`
        .br-fun-tabs__tab-list {
          display: flex;
          width: 100%;
          height: 60px;
          background: transparent;
          align-items: center;
          padding: 0 10px;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .br-fun-tabs__tab-list::-webkit-scrollbar { display: none; }
        .br-fun-tab-item__label {
          display: block;
          width: 100.05px;
          height: 50.025px;
          box-sizing: border-box;
          text-align: center;
          flex-shrink: 0;
        }
        .br-fun-tab-item__label .tab_item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 95.05px;
          height: 50.025px;
          margin: 0 2.5px;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.2s;
          background: rgba(0,0,0,0.5);
          box-shadow: 0 6px 16px rgba(0,0,0,0.4), 2px 0 6px rgba(0,0,0,0.25), -2px 0 6px rgba(0,0,0,0.25);
          border-radius: 8px;
        }
        .br-fun-tab-item__label .tab_item.tab_active {
          opacity: 1;
          background-image: linear-gradient(90deg, rgb(206, 2, 4) 0%, rgb(242, 64, 58) 100%);
          color: rgb(255, 255, 255);
          border-radius: 8px;
          white-space: nowrap;
        }
        .br-fun-tab-item__label .tab_item svg {
          display: block;
          width: 25px;
          height: 25px;
          fill: currentColor;
          margin-bottom: 2px;
        }
        .br-fun-tab-item__label .tab_item span {
          display: block;
          font-size: 12px;
          font-weight: 400;
          line-height: normal;
          color: rgba(255,255,255,0.7);
        }
        .br-fun-tab-item__label .tab_item.tab_active span {
          color: #fff;
        }
      `}</style>

      <div className="fun-tabs tabs">
        <div className="br-fun-tabs__tab-list">
          {gameTabs.map((tab, i) => (
            <div key={tab} className="fun-tab-item funtab_item">
              <div className="fun-tab-item__wrap">
                <div className="br-fun-tab-item__label">
                  <div className={`tab_item${i === gameTab ? " tab_active" : ""}`} onClick={() => { setGameTab(i); setPage(1); }}>
                    {tab === "Lottery" && <svg className="svg-icon icon-lottery" viewBox="0 0 48 48" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.4705 12.992C17.2079 14.0478 13.802 13.3906 11.2254 11.5176C8.65115 14.157 6.94305 17.5424 6.35131 21.184C9.24189 22.2447 11.6331 24.5757 12.6547 27.7324C13.6762 30.8888 13.1042 34.1786 11.3832 36.7317C14.3198 39.6583 18.2092 41.4967 22.3564 41.8918C23.627 39.7355 25.661 38.0177 28.2295 37.1865C30.8181 36.3488 33.4945 36.5589 35.7997 37.5825C38.9641 34.833 41.0645 31.0476 41.7397 26.9331C39.0138 25.7686 36.7873 23.4755 35.8028 20.4338C34.7996 17.3337 35.2977 14.1078 36.8953 11.5428C34.2573 8.83606 30.8169 7.02579 27.0991 6.38029C26.1085 9.40788 23.7332 11.9361 20.4705 12.992ZM28.0728 35.9093C33.8105 34.0525 36.9566 27.8958 35.0998 22.158C33.243 16.4202 27.0863 13.2741 21.3485 15.131C15.6107 16.9879 12.4646 23.1445 14.3215 28.8823C16.1784 34.62 22.335 37.7661 28.0728 35.9093Z" fill="currentColor"/><path d="M27.0008 29.6018C26.7496 29.841 26.425 30.0249 26.0271 30.1538C25.6331 30.2812 25.2622 30.3223 24.9146 30.2768C24.5659 30.2276 24.2672 30.1024 24.0184 29.9012C23.7686 29.6961 23.5893 29.4254 23.4805 29.0894C23.3692 28.7456 23.3561 28.4148 23.441 28.0971C23.5286 27.7743 23.6987 27.4887 23.9513 27.2406C24.2026 26.9885 24.5195 26.8006 24.9019 26.6768C25.2882 26.5518 25.6551 26.5184 26.0026 26.5767C26.3488 26.6311 26.652 26.7635 26.9122 26.9737C27.171 27.1801 27.3561 27.4554 27.4674 27.7992C27.5761 28.1352 27.5874 28.4602 27.5012 28.774C27.4176 29.0828 27.2508 29.3587 27.0008 29.6018Z" fill="currentColor"/><path d="M25.1322 24.3616C24.9171 24.5807 24.6434 24.7439 24.3113 24.8514C23.979 24.959 23.6616 24.987 23.359 24.9356C23.0564 24.8841 22.7929 24.7623 22.5686 24.5703C22.3443 24.3784 22.1815 24.1259 22.0802 23.8129C21.9802 23.4999 21.9493 23.1596 21.9876 22.7919C22.0272 22.433 22.1362 22.1016 22.3146 21.7976C22.493 21.4937 22.7223 21.2573 23.0024 21.0885L23.0093 21.0843L23.064 21.0446C23.3378 20.8288 23.6419 20.6893 23.9765 20.6261C24.3137 20.5624 24.6493 20.5876 24.9831 20.7015C25.3168 20.8155 25.5898 20.9907 25.8023 21.2274C26.016 21.465 26.1719 21.7408 26.2701 22.0546C26.3701 22.3676 26.3951 22.7002 26.3454 23.0524C26.2957 23.4046 26.1834 23.7275 26.0085 24.0213C25.8343 24.3151 25.6219 24.539 25.3715 24.6934C25.1214 24.8479 24.8421 24.9356 24.5337 24.9568C24.2252 24.978 23.9002 24.9219 23.5586 24.7889C23.2183 24.6597 22.9235 24.4712 22.6741 24.2234L22.669 24.2182L22.6118 24.1581C22.4237 23.9517 22.2898 23.7005 22.2102 23.4045C22.1325 23.1017 22.1253 22.7886 22.1886 22.4652C22.2521 22.1418 22.3738 21.8399 22.5538 21.5595C22.7337 21.279 22.9599 21.0556 23.2323 20.8889L23.2391 20.8847L23.2931 20.8529C23.5655 20.686 23.8748 20.5835 24.2211 20.5453C24.5686 20.507 24.925 20.5445 25.2904 20.6577C25.6559 20.7709 25.9529 20.9371 26.1815 21.1564C26.4101 21.3757 26.5679 21.6195 26.6552 21.8876C26.7425 22.1558 26.7575 22.4165 26.7001 22.6696C26.6429 22.9228 26.5161 23.1453 26.3197 23.3372C26.1232 23.5292 25.8786 23.6491 25.5859 23.6972C25.2933 23.7452 24.9797 23.7113 24.645 23.5954C24.3103 23.4795 24.0373 23.3038 23.8259 23.0684C23.6145 22.833 23.4574 22.558 23.3548 22.2432C23.2523 21.9284 23.2309 21.5962 23.2908 21.2465C23.3506 20.8969 23.4672 20.5749 23.6406 20.2804C23.814 19.9859 24.0258 19.761 24.276 19.6058C24.5261 19.4505 24.8051 19.362 25.113 19.3402C25.4209 19.3184 25.7467 19.3736 26.0903 19.5059C26.4339 19.6381 26.7301 19.8271 26.9794 20.0733C27.2286 20.3194 27.3638 20.5705 27.3851 20.8265L27.3857 20.8332L27.3888 20.8894C27.4187 21.235 27.3797 21.5631 27.272 21.8738C27.1657 22.1845 27.0062 22.4618 26.7936 22.7056C26.581 22.9495 26.3267 23.1348 26.0308 23.2617C25.7361 23.3882 25.4178 23.4475 25.0757 23.4396C24.7336 23.4318 24.3881 23.3404 24.0394 23.1656C23.6907 22.9908 23.3866 22.7499 23.1269 22.443C22.8672 22.136 22.6909 21.7961 22.5981 21.4233C22.5078 21.0586 22.5124 20.6797 22.612 20.2867C22.7116 19.8936 22.8824 19.5438 23.1244 19.2372L23.1306 19.2297L23.1796 19.1704C23.4327 18.8726 23.7433 18.6492 24.1116 18.5C24.4772 18.3516 24.861 18.2881 25.263 18.3095C25.6651 18.3309 26.031 18.4385 26.3609 18.6322C26.6907 18.826 26.9538 19.0788 27.1501 19.3907C27.3465 19.7025 27.4573 20.0417 27.4828 20.4082C27.5082 20.7747 27.4528 21.1311 27.3163 21.4773C27.1799 21.8236 26.9755 22.1305 26.7032 22.3982C26.431 22.666 26.1088 22.8614 25.7366 22.9844" fill="currentColor"/></svg>}
                    {tab === "Casino" && <svg className="svg-icon icon-video" viewBox="0 0 48 48" fill="currentColor"><path d="M16.6044 8.59427C16.3396 8.03582 16.5807 7.36986 17.1427 7.10682C17.7048 6.84378 18.3751 7.08325 18.6399 7.6417L21.6149 13.9168C21.8796 14.4752 21.6386 15.1412 21.0765 15.4042C20.5144 15.6673 19.8441 15.4278 19.5794 14.8693L16.6044 8.59427Z"/><path d="M30.9957 8.59427C31.2605 8.03582 31.0194 7.36986 30.4573 7.10682C29.8953 6.84378 29.225 7.08325 28.9602 7.6417L25.9605 13.9689C25.6958 14.5274 25.9368 15.1933 26.4989 15.4564C27.061 15.7194 27.7313 15.4799 27.996 14.9215L30.9957 8.59427Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.625 13.8957C8.5184 13.8957 6 16.3978 6 19.4843V36.2501C6 39.3366 8.5184 41.8387 11.625 41.8387H36.375C39.4816 41.8387 42 39.3366 42 36.2501V19.4843C42 16.3978 39.4816 13.8957 36.375 13.8957H11.625ZM14.4375 16.1312C11.3309 16.1312 8.8125 18.6333 8.8125 21.7198V34.0147C8.8125 37.1012 11.3309 39.6033 14.4375 39.6033H33.5625C36.6691 39.6033 39.1875 37.1012 39.1875 34.0147V21.7198C39.1875 18.6333 36.6691 16.1312 33.5625 16.1312H14.4375Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.8065 17.8086C13.5996 17.8086 11 20.4082 11 23.615V32.1211C11 35.3279 13.5996 37.9275 16.8065 37.9275H31.0685C34.2754 37.9275 36.875 35.3279 36.875 32.1211V23.615C36.875 20.4082 34.2754 17.8086 31.0685 17.8086H16.8065ZM27.3776 29.5791C28.8784 28.6765 28.8784 26.5008 27.3776 25.5982L23.5195 23.2782C21.9715 22.3473 20 23.4623 20 25.2686L20 29.9087C20 31.715 21.9715 32.83 23.5195 31.8991L27.3776 29.5791Z"/></svg>}
                    <span>{tab}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 mt-2">
        {(loading || wingoLoading) && items.length === 0 && wingoItems.length === 0 ? (
          <Loader label="Loading records..." />
        ) : filteredItems.length === 0 && wingoItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <img src={noDataImg} alt="No data" className="w-[150px] h-[139px] object-contain block mb-3" />
            <p style={{ color: "#acafc2", fontSize: "13px", margin: 0 }}>No data</p>
          </div>
        ) : (gameTab === 0 ? (
          <>
            {wingoItems.length > 0 && (
              <div className="space-y-3 mb-6">
                {wingoItems.map(renderWingoCard)}
              </div>
            )}
            {!wingoLoading && wingoTotal > wingoLimit && (
              <div className="flex items-center justify-center gap-3 py-3 mb-4">
                <GameButton
                  variant="mute"
                  size="sm"
                  disabled={wingoPage <= 1}
                  onClick={() => {
                    setWingoPage((p) => p - 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  Previous
                </GameButton>
                <span className="text-white/60 text-xs font-medium">Page {wingoPage}</span>
                <GameButton
                  variant="mute"
                  size="sm"
                  disabled={wingoPage >= Math.ceil(wingoTotal / wingoLimit)}
                  onClick={() => {
                    setWingoPage((p) => p + 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  Next
                </GameButton>
              </div>
            )}
            {filteredItems.length > 0 && (
              <div className="space-y-3">
                {filteredItems.map(renderDefaultCard)}
              </div>
            )}
            {!loading && total > limit && (
              <div className="flex items-center justify-center gap-3 py-6 mt-4">
                <GameButton
                  variant="mute"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => p - 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  Previous
                </GameButton>
                <span className="text-white/60 text-xs font-medium">Page {page}</span>
                <GameButton
                  variant="mute"
                  size="sm"
                  disabled={page >= Math.ceil(total / limit)}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  Next
                </GameButton>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="space-y-3">
              {filteredItems.map(renderDefaultCard)}
            </div>
            {!loading && total > limit && (
              <div className="flex items-center justify-center gap-3 py-6 mt-4">
                <GameButton
                  variant="mute"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => p - 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  Previous
                </GameButton>
                <span className="text-white/60 text-xs font-medium">Page {page}</span>
                <GameButton
                  variant="mute"
                  size="sm"
                  disabled={page >= Math.ceil(total / limit)}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  Next
                </GameButton>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default BetRecords;
