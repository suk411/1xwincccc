import { useState, useEffect, useCallback, useMemo } from "react";
import { Copy, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { GameCard } from "@/components/GameCard";
import { GameButton } from "@/components/GameButton";
import { authService } from "@/services/authService";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import earnBanner from "@/assets/earn/earn-banner.png";
import goldBorder from "@/assets/events/gold-border.png";
import emptyBox from "@/assets/events/empty-box.png";
import level1Bg from "@/assets/earn/level1-bg.png";
import level2Bg from "@/assets/earn/level2-bg.png";
import level3Bg from "@/assets/earn/level3-bg.png";
import agentMapTree from "@/assets/earn/agent-map-tree.png";

interface ReferralUser {
  userId: string;
  mobile: string;
  createdAt: string;
}

interface ReferralData {
  inviteCode: string;
  inviteLink: string;
  total: number;
  page: number;
  limit: number;
  users: ReferralUser[];
}

interface CommissionRecord {
  recUser: number;
  fromUser: number;
  depositAmt: number;
  amount: number;
  claim: boolean;
  timestamp: string;
}

interface BonusSummary {
  userId: number;
  unclaimedBonus: number;
  updatedAt: string;
}

interface DailyBonusLevel {
  deposit: number;
  commission: number;
  count: number;
}

interface DailyBonus {
  date: string;
  level1: DailyBonusLevel;
  level2: DailyBonusLevel;
  level3: DailyBonusLevel;
}

const maskMobile = (mobile: string) => {
  if (!mobile || mobile.length < 4) return mobile;
  return mobile.slice(0, 2) + "****" + mobile.slice(-4);
};

const getUserIdFromToken = (): string => {
  try {
    const token = authService.getToken();
    if (!token) return "";
    const parts = token.split(".");
    if (parts.length < 2) return "";
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return (payload?.userId || payload?.sub || payload?.id || payload?.user?.id || "") as string;
  } catch {
    return "";
  }
};

const InviteRow = ({
  icon,
  label,
  values,
  reward,
}: {
  icon: React.ReactNode;
  label: string;
  values: [number, number, number];
  reward: string;
}) => (
  <div
    className="flex items-center justify-between rounded-lg px-3 py-2"
    style={{ backgroundColor: "rgb(112, 28, 50)" }}
  >
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-white text-sm font-bold">{values[0]}</span>
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] text-white font-medium"
            style={{ backgroundColor: "rgb(5, 121, 45)" }}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5.168.073L8.559 3.958a.15.15 0 01-.16.352H6.732a.15.15 0 00-.21.131c-.125.905-.877 4.905-4.45 5.497a.1.1 0 01-.133-.06.1.1 0 01.014-.118c.612-.48 1.412-1.41 1.637-3.063.086-.672.128-1.349.125-2.026a.15.15 0 00-.212-.152H1.615a.15.15 0 01-.16-.352L4.848.073a.15.15 0 01.32 0z" fill="white"/></svg>
            +{values[1]}
          </span>
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] text-white font-medium"
            style={{ backgroundColor: "#d97706" }}
          >
            +{values[2]}
          </span>
        </div>
        <span className="text-white/90 text-xs">{label}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-white text-sm font-medium">{reward}</span>
      <div className="w-5 h-5 rounded-full flex items-center justify-center border border-white/30">
        <span className="text-white/60 text-[10px]">?</span>
      </div>
    </div>
  </div>
);

const RecordsCard = ({ data, loadMore, hasMore, loadingMore }: {
  data: ReferralData | null;
  loadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}) => {
  const [recordTab, setRecordTab] = useState<"invitation" | "daily">("invitation");

  return (
    <GameCard className="p-3 flex flex-col gap-3">
      <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: "#1a0a10" }}>
        {(["invitation", "daily"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setRecordTab(tab)}
            className="flex-1 py-2 rounded-md text-sm font-medium transition-colors"
            style={
              recordTab === tab
                ? { backgroundColor: "rgb(177, 44, 73)", color: "white" }
                : { color: "rgba(255,255,255,0.5)" }
            }
          >
            {tab === "invitation" ? "Invitation Records" : "Daily Bonus Records"}
          </button>
        ))}
      </div>

      {recordTab === "invitation" ? (
        <>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-white/60 text-xs flex-1">Joined Date</span>
            <span className="text-white/60 text-xs flex-1 text-center">User ID</span>
            <span className="text-white/60 text-xs flex-1 text-right">Mobile</span>
          </div>

          {data && data.users.length > 0 ? (
            <>
              {data.users.map((user, i) => (
                <div key={String(user.userId) + i} className="flex items-center justify-between px-2 py-2 rounded-md" style={{ backgroundColor: i % 2 === 0 ? "rgba(112,28,50,0.3)" : "transparent" }}>
                  <span className="text-white/70 text-xs flex-1">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                  </span>
                  <span className="text-white/80 text-xs flex-1 text-center font-mono">
                    {String(user.userId || "").slice(0, 8)}
                  </span>
                  <span className="text-white/70 text-xs flex-1 text-right">
                    {maskMobile(user.mobile)}
                  </span>
                </div>
              ))}
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-[#FA829D] text-xs text-center py-2"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <img src={emptyBox} alt="No records" className="w-24 h-24 object-contain opacity-50" />
              <span className="text-white/40 text-sm">No referrals yet — share your link!</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-white/60 text-xs">Date</span>
            <span className="text-white/60 text-xs">Invites</span>
            <span className="text-white/60 text-xs">Regular</span>
            <span className="text-white/60 text-xs">Depositor</span>
            <span className="text-white/60 text-xs">Reward</span>
          </div>
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <img src={emptyBox} alt="No records" className="w-24 h-24 object-contain opacity-50" />
            <span className="text-white/40 text-sm">No Invite Records</span>
          </div>
        </>
      )}
    </GameCard>
  );
};

const CommissionRecordsCard = ({
  records,
  filter,
  onFilterChange,
  loadMore,
  hasMore,
  loadingMore,
}: {
  records: CommissionRecord[];
  filter: "unclaimed" | "claimed";
  onFilterChange: (filter: "unclaimed" | "claimed") => void;
  loadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}) => {
  return (
    <GameCard className="p-3 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="#AC4059"/>
          <path d="M5.73329 11.0669C6.32239 11.0669 6.79996 10.5894 6.79996 10.0003C6.79996 9.41117 6.32239 8.93359 5.73329 8.93359C5.14419 8.93359 4.66663 9.41117 4.66663 10.0003C4.66663 10.5894 5.14419 11.0669 5.73329 11.0669Z" stroke="#FA829D" strokeLinejoin="round"/>
          <path d="M12.1332 5.20068H8.93323V14.8007H12.1332" stroke="#FA829D" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.79999 10H12.1333" stroke="#FA829D" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-white font-bold text-sm">Payout Records</span>
      </div>

      <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: "#1a0a10" }}>
        {(["unclaimed", "claimed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onFilterChange(tab)}
            className="flex-1 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={
              filter === tab
                ? { backgroundColor: "rgb(177, 44, 73)", color: "white" }
                : { color: "rgba(255,255,255,0.5)" }
            }
          >
            {tab === "unclaimed" ? "Pending" : "Claimed"}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-white/60 text-xs">Date</span>
        <span className="text-white/60 text-xs">From User</span>
        <span className="text-white/60 text-xs">Deposit</span>
        <span className="text-white/60 text-xs">Commission</span>
      </div>

      {records.length > 0 ? (
        <>
          {records.map((rec, i) => (
            <div key={i} className="flex items-center justify-between px-2 py-2 rounded-md" style={{ backgroundColor: i % 2 === 0 ? "rgba(112,28,50,0.3)" : "transparent" }}>
              <span className="text-white/70 text-xs">
                {new Date(rec.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </span>
              <span className="text-white/80 text-xs font-mono">{String(rec.fromUser).slice(0, 8)}</span>
              <span className="text-white/70 text-xs">₹{rec.depositAmt}</span>
              <span className="text-[#f5c842] text-xs font-bold">₹{rec.amount.toFixed(2)}</span>
            </div>
          ))}
          {hasMore && (
            <button onClick={loadMore} disabled={loadingMore} className="text-[#FA829D] text-xs text-center py-2">
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <img src={emptyBox} alt="No records" className="w-20 h-20 object-contain opacity-50" />
          <span className="text-[#FA829D] text-sm">No commission records</span>
        </div>
      )}
    </GameCard>
  );
};

const Earn = () => {
  const [activeTab, setActiveTab] = useState<"referral" | "commission">("referral");
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [allUsers, setAllUsers] = useState<ReferralUser[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);

  // Agent data
  const [bonusSummary, setBonusSummary] = useState<BonusSummary | null>(null);
  const [dailyBonus, setDailyBonus] = useState<DailyBonus | null>(null);
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([]);
  const [commFilter, setCommFilter] = useState<"unclaimed" | "claimed">("unclaimed");
  const [commPage, setCommPage] = useState(1);
  const [commTotal, setCommTotal] = useState(0);

  const [commLoadingMore, setCommLoadingMore] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [levelVal, setLevelVal] = useState("All");
  const [dateOpen, setDateOpen] = useState(false);
  const [yr, setYr] = useState(2026);
  const [mo, setMo] = useState(5);
  const [dd, setDd] = useState(22);

  const { userId } = useProfile();
  const { copyToClipboard } = useCopyToClipboard();
  const tokenUserId = useMemo(() => getUserIdFromToken(), []);
  const effectiveUserId = userId || tokenUserId;

  // Generate invite URL from userId
  const inviteUrl = effectiveUserId ? `https://1xking.vercel.app/register?ref=${effectiveUserId}` : "";

  const fetchReferrals = useCallback(async (p = 1, append = false) => {
    try {
      if (p > 1) setLoadingMore(true);
      else setLoading(true);
      const data = await authService.getReferrals(p, 20);
      setReferralData(data);
      setAllUsers(prev => append ? [...prev, ...data.users] : data.users);
      setPage(p);
    } catch (err: any) {
      if (!err.message?.includes("Session expired")) {
        toast({ description: err.message || "Something went wrong", variant: "destructive" });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const fetchBonusSummary = useCallback(async () => {
    try {
      const data = await authService.getBonusSummary();
      setBonusSummary(data);
    } catch (err: any) {
      if (!err.message?.includes("Session expired")) {
        console.error("Bonus summary error:", err);
      }
    }
  }, []);

  const fetchDailyBonus = useCallback(async (date?: string) => {
    try {
      const data = await authService.getDailyBonus(date);
      setDailyBonus(data);
    } catch (err: any) {
      if (!err.message?.includes("Session expired")) {
        console.error("Daily bonus error:", err);
      }
    }
  }, []);

  const fetchCommissions = useCallback(async (p = 1, append = false, claim?: boolean) => {
    try {
      if (p > 1) setCommLoadingMore(true);
      const data = await authService.getCommissions(claim, p, 25);
      setCommissionRecords(prev => append ? [...prev, ...(data.items || [])] : (data.items || []));
      setCommTotal(data.total || 0);
      setCommPage(p);
    } catch (err: any) {
      if (!err.message?.includes("Session expired")) {
        console.error("Commissions error:", err);
      }
    } finally {
      setCommLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals(1);
    fetchBonusSummary();
    fetchDailyBonus();
    // Initially show unclaimed commissions.
    fetchCommissions(1, false, false);
  }, [fetchReferrals, fetchBonusSummary, fetchDailyBonus, fetchCommissions]);

  const hasMore = referralData ? allUsers.length < referralData.total : false;
  const displayData = referralData ? { ...referralData, users: allUsers } : null;
  const commHasMore = commissionRecords.length < commTotal;

  const handleClaimBonus = async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const result = await authService.claimBonus();
      toast({ description: `Claimed ₹${result.claimedAmount}! New balance: ₹${result.newBalance}` });
      fetchBonusSummary();
      fetchCommissions(1, false, commFilter === "claimed");
    } catch (err: any) {
      toast({ description: err.message || "Claim failed", variant: "destructive" });
    } finally {
      setClaiming(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!inviteUrl) return;
    copyToClipboard(inviteUrl, "Copied Success");
  };

  const handleShareInvite = async () => {
    if (!inviteUrl) return;
    const shareData = {
      title: "Join 1xKING!",
      text: `Join 1xKING and get rewards! Use my referral link:`,
      url: inviteUrl,
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast({ description: "Share failed", variant: "destructive" });
        }
      }
    } else {
      handleCopyUrl();
    }
  };

  const unclaimedBonus = bonusSummary?.unclaimedBonus ?? 0;

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
      <PageHeader title="Agency" />

      <div className="flex flex-col gap-2 px-2 pt-2">
        {/* Referral Bonus / Commission tabs */}
        <GameCard className="flex gap-1">
          <button
            onClick={() => setActiveTab("referral")}
            className="flex-1 h-8 rounded-sm text-sm transition-all"
            style={
              activeTab === "referral"
                ? {
                    backgroundImage:
                      "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                    color: "#5a2d0a",
                  }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Referral Bonus
          </button>
          <button
            onClick={() => setActiveTab("commission")}
            className="flex-1 h-8 rounded-md text-sm transition-all"
            style={
              activeTab === "commission"
                ? {
                    backgroundImage:
                      "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                    color: "#5a2d0a",
                  }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Subordinate data
          </button>
        </GameCard>

        <style>{`
  .container {
    width: 100%;
    max-width: 375px;
    background: linear-gradient(rgba(53,3,12,0.6), rgba(53,3,12,0.6)) no-repeat top / 200% 245px, url("https://www.82bet22.com/assets/png/promotionbg-1203267e.webp") no-repeat top / 200% 245px, linear-gradient(180deg, #35030c 0%, #5b0116 245px, transparent 245px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    box-sizing: border-box;
    color: #ffffff;
    border-radius: 10px;
    box-shadow: none;
  }
  .amount {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  .amount_txt {
    background-color: rgba(255,255,255,0.15);
    color: #f2413b;
    font-size: 13px;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 8px;
  }
  .tip {
    font-size: 11px;
    opacity: 0.9;
    margin-bottom: 20px;
  }
  .info_content {
    width: 92%;
    background-color: #1f040d;
    border-radius: 10px;
    display: flex;
    overflow: hidden;
    border: 1px solid rgba(255,180,50,0.15);
  }
  .info {
    flex: 1;
    padding-bottom: 15px;
    text-align: center;
  }
  .info .head {
    background-color: #f2413b;
    color: #ffffff;
    font-size: 13px;
    padding: 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .info .head.u2 {
    background-color: #f2413b;
    opacity: 0.9;
  }
  .info [class^="line"] {
    font-size: 11px;
    color: rgba(255,255,255,0.75);
    padding: 10px 5px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 45px;
  }
  .info:first-child [class^="line"] {
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .info [class^="line"] div {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 2px;
  }
  .line2 div { color: #18b660 !important; }
  .line3 div { color: #feaa57 !important; }
  .TeamReport__C {
    width: 100%;
    box-sizing: border-box;
  }
  .searchbar-container {
    position: relative;
    width: 100%;
    height: 40px;
  }
  .searchbar-container__searchbar {
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,0.08);
    border-radius: 5px;
    border: 1px solid rgba(255,180,50,0.15);
    padding: 10px 40px 10px 15px;
    font-size: 14px;
    box-sizing: border-box;
    color: rgba(255,255,255,0.9);
    outline: none;
  }
  .searchbar-container__searchbar::placeholder {
    color: rgba(255,255,255,0.4);
  }

  .TeamReport__C-head-line2 {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    gap: 10px;
  }
  .TeamReport__C-head-line2 > div {
    flex: 1;
    height: 40px;
    background-color: rgba(255,255,255,0.08);
    border-radius: 5px;
    border: 1px solid rgba(255,180,50,0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 14px;
    color: rgba(255,255,255,0.6);
  }
  .level-dropdown {
    position: relative;
    cursor: pointer;
  }
  .level-dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #2a0510;
    border: 1px solid rgba(255,180,50,0.25);
    border-radius: 6px;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-6px);
    pointer-events: none;
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
    z-index: 10;
  }
  .level-dropdown-menu.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  .level-dropdown-item {
    padding: 8px 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.8);
    transition: background 0.15s;
  }
  .level-dropdown-item:hover {
    background: rgba(255,255,255,0.1);
  }
  .date-dropdown {
    position: relative;
    cursor: pointer;
  }
  .date-dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%) translateY(-6px);
    background: #2a0510;
    border: 1px solid rgba(255,180,50,0.25);
    border-radius: 8px;
    padding: 10px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
    z-index: 10;
    min-width: 180px;
  }
  .date-dropdown-menu.open {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }
  .date-picker-cols {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .scroll-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-width: 44px;
  }
  .scroll-val {
    transition: all 0.2s ease-out;
    cursor: pointer;
    user-select: none;
    line-height: 1.4;
    text-align: center;
  }
  .scroll-val-cur {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }
  .scroll-val-prev {
    font-size: 13px;
    color: rgba(255,255,255,0.25);
  }
  .scroll-val-prev:hover {
    color: rgba(255,255,255,0.6);
  }
  .scroll-val-next {
    font-size: 13px;
    color: rgba(255,255,255,0.25);
  }
  .scroll-val-next:hover {
    color: rgba(255,255,255,0.6);
  }
  .TeamReport__C-head-line2 > div svg {
    fill: rgba(255,255,255,0.4);
  }
  .header-container {
    background: linear-gradient(rgba(53,3,12,0.6), rgba(53,3,12,0.6)) no-repeat top / 200% 100%, url("https://www.82bet22.com/assets/png/promotionbg-1203267e.webp") no-repeat top / 200% 100%, linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    border-radius: 10px;
    padding: 20px 0;
    margin: 20px 0 15px;
    display: flex;
    flex-wrap: wrap;
    row-gap: 24px;
    border: 1px solid rgba(255,180,50,0.25);
  }
  .header-container > div {
    width: 50%;
    text-align: center;
    color: #fff;
  }
  .header-container .num {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 3px;
    display: block;
  }
  .header-container .label {
    font-size: 12px;
    opacity: 0.9;
  }
  .TeamReport__C-body-item {
    background-color: rgba(255,255,255,0.06);
    border-radius: 5px;
    padding: 0 10px;
    margin-bottom: 10px;
    border: 1px solid rgba(255,180,50,0.1);
  }
  .TeamReport__C-body-item-head {
    height: 35px;
    padding-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.8px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.9);
    font-size: 16px;
  }
  .TeamReport__C-body-item-detail {
    padding: 11px 0;
    font-size: 13px;
  }
  .TeamReport__C-body-item-detail > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 15px;
    margin-bottom: 8px;
    color: rgba(255,255,255,0.6);
  }
  .TeamReport__C-body-item-detail > div:last-child {
    margin-bottom: 0;
  }
  .val-orange { color: #feaa57; }
  .val-light { color: rgba(255,255,255,0.4); }
  .icon-copy {
    width: 16px;
    height: 16px;
    fill: rgba(255,255,255,0.4);
    cursor: pointer;
  }
`}</style>
        {activeTab === "referral" ? (
          <>
            <div className="container">
  <div className="amount">0</div>
  <div className="amount_txt">Yesterday's total commission</div>
  <div className="tip">Upgrade the level to increase commission income</div>
  <div className="info_content">
    <div className="info">
      <div className="head">Direct subordinates</div>
      <div className="line1"><div>0</div>number of register</div>
      <div className="line2"><div>0</div>Deposit number</div>
      <div className="line3"><div>0</div>Deposit amount</div>
      <div className="line1"><div>0</div> Number of people making first deposit</div>
    </div>
    <div className="info">
      <div className="head u2">Team subordinates</div>
      <div className="line1"><div>0</div>number of register</div>
      <div className="line2"><div>0</div>Deposit number</div>
      <div className="line3"><div>0</div>Deposit amount</div>
      <div className="line1"><div>0</div> Number of people making first deposit</div>
    </div>
  </div>
</div>
            {/* Invite Stats Card */}
            <GameCard className="p-3 flex flex-col gap-2">
              <InviteRow icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.333 6.667a2.333 2.333 0 100-4.667 2.333 2.333 0 000 4.667z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.333 13.599V14h10v-.401c0-1.494 0-2.24-.291-2.811a2.67 2.67 0 00-1.166-1.165c-.57-.291-1.317-.291-2.81-.291H5.6c-1.494 0-2.24 0-2.811.29a2.67 2.67 0 00-1.166 1.166c-.29.57-.29 1.317-.29 2.81z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.667 4.332v4M10.667 6.332h4" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Total Invites" values={[referralData?.total || 0, 0, 0]} reward=" 👤" />
              <InviteRow icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.333 6.667a2.333 2.333 0 100-4.667 2.333 2.333 0 000 4.667z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.667 5.334l2 2 2-2" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.333 13.601V14h10v-.399c0-1.494 0-2.24-.291-2.811a2.67 2.67 0 00-1.166-1.165c-.57-.291-1.317-.291-2.81-.291H5.6c-1.494 0-2.24 0-2.811.29a2.67 2.67 0 00-1.166 1.166c-.29.57-.29 1.317-.29 2.81z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Valid Invites" values={[0, 0, 0]} reward=" 👤" />
              <InviteRow icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.333 2.666v4c0 .736-1.343 1.333-3 1.333s-3-.597-3-1.333v-4" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.333 4.666c0 .736-1.343 1.333-3 1.333s-3-.597-3-1.333" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.333 2.667c0 .737-1.343 1.334-3 1.334s-3-.597-3-1.334C1.333 1.93 2.677 1.334 4.333 1.334s3 .597 3 1.333z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.667 2h2a1.333 1.333 0 011.333 1.333v2" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.333 14H3.333A1.333 1.333 0 012 12.666v-2" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.667 11.333a1.667 1.667 0 100-3.333 1.667 1.667 0 000 3.333z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.667 14.666H8.667c0-1.657 1.343-3 3-3s3 1.343 3 3z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Deposit Invites" values={[0, 0, 0]} reward="👤" />
              <InviteRow icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="10" fill="#B12C49"/><path fillRule="evenodd" clipRule="evenodd" d="M10 14.375a4.375 4.375 0 004.375-4.375H10V5.625A4.375 4.375 0 005.625 10 4.375 4.375 0 0010 14.375z" stroke="#FF9FA7" strokeWidth="1.01" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M11.458 8.542V5.875a4.38 4.38 0 012.667 2.667h-2.667z" stroke="#FF9FA7" strokeWidth="1.01" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Core Users" values={[0, 0, 0]} reward=" 👤" />
            </GameCard>

            {/* Invitation Records */}
            <RecordsCard
              data={displayData}
              loadMore={() => fetchReferrals(page + 1, true)}
              hasMore={hasMore}
              loadingMore={loadingMore}
            />
          </>
        ) : (
          <>
            <div className="TeamReport__C">
              <div className="searchbar-container">
                <input type="text" className="searchbar-container__searchbar" placeholder="Search subordinate UID" />
<GameButton variant="red" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "64px", height: "32px", borderRadius: "19px", padding: "0", fontSize: "0", minWidth: "64px" }}><svg width="18" height="18" viewBox="0 0 1024 1024" fill="white"><path d="M956.8 905.6L723.2 672c54.4-64 86.4-147.2 86.4-236.8 0-204.8-166.4-371.2-371.2-371.2S67.2 230.4 67.2 435.2s166.4 371.2 371.2 371.2c89.6 0 172.8-32 236.8-86.4l233.6 233.6c6.4 6.4 16 9.6 25.6 9.6s19.2-3.2 25.6-9.6c12.8-12.8 12.8-32 0-44.8zM131.2 435.2c0-169.6 137.6-307.2 307.2-307.2s307.2 137.6 307.2 307.2-137.6 307.2-307.2 307.2-307.2-137.6-307.2-307.2z"></path></svg></GameButton>
              </div>
              <div className="TeamReport__C-head-line2">
                <div className="level-dropdown" onClick={() => setLevelOpen(o => !o)}>
                  <span>{levelVal}</span>
                  <svg width="12" height="12" viewBox="0 0 1024 1024"><path d="M884 311.6c-9.4-9.4-24.6-9.4-33.9 0L512 649.7 173.9 311.6c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l355.1 355.1c9.4 9.4 24.6 9.4 33.9 0L884 345.5c9.4-9.4 9.4-24.6 0-33.9z"></path></svg>
                  <div className={`level-dropdown-menu ${levelOpen ? "open" : ""}`}>
                    {["All", "Level 1", "Level 2", "Level 3"].map(opt => (
                      <div key={opt} className="level-dropdown-item" onClick={e => { e.stopPropagation(); setLevelVal(opt); setLevelOpen(false); }}>{opt}</div>
                    ))}
                  </div>
                </div>
                <div className="date-dropdown" onClick={() => setDateOpen(o => !o)}>
                  <span>{`${yr}-${String(mo).padStart(2,"0")}-${String(dd).padStart(2,"0")}`}</span>
                  <svg width="12" height="12" viewBox="0 0 1024 1024"><path d="M884 311.6c-9.4-9.4-24.6-9.4-33.9 0L512 649.7 173.9 311.6c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l355.1 355.1c9.4 9.4 24.6 9.4 33.9 0L884 345.5c9.4-9.4 9.4-24.6 0-33.9z"></path></svg>
                  <div className={`date-dropdown-menu ${dateOpen ? "open" : ""}`}>
                    <div className="date-picker-cols">
                      <div className="scroll-col">
                        <div className="scroll-val scroll-val-prev" onClick={e => { e.stopPropagation(); setYr(y => Math.min(y + 1, 2030)); }}>{yr + 1 > 2030 ? "" : yr + 1}</div>
                        <div className="scroll-val scroll-val-cur">{yr}</div>
                        <div className="scroll-val scroll-val-next" onClick={e => { e.stopPropagation(); setYr(y => Math.max(y - 1, 2020)); }}>{yr - 1 < 2020 ? "" : yr - 1}</div>
                      </div>
                      <div className="scroll-col">
                        <div className="scroll-val scroll-val-prev" onClick={e => { e.stopPropagation(); setMo(m => m % 12 + 1); }}>{String(mo % 12 + 1).padStart(2, "0")}</div>
                        <div className="scroll-val scroll-val-cur">{String(mo).padStart(2, "0")}</div>
                        <div className="scroll-val scroll-val-next" onClick={e => { e.stopPropagation(); setMo(m => m === 1 ? 12 : m - 1); }}>{String(mo === 1 ? 12 : mo - 1).padStart(2, "0")}</div>
                      </div>
                      <div className="scroll-col">
                        <div className="scroll-val scroll-val-prev" onClick={e => { e.stopPropagation(); setDd(d => d % 31 + 1); }}>{String(dd % 31 + 1).padStart(2, "0")}</div>
                        <div className="scroll-val scroll-val-cur">{String(dd).padStart(2, "0")}</div>
                        <div className="scroll-val scroll-val-next" onClick={e => { e.stopPropagation(); setDd(d => d === 1 ? 31 : d - 1); }}>{String(dd === 1 ? 31 : dd - 1).padStart(2, "0")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="header-container">
                <div><span className="num">0</span><span className="label">Deposit number</span></div>
                <div><span className="num">0</span><span className="label">Deposit amount</span></div>
                <div><span className="num">0</span><span className="label">Number of bettors</span></div>
                <div><span className="num">0</span><span className="label">Total bet</span></div>
                <div><span className="num">0</span><span className="label">First deposit number</span></div>
                <div><span className="num">0</span><span className="label">First deposit amount</span></div>
              </div>

              <div className="TeamReport__C-body-item">
                <div className="TeamReport__C-body-item-head">
                  <div>UID:3540850</div>
                  <svg className="icon-copy" viewBox="0 0 1024 1024"><path d="M768 832V256H192v576h576m0-640a64 64 0 0 1 64 64v576a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V256a64 64 0 0 1 64-64h576m-128-128v64H128v576H64V128a64 64 0 0 1 64-64h512z"></path></svg>
                </div>
                <div className="TeamReport__C-body-item-detail">
                  <div>Level <span>1</span></div>
                  <div>Deposit amount <span className="val-orange">0</span></div>
                  <div>Commission <span className="val-orange">0</span></div>
                  <div>Register Time <span className="val-light">2026-05-22</span></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </main>
  );
};

export default Earn;
