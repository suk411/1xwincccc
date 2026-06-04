import { useState, useEffect, useCallback, useMemo } from "react";
import { GameCard } from "@/components/GameCard";
import { GameButton } from "@/components/GameButton";
import { authService } from "@/services/authService";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import iconTeamPartner from "@/assets/earn/team_partner.svg";
import iconCopyCode from "@/assets/earn/copy_Code.svg";
import iconTeamPort from "@/assets/earn/team_port.svg";
import iconCommission from "@/assets/earn/commission.svg";
import iconInviteReg from "@/assets/earn/invite_reg.svg";
import iconServer from "@/assets/earn/server.svg";
import iconRebateRatio from "@/assets/earn/rebateRatio.svg";
import iconCopy from "@/assets/earn/copy.svg";
import iconSubordinate from "@/assets/earn/icon-subordinate.svg";
import noDataImg from "@/assets/wingo/nodata.png";

import agentMapTree from "@/assets/earn/agent-map-tree.png";

interface AgencyDailyLevel {
  bets: number;
  deposit: number;
  regCount: number;
  depositCount: number;
  firstDepositCount: number;
}

interface AgencyDaily {
  status: string;
  date: string;
  level1: AgencyDailyLevel;
  level2: AgencyDailyLevel;
  level3: AgencyDailyLevel;
}

interface AgencyCommissionItem {
  _id: string;
  userId: number;
  date: string;
  rebateLevel: number;
  l1Bets: number;
  l2Bets: number;
  l3Bets: number;
  l1Rate: number;
  l2Rate: number;
  l3Rate: number;
  l1Amount: number;
  l2Amount: number;
  l3Amount: number;
  totalAmount: number;
  status: string;
  creditedAt: string;
  createdAt: string;
}

interface AgencyTeamMember {
  userId: number;
  mobile: string;
  registeredAt: string;
  tier: number;
  totalDeposit?: number;
  level?: number;
}

interface TeamAggregation {
  depositCount: number;
  depositAmount: number;
  bettorCount: number;
  betAmount: number;
  firstDepositCount: number;
  firstDepositAmount: number;
}

const Earn = () => {
  const [activeTab, setActiveTab] = useState<"referral" | "commission" | "rebateratio" | "subordinate" | "rules">("referral");
  const [agencyDaily, setAgencyDaily] = useState<AgencyDaily | null>(null);
  const [agencyCommissions, setAgencyCommissions] = useState<AgencyCommissionItem[]>([]);
  const [commPage, setCommPage] = useState(1);
  const [commTotal, setCommTotal] = useState(0);
  const [commLoading, setCommLoading] = useState(false);
  const [agencyTeam, setAgencyTeam] = useState<AgencyTeamMember[]>([]);
  const [teamPage, setTeamPage] = useState(1);
  const [teamTotal, setTeamTotal] = useState(0);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamAggregation, setTeamAggregation] = useState<TeamAggregation | null>(null);

  const [levelOpen, setLevelOpen] = useState(false);
  const [levelVal, setLevelVal] = useState("All");
  const [dateOpen, setDateOpen] = useState(false);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const MAX_YR = yesterday.getFullYear();
  const MAX_MO = yesterday.getMonth() + 1;
  const MAX_DD = yesterday.getDate();
  const [yr, setYr] = useState(MAX_YR);
  const [mo, setMo] = useState(MAX_MO);
  const [dd, setDd] = useState(MAX_DD);
  const [rebateLevelTab, setRebateLevelTab] = useState(0);
  const [searchUid, setSearchUid] = useState("");
  const [subDateFilter, setSubDateFilter] = useState("today");
  const [showCommissionDetail, setShowCommissionDetail] = useState(false);

  const { userId } = useProfile(false);
  const { copyToClipboard } = useCopyToClipboard();
  const tokenUserId = useMemo(() => authService.getUserIdFromToken(), []);
  const effectiveUserId = userId || tokenUserId;

  // Generate invite URL from userId
  const inviteUrl = effectiveUserId ? `https://1xking.vercel.app/register?ref=${effectiveUserId}` : "";

  const fetchAgencyDaily = useCallback(async (date?: string) => {
    try {
      const data = await authService.getAgencyDaily(date);
      setAgencyDaily(data);
    } catch (err: any) {
      if (!err.message?.includes("Session expired")) {
        console.error("Agency daily error:", err);
      }
    }
  }, []);

  const fetchAgencyCommissions = useCallback(async (p = 1, append = false) => {
    try {
      setCommLoading(true);
      const data = await authService.getAgencyCommissions(p, 25);
      setAgencyCommissions(prev => append ? [...prev, ...data.items] : data.items);
      setCommTotal(data.total || 0);
      setCommPage(p);
    } catch (err: any) {
      if (!err.message?.includes("Session expired")) {
        console.error("Commissions error:", err);
      }
    } finally {
      setCommLoading(false);
    }
  }, []);

  const fetchAgencyTeam = useCallback(async (p = 1, append = false) => {
    try {
      setTeamLoading(true);
      const toDate = `${yr}-${String(mo).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
      const params: any = { page: p, limit: 25, toDate };
      if (levelVal !== "All") params.tier = levelVal === "Level 1" ? 1 : levelVal === "Level 2" ? 2 : 3;
      if (searchUid) params.userId = parseInt(searchUid);
      const data = await authService.getAgencyTeam(params);
      setAgencyTeam(prev => append ? [...prev, ...data.items] : data.items);
      setTeamTotal(data.total || 0);
      setTeamPage(p);
      if (!append) setTeamAggregation(data.aggregation?.total ?? null);
    } catch (err: any) {
      if (!err.message?.includes("Session expired")) {
        toast({ description: err.message || "Something went wrong", variant: "destructive" });
      }
    } finally {
      setTeamLoading(false);
    }
  }, [levelVal, searchUid, yr, mo, dd]);

  const fetchAgencyNewSub = useCallback(async (fromDate: string, toDate: string) => {
    try {
      setTeamLoading(true);
      const data = await authService.getAgencyNewSub(fromDate, toDate);
      setAgencyTeam(data.items || []);
      setTeamTotal(data.items?.length || 0);
    } catch (err: any) {
      if (!err.message?.includes("Session expired")) {
        toast({ description: err.message || "Something went wrong", variant: "destructive" });
      }
    } finally {
      setTeamLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgencyDaily();
  }, [fetchAgencyDaily]);

  useEffect(() => {
    if (showCommissionDetail) fetchAgencyCommissions(1);
  }, [showCommissionDetail, fetchAgencyCommissions]);

  useEffect(() => {
    if (activeTab === "commission") {
      setAgencyTeam([]);
      setTeamAggregation(null);
      fetchAgencyTeam(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "subordinate") return;
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    let fromDate: string, toDate: string;
    if (subDateFilter === "today") {
      fromDate = dateStr; toDate = dateStr;
    } else if (subDateFilter === "yesterday") {
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      fromDate = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, "0")}-${String(yest.getDate()).padStart(2, "0")}`;
      toDate = fromDate;
    } else {
      fromDate = `${y}-${m}-01`;
      toDate = dateStr;
    }
    setLevelVal("All");
    setSearchUid("");
    fetchAgencyNewSub(fromDate, toDate);
  }, [subDateFilter, activeTab, fetchAgencyNewSub]);

  const commHasMore = agencyCommissions.length < commTotal;
  const teamHasMore = agencyTeam.length < teamTotal;

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

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
      <div className="flex flex-col gap-2 px-2 pt-2">
        {activeTab !== "rebateratio" && activeTab !== "subordinate" && activeTab !== "rules" && !showCommissionDetail && <>
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
            Agency
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
        </>}

        <style>{`
  .container {
    position: relative;
    width: 100%;
    max-width: 375px;
    background: linear-gradient(rgba(53,3,12,0.6), rgba(53,3,12,0.6)) no-repeat top / 200% 245px, url("https://www.82bet22.com/assets/png/promotionbg-1203267e.webp") no-repeat top / 200% 245px, linear-gradient(180deg, #35030c 0%, #5b0116 245px, transparent 245px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    box-sizing: border-box;
    color: #ffffff;
    border-radius: 10px;
    box-shadow: none;
  }
  .amount {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .amount_txt {
    background-color: rgba(255,255,255,0.15);
    color: #f2413b;
    font-size: 13px;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 6px;
  }
  .tip {
    font-size: 11px;
    opacity: 0.9;
    margin-bottom: 10px;
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
    padding-bottom: 10px;
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
    min-height: 32px;
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
    margin-top: 6px;
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
  .date-dropdown {
    position: relative;
    cursor: pointer;
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
    padding: 10px 0;
    margin: 10px 0;
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    border: 1px solid rgba(255,180,50,0.25);
  }
  .header-container > div {
    width: 50%;
    text-align: center;
    color: #fff;
  }
  .header-container .num {
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 3px;
    display: block;
  }
  .header-container .label {
    font-size: 12px;
    opacity: 0.9;
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
  .icon-copy {
    width: 16px;
    height: 16px;
    fill: rgba(255,255,255,0.4);
    cursor: pointer;
  }
  .van-overlay {
    position: fixed;
    top: 0; left: 0;
    z-index: 2004;
    width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.7);
  }
  .van-popup {
    position: fixed;
    left: 0; bottom: 0;
    z-index: 2004;
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
    background-color: #2a0510;
    transition: transform 0.3s;
  }
  .van-popup--round {
    border-radius: 16px 16px 0 0;
  }
  .van-picker {
    position: relative;
    background-color: #2a0510;
    user-select: none;
  }
  .van-picker__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px;
  }
  .van-picker__cancel, .van-picker__confirm {
    height: 100%;
    padding: 0 16px;
    font-size: 14px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  .van-picker__cancel { color: rgba(255,255,255,0.5); }
  .van-picker__confirm { color: #f2413b; }
  .van-picker__title {
    max-width: 50%;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    color: rgba(255,255,255,0.9);
  }
  .van-picker__columns {
    position: relative;
    display: flex;
    height: 264px;
    overflow: hidden;
  }
  .van-picker-column {
    flex: 1;
    overflow: hidden;
    font-size: 16px;
    text-align: center;
    touch-action: none;
  }
  .van-picker-column__wrapper {
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    touch-action: none;
  }
  .van-picker-column__item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    color: rgba(255,255,255,0.4);
    height: 44px;
    cursor: pointer;
  }
  .van-picker-column__item--selected {
    color: rgba(255,255,255,0.95);
    font-weight: 500;
  }
  .van-picker__mask {
    position: absolute;
    top: 0; left: 0;
    z-index: 2;
    width: 100%; height: 100%;
    background-image: linear-gradient(180deg, rgba(42,5,16,0.95) 0%, rgba(42,5,16,0.4) 40%, transparent 40%, transparent 60%, rgba(42,5,16,0.4) 60%, rgba(42,5,16,0.95) 100%);
    pointer-events: none;
  }
  .van-picker__frame {
    position: absolute;
    top: 110px;
    left: 16px;
    right: 16px;
    z-index: 3;
    height: 44px;
    pointer-events: none;
    border-top: 1px solid rgba(255,180,50,0.2);
    border-bottom: 1px solid rgba(255,180,50,0.2);
  }
  .svg-icon {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  .promote__cell {
    width: 100%;
  }
  .promote__cell-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    padding: 14px;
    margin-bottom: 10px;
    border-radius: 10px;
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid rgba(255,180,50,0.1);
    transition: background 0.15s;
  }
  .promote__cell-item:active {
    background-color: rgba(255,255,255,0.1);
  }
  .promote__cell-item .label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    color: rgba(255,255,255,0.9);
  }
  .promote__cell-item .arrow {
    display: flex;
    align-items: center;
    color: rgba(255,255,255,0.4);
    font-size: 14px;
  }
  .promote__cell-item .arrow i {
    font-style: normal;
    font-size: 18px;
    margin-left: 5px;
    color: rgba(255,255,255,0.2);
  }

  .commission {
    width: 100%;
    background: linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    border-radius: 10px;
    padding: 16px;
    margin-top: 12px;
    box-sizing: border-box;
    border: 1px solid rgba(255,180,50,0.1);
  }
  .commission > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .commission > div:first-child {
    display: block;
    margin-bottom: 14px;
  }
  .commission > div > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .commission > div > span {
    width: 1px;
    height: 40px;
    background: rgba(255,255,255,0.1);
    flex-shrink: 0;
  }
  .commission > div > div > span:first-child {
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.95);
    line-height: 1.2;
  }
  .commission > div > div > span:last-child {
    font-size: 11px;
    color: rgba(255,255,255,0.45);
    margin-top: 4px;
    line-height: 1.3;
  }
  .commission > div:first-child > span {
    font-size: 15px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .icon-copy-small {
    width: 18px;
    height: 18px;
    opacity: 0.5;
  }
  .rebate-ratio-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: linear-gradient(180deg, #2a0510 0%, #1a030a 100%);
  }
  .x-page {
    --main-color: #f2413b;
    min-height: calc(100vh - 120px);
    color: #fff;
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
  .x-page .van-icon-arrow-left {
    font-size: 18px;
    display: block;
    width: 18px;
    height: 18px;
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
  .x-page .bet-container-sticky .van-sticky > div {
    display: flex;
    flex-direction: column;
  }
  .x-page .fun-tabs__tab-list {
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
  .x-page .fun-tabs__tab-list::-webkit-scrollbar {
    display: none;
  }
  .x-page .fun-tab-item__label {
    display: block;
    width: 100.05px;
    height: 50.025px;
    box-sizing: border-box;
    text-align: center;
    flex-shrink: 0;
  }
  .x-page .fun-tab-item__label .tab_item {
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
  .x-page .fun-tab-item__label .tab_item.tab_active {
    opacity: 1;
    background-image: linear-gradient(90deg, rgb(206, 2, 4) 0%, rgb(242, 64, 58) 100%);
    color: rgb(255, 255, 255);
    border-radius: 8px;
    white-space: nowrap;
  }
  .x-page .fun-tab-item__label .tab_item svg {
    display: block;
    width: 25px;
    height: 25px;
    fill: currentColor;
    margin-bottom: 2px;
  }
  .x-page .fun-tab-item__label .tab_item span {
    display: block;
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    color: rgba(255,255,255,0.7);
  }
  .x-page .fun-tab-item__label .tab_item.tab_active span {
    color: #fff;
  }
  .x-page .x-page-list {
    padding: 12px 0 24px;
    flex: 1;
    overflow-y: auto;
  }
  .x-page .x-page-list .item {
    margin-bottom: 14px;
    background: linear-gradient(rgba(53,3,12,0.6), rgba(53,3,12,0.6)) no-repeat top / 200% 100%, url("https://www.82bet22.com/assets/png/promotionbg-1203267e.webp") no-repeat top / 200% 100%, linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    border-radius: 10px;
    padding: 0;
    border: 1px solid rgba(255,180,50,0.25);
  }
  .x-page .x-page-list .title {
    font-size: 15px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    padding: 10px 16px;
  }
  .x-page .x-page-list .title span {
    color: #f2413b;
    font-weight: 700;
  }
  .x-page .x-page-list .box {
    padding: 6px 0;
  }
  .x-page .x-page-list .box .li {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    gap: 10px;
  }
  .x-page .x-page-list .box .li svg {
    flex-shrink: 0;
  }
  .x-page .x-page-list .box .li > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .x-page .x-page-list .box .li .sum {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
  }
  .x-page .x-page-list .box .li .num {
    font-size: 15px;
    color: rgba(255,255,255,0.9);
  }
  .rules-grade {
    display: block;
    width: 100%;
    max-width: 462px;
    margin: 0 auto 34px;
    box-sizing: border-box;
  }
  .rules-grade-th {
    display: flex;
    background: #f2413b;
    border-radius: 10px 10px 0 0;
    color: white;
    padding-top: 14px;
    align-items: center;
    justify-content: center;
  }
  .rules-grade-th .item {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    padding: 6px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rules-grade-tr {
    display: flex;
    background: rgba(255,255,255,0.06);
    height: 47px;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .rules-grade-tr .item {
    flex: 1;
    text-align: center;
    color: rgba(255,255,255,0.6);
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .rules-grade-tr .item:first-child {
    color: #fff;
    font-weight: 600;
  }
  .rules-grade-th .item:first-child {
    color: #fff;
  }
  .rules-grade-tr:last-child {
    border-radius: 0 0 10px 10px;
    border-bottom: none;
  }
  .rules-card {
    position: relative;
    display: block;
    width: 100%;
    max-width: 461px;
    margin: 0 auto 34px;
    padding: 35px 12px 17px;
    background: linear-gradient(rgba(53,3,12,0.6), rgba(53,3,12,0.6)) no-repeat top / 200% 100%, url("https://www.82bet22.com/assets/png/promotionbg-1203267e.webp") no-repeat top / 200% 100%, linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    border-radius: 10px;
    box-sizing: border-box;
    text-align: start;
    border: 1px solid rgba(255,180,50,0.25);
  }
  .rules-card-title {
    position: absolute;
    top: 7px;
    left: 50%;
    transform: translateX(-50%);
    width: 109px;
    height: 27px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255,255,255,0.85);
    text-align: center;
    line-height: 27px;
    z-index: 1;
  }
  .rules-card-txt {
    display: block;
    padding: 24px 0 0;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255,255,255,0.6);
    line-height: 26px;
    text-align: start;
  }
  .rules-card-txt p {
    margin: 10px 0;
  }
  .rules-card-txt .txt {
    margin-top: 10px;
    font-weight: bold;
    cursor: pointer;
    display: inline-block;
  }
  .rules-svg-head {
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 337px;
    height: 41px;
    pointer-events: none;
  }
  @keyframes inviteShine {
    0% { left: -100%; }
    50%, 100% { left: 200%; }
  }
  .skeleton-box {
    background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.06) 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
  }
  @keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`}</style>
        {activeTab === "referral" ? (
          showCommissionDetail ? (
            <div className="x-page">
              <div className="navbar"><div className="navbar-fixed"><div className="navbar__content"><div className="navbar__content-left" onClick={() => setShowCommissionDetail(false)}><svg className="back-arrow" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></div><div className="navbar__content-center"><div className="navbar__content-title">Commission detail</div></div><div className="navbar__content-right"></div></div></div></div>
              <div className="x-page-list">
              {commLoading && agencyCommissions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.5)" }}>Loading...</div>
              ) : agencyCommissions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.5)" }}>No commission records</div>
              ) : (
                agencyCommissions.map((c) => (
                  <div key={c._id} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,180,50,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{c.date?.slice(0, 10)}</span>
                      <span style={{ fontSize: "11px", color: c.status === "CREDITED" ? "#18b660" : "rgba(255,255,255,0.4)", background: c.status === "CREDITED" ? "rgba(24,182,96,0.15)" : "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "10px" }}>{c.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>Level {c.rebateLevel}</span>
                      <span style={{ color: "#feaa57", fontWeight: 600 }}>₹{c.totalAmount}</span>
                    </div>
                    <div style={{ display: "flex", gap: "12px", marginTop: "6px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                      <span>L1: ₹{c.l1Amount}</span>
                      <span>L2: ₹{c.l2Amount}</span>
                      <span>L3: ₹{c.l3Amount}</span>
                    </div>
                  </div>
                ))
              )}
              {commHasMore && (
                <GameButton variant="dark" onClick={() => fetchAgencyCommissions(commPage + 1, true)} disabled={commLoading} style={{ width: "100%", marginTop: "8px", height: "36px", borderRadius: "19px" }}>
                  {commLoading ? "Loading..." : "Load more"}
                </GameButton>
              )}
            </div>
            </div>
          ) : (
          <>
            <div className="container">
  <img src={iconSubordinate} alt="" className="absolute top-3 right-3 w-7 h-7" style={{ filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.4))" }} onClick={() => setActiveTab("subordinate")} />
  <div className="amount">{agencyDaily?.yesterdayTotalCommission ?? 0}</div>
  <div className="amount_txt">Yesterday's total commission</div>
  <div className="tip">Upgrade the level to increase commission income</div>
  <div className="info_content">
    <div className="info">
      <div className="head">Direct subordinates</div>
      <div className="line1"><div>{agencyDaily?.level1?.regCount ?? 0}</div>number of register</div>
      <div className="line2"><div>{agencyDaily?.level1?.depositCount ?? 0}</div>Deposit number</div>
      <div className="line3"><div>{agencyDaily?.level1?.deposit ?? 0}</div>Deposit amount</div>
      <div className="line1"><div>{agencyDaily?.level1?.firstDepositCount ?? 0}</div> Number of people making first deposit</div>
    </div>
    <div className="info">
      <div className="head u2">Team subordinates</div>
      <div className="line1"><div>{((agencyDaily?.level2?.regCount ?? 0) + (agencyDaily?.level3?.regCount ?? 0))}</div>number of register</div>
      <div className="line2"><div>{((agencyDaily?.level2?.depositCount ?? 0) + (agencyDaily?.level3?.depositCount ?? 0))}</div>Deposit number</div>
      <div className="line3"><div>{((agencyDaily?.level2?.deposit ?? 0) + (agencyDaily?.level3?.deposit ?? 0))}</div>Deposit amount</div>
      <div className="line1"><div>{((agencyDaily?.level2?.firstDepositCount ?? 0) + (agencyDaily?.level3?.firstDepositCount ?? 0))}</div> Number of people making first deposit</div>
    </div>
  </div>
</div>
            <div style={{ display: "flex", alignItems: "center", width: "90%", margin: "10px auto" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "20px 0 0 20px", border: "1px solid rgba(255,180,50,0.15)", borderRight: "none", padding: "0 12px", height: "40px", overflow: "hidden", position: "relative" }}>
                <span style={{ position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", animation: "inviteShine 2.5s ease-in-out infinite", pointerEvents: "none" }} />
                <span style={{ flex: 1, fontSize: "13px", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", position: "relative", zIndex: 1 }}>{inviteUrl}</span>
                <img src={iconCopy} alt="" className="icon-copy-small" style={{ cursor: "pointer", flexShrink: 0, position: "relative", zIndex: 1 }} onClick={() => copyToClipboard(inviteUrl, "Copied Success")} />
              </div>
              <GameButton variant="dark" onClick={handleShareInvite} style={{ height: "40px", borderRadius: "0 20px 20px 0", padding: "0 20px", fontSize: "14px", flexShrink: 0, minWidth: "auto" }}>Invite</GameButton>
            </div>
            <div className="promote__cell">
              <div className="promote__cell-item" onClick={() => {}}>
                <div className="label"><img src={iconTeamPartner} className="svg-icon" alt="" /><span>Partner rewards</span></div>
                <div className="arrow"><i>&#10095;</i></div>
              </div>
              <div className="promote__cell-item" onClick={() => copyToClipboard(effectiveUserId || "", "Copied Success")}>
                <div className="label"><img src={iconCopyCode} className="svg-icon" alt="" /><span>Copy invitation code</span></div>
                <div className="arrow"><span style={{ fontSize: "13px", marginRight: "6px", opacity: 0.7 }}>{effectiveUserId}</span><img src={iconCopy} className="icon-copy-small" alt="" /></div>
              </div>
              <div className="promote__cell-item" onClick={() => setActiveTab("commission")}>
                <div className="label"><img src={iconTeamPort} className="svg-icon" alt="" /><span>Subordinate data</span></div>
                <div className="arrow"><i>&#10095;</i></div>
              </div>
              <div className="promote__cell-item" onClick={() => setShowCommissionDetail(true)}>
                <div className="label"><img src={iconCommission} className="svg-icon" alt="" /><span>Commission detail</span></div>
                <div className="arrow"><i>&#10095;</i></div>
              </div>
              <div className="promote__cell-item" onClick={() => setActiveTab("rules")}>
                <div className="label"><img src={iconInviteReg} className="svg-icon" alt="" /><span>Invitation rules</span></div>
                <div className="arrow"><i>&#10095;</i></div>
              </div>
              <div className="promote__cell-item" onClick={() => {}}>
                <div className="label"><img src={iconServer} className="svg-icon" alt="" /><span>Agent line customer service</span></div>
                <div className="arrow"><i>&#10095;</i></div>
              </div>
              <div className="promote__cell-item" onClick={() => setActiveTab("rebateratio")}>
                <div className="label"><img src={iconRebateRatio} className="svg-icon" alt="" /><span>Rebate ratio</span></div>
                <div className="arrow"><i>&#10095;</i></div>
              </div>
            </div>
            <div className="commission">
              <div><span>promotion data</span></div>
              <div>
                <div><span>{agencyDaily?.thisWeekCommission ?? 0}</span><span>This Week</span></div>
                <span></span>
                <div><span>{agencyDaily?.totalCommission ?? 0}</span><span>Total commission</span></div>
              </div>
              <div>
                <div><span>{agencyDaily?.totalRegister?.level1 ?? 0}</span><span>direct subordinate</span></div>
                <span></span>
                <div><span>{agencyDaily ? ((agencyDaily.totalRegister?.level2 ?? 0) + (agencyDaily.totalRegister?.level3 ?? 0)) : 0}</span><span>Total number of subordinates in the team</span></div>
              </div>
            </div>
          </>
        )) : activeTab === "rebateratio" ? (
          <div className="x-page">
            <div className="navbar"><div className="navbar-fixed"><div className="navbar__content"><div className="navbar__content-left" onClick={() => setActiveTab("referral")}><svg className="back-arrow" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></div><div className="navbar__content-center"><div className="navbar__content-title">Rebate ratio</div></div><div className="navbar__content-right"></div></div></div></div>
            <div className="bet-container-sticky"><div className="van-sticky"><div><div className="fun-tabs tabs"><div className="fun-tabs__tab-list">
              {["Lottery", "Casino", "Rummy", "Slots"].map((tab, i) => (
                <div key={tab} className="fun-tab-item funtab_item"><div className="fun-tab-item__wrap"><div className="fun-tab-item__label"><div className={`tab_item${i === rebateLevelTab ? " tab_active" : ""}`} onClick={() => setRebateLevelTab(i)}>
                  {tab === "Lottery" && <svg className="svg-icon icon-lottery" viewBox="0 0 48 48"><mask id="mask0_2094_41544" maskUnits="userSpaceOnUse" x="6" y="6" width="36" height="36"><circle cx="24" cy="24" r="18" fill="#D9D9D9"></circle></mask><g mask="url(#mask0_2094_41544)"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.4705 12.992C17.2079 14.0478 13.802 13.3906 11.2254 11.5176C8.65115 14.157 6.94305 17.5424 6.35131 21.184C9.24189 22.2447 11.6331 24.5757 12.6547 27.7324C13.6762 30.8888 13.1042 34.1786 11.3832 36.7317C14.3198 39.6583 18.2092 41.4967 22.3564 41.8918C23.627 39.7355 25.661 38.0177 28.2295 37.1865C30.8181 36.3488 33.4945 36.5589 35.7997 37.5825C38.9641 34.833 41.0645 31.0476 41.7397 26.9331C39.0138 25.7686 36.7873 23.4755 35.8028 20.4338C34.7996 17.3337 35.2977 14.1078 36.8953 11.5428C34.2573 8.83606 30.8169 7.02579 27.0991 6.38029C26.1085 9.40788 23.7332 11.9361 20.4705 12.992ZM28.0728 35.9093C33.8105 34.0525 36.9566 27.8958 35.0998 22.158C33.243 16.4202 27.0863 13.2741 21.3485 15.131C15.6107 16.9879 12.4646 23.1445 14.3215 28.8823C16.1784 34.62 22.335 37.7661 28.0728 35.9093Z" fill="currentColor"></path><path d="M27.0008 29.6018C26.7496 29.841 26.425 30.0249 26.0271 30.1538C25.6331 30.2812 25.2622 30.3223 24.9146 30.2768C24.5659 30.2276 24.2672 30.1024 24.0184 29.9012C23.7686 29.6961 23.5893 29.4254 23.4805 29.0894C23.3692 28.7456 23.3561 28.4148 23.441 28.0971C23.5286 27.7743 23.6987 27.4887 23.9513 27.2406C24.2026 26.9885 24.5195 26.8006 24.9019 26.6768C25.2882 26.5518 25.6551 26.5184 26.0026 26.5767C26.3488 26.6311 26.652 26.7635 26.9122 26.9737C27.171 27.1801 27.3561 27.4554 27.4674 27.7992C27.5761 28.1352 27.5874 28.4602 27.5012 28.774C27.4176 29.0828 27.2508 29.3587 27.0008 29.6018Z" fill="currentColor"></path><path d="M25.1322 24.3616C24.9171 24.5807 24.6434 24.7439 24.3113 24.8514C23.979 24.959 23.6616 24.987 23.359 24.9356C23.0564 24.8841 22.7929 24.7623 22.5686 24.5703C22.3443 24.3784 22.1815 24.1259 22.0802 23.8129C21.9802 23.5039 21.9642 23.2103 22.0321 22.9322C22.1026 22.6491 22.2461 22.3999 22.4624 22.1849C22.6775 21.9659 22.953 21.802 23.2892 21.6932C23.6291 21.5832 23.9485 21.5546 24.2472 21.6073C24.5447 21.6561 24.805 21.7745 25.0281 21.9627C25.2499 22.147 25.4108 22.3937 25.5108 22.7027C25.612 23.0157 25.6281 23.3157 25.5588 23.6027C25.4895 23.8897 25.3473 24.1427 25.1322 24.3616Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M27.4489 33.9791C32.1208 32.4673 34.6824 27.4544 33.1705 22.7825C31.6586 18.1106 26.6457 15.549 21.9739 17.0608C17.302 18.5727 14.7403 23.5857 16.2522 28.2575C17.7641 32.9294 22.777 35.4911 27.4489 33.9791ZM24.1012 32.3326C24.8904 32.3974 25.7311 32.2853 26.6234 31.9965C27.5159 31.7077 28.261 31.3066 28.8588 30.793C29.4591 30.2743 29.8745 29.6982 30.1047 29.0647C30.335 28.431 30.3483 27.793 30.1446 27.1504C29.9807 26.6571 29.716 26.2413 29.3504 25.903C28.9874 25.5596 28.5665 25.3138 28.0875 25.1658C27.6112 25.0126 27.123 24.9743 26.6227 25.0509L26.5965 24.9697C27.1772 24.6409 27.5878 24.1688 27.8282 23.5532C28.0686 22.9377 28.085 22.3029 27.8776 21.6487C27.6762 21.0396 27.3183 20.5536 26.8041 20.1909C26.2885 19.8242 25.6709 19.6037 24.9512 19.5294C24.2353 19.4537 23.4775 19.5453 22.6778 19.8041C21.8781 20.0629 21.2084 20.4332 20.6687 20.9152C20.1316 21.392 19.7617 21.9301 19.5586 22.5292C19.3543 23.1245 19.3516 23.7293 19.5504 24.3435C19.7605 24.9926 20.1419 25.4986 20.6947 25.8617C21.2463 26.221 21.8595 26.3619 22.5343 26.2843L22.5605 26.3655C22.1026 26.599 21.7237 26.918 21.4235 27.3224C21.1221 27.723 20.9249 28.1688 20.8319 28.6597C20.7417 29.1456 20.7766 29.6358 20.9366 30.1303C21.1441 30.7716 21.5268 31.2815 22.0846 31.66C22.6425 32.0386 23.3146 32.2628 24.1012 32.3326Z" fill="currentColor"></path><path d="M-5.27379 33.5341C-3.83367 37.9843 0.941276 40.4243 5.39135 38.9841C9.8414 37.5441 12.2814 32.7691 10.8414 28.319C9.4012 23.869 4.62629 21.4289 0.176219 22.869C-4.27386 24.3092 -6.71391 29.0841 -5.27379 33.5341Z" fill="currentColor"></path><path d="M14.6506 -4.99372C10.3306 -3.59569 8.01311 1.19803 9.47439 5.71338C10.9356 10.2287 15.6222 12.7558 19.9422 11.3577C24.2622 9.95969 26.5796 5.16597 25.1185 0.650652C23.6572 -3.86467 18.9706 -6.39174 14.6506 -4.99372Z" fill="currentColor"></path><path d="M34.1591 55.51C29.4706 57.0272 24.4777 54.5736 23.0072 50.0295C21.5368 45.4855 24.1454 40.5719 28.8339 39.0546C33.5223 37.5373 38.5152 39.991 39.9857 44.535C41.4562 49.079 38.8476 53.9928 34.1591 55.51Z" fill="currentColor"></path><path d="M54.1353 14.5011C55.6056 19.0444 53.1145 23.9194 48.5712 25.3896C44.028 26.8598 39.1531 24.3687 37.6829 19.8255C36.2125 15.2823 38.7036 10.4074 43.2469 8.93712C47.7902 7.46678 52.6651 9.9579 54.1353 14.5011Z" fill="currentColor"></path></g></svg>}
                  {tab === "Casino" && <svg className="svg-icon icon-video" viewBox="0 0 48 48"><path d="M16.6044 8.59427C16.3396 8.03582 16.5807 7.36986 17.1427 7.10682C17.7048 6.84378 18.3751 7.08325 18.6399 7.6417L21.6149 13.9168C21.8796 14.4752 21.6386 15.1412 21.0765 15.4042C20.5144 15.6673 19.8441 15.4278 19.5794 14.8693L16.6044 8.59427Z" fill="currentColor"></path><path d="M30.9957 8.59427C31.2605 8.03582 31.0194 7.36986 30.4573 7.10682C29.8953 6.84378 29.225 7.08325 28.9602 7.6417L25.9605 13.9689C25.6958 14.5274 25.9368 15.1933 26.4989 15.4564C27.061 15.7194 27.7313 15.4799 27.996 14.9215L30.9957 8.59427Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.625 13.8957C8.5184 13.8957 6 16.3978 6 19.4843V36.2501C6 39.3366 8.5184 41.8387 11.625 41.8387H36.375C39.4816 41.8387 42 39.3366 42 36.2501V19.4843C42 16.3978 39.4816 13.8957 36.375 13.8957H11.625ZM14.4375 16.1312C11.3309 16.1312 8.8125 18.6333 8.8125 21.7198V34.0147C8.8125 37.1012 11.3309 39.6033 14.4375 39.6033H33.5625C36.6691 39.6033 39.1875 37.1012 39.1875 34.0147V21.7198C39.1875 18.6333 36.6691 16.1312 33.5625 16.1312H14.4375Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.8065 17.8086C13.5996 17.8086 11 20.4082 11 23.615V32.1211C11 35.3279 13.5996 37.9275 16.8065 37.9275H31.0685C34.2754 37.9275 36.875 35.3279 36.875 32.1211V23.615C36.875 20.4082 34.2754 17.8086 31.0685 17.8086H16.8065ZM27.3776 29.5791C28.8784 28.6765 28.8784 26.5008 27.3776 25.5982L23.5195 23.2782C21.9715 22.3473 20 23.4623 20 25.2686L20 29.9087C20 31.715 21.9715 32.83 23.5195 31.8991L27.3776 29.5791Z" fill="currentColor"></path></svg>}
                  {tab === "Rummy" && <svg className="svg-icon icon-chess" viewBox="0 0 48 48"><ellipse cx="24" cy="24.005" rx="18" ry="17.8488" stroke="currentColor"></ellipse><path fill-rule="evenodd" clip-rule="evenodd" d="M24 41.8538C33.9411 41.8538 42 33.8626 42 24.005C42 14.1474 33.9411 6.15625 24 6.15625C14.0589 6.15625 6 14.1474 6 24.005C6 33.8626 14.0589 41.8538 24 41.8538ZM27.695 20.2582C29.1348 21.6473 30.605 23.0657 30.9686 24.2357C31.8261 26.9953 30.214 29.1047 27.5731 29.1047C26.3543 29.1047 25.5007 28.5988 24.9348 28.0538C24.8988 28.3954 24.9022 28.8583 25.0286 29.3597C25.2343 30.1757 25.8001 30.8896 26.0572 31.1446V31.6546H21.9429V31.1446C22.2001 30.8896 22.6806 30.2252 22.9715 29.3597C23.1357 28.8713 23.1601 28.383 23.1117 28.0273C22.5608 28.5822 21.7345 29.1047 20.5764 29.1047C18.107 29.1047 16.0833 27.1281 17.0437 24.2357C17.4482 23.0175 18.9112 21.6047 20.3334 20.2313C20.6173 19.9571 20.8996 19.6846 21.1715 19.4154C22.613 17.9885 23.7554 16.6492 23.9699 16.3978C23.9935 16.3701 24.0058 16.3556 24.0061 16.3556C24.0064 16.3556 24.0181 16.3694 24.0404 16.3959C24.2493 16.6429 25.3886 17.9907 26.8286 19.4154C27.1097 19.6935 27.4019 19.9754 27.695 20.2582Z" fill="currentColor"></path><path d="M18.4797 7.06917C18.444 6.91493 18.5358 6.76114 18.6883 6.72516C19.2212 6.59948 20.5013 6.32678 22.2273 6.15328C23.9533 5.97978 25.2626 5.99219 25.81 6.00927C25.9667 6.01417 26.0878 6.14656 26.084 6.30476L25.9992 9.91235C25.9961 10.0424 25.909 10.1543 25.7839 10.185C25.3094 10.3016 24.087 10.5796 22.6941 10.7196C21.3013 10.8596 20.0475 10.8306 19.559 10.8108C19.4302 10.8055 19.3223 10.7133 19.293 10.5865L18.4797 7.06917Z" fill="#B8DBC8"></path><path d="M29.4974 40.9561C29.5324 41.1105 29.44 41.2639 29.2874 41.2993C28.754 41.423 27.4729 41.6908 25.7462 41.8577C24.0196 42.0247 22.7104 42.0073 22.163 41.9881C22.0063 41.9826 21.8858 41.8498 21.8901 41.6916L21.9889 38.0844C21.9925 37.9543 22.08 37.8428 22.2052 37.8125C22.6802 37.6977 23.9037 37.4244 25.2971 37.2897C26.6905 37.155 27.9441 37.1888 28.4325 37.2104C28.5613 37.2162 28.6689 37.3089 28.6977 37.4358L29.4974 40.9561Z" fill="#B8DBC8"></path><path d="M41.4839 28.0003C41.6328 28.0476 41.7161 28.2035 41.6691 28.3532C41.506 28.8727 41.0896 30.1027 40.3604 31.6618C39.6312 33.2209 38.9531 34.3306 38.6586 34.7896C38.5737 34.9219 38.3998 34.9595 38.2673 34.8774L35.1728 32.9594C35.0633 32.8915 35.0122 32.76 35.0498 32.6359C35.1914 32.1699 35.5735 30.9877 36.1615 29.7307C36.7494 28.4737 37.4128 27.4207 37.6801 27.0126C37.7512 26.9039 37.8856 26.8576 38.0085 26.8967L41.4839 28.0003Z" fill="#B8DBC8"></path><path d="M40.5726 17.1763C40.7119 17.1047 40.7682 16.9368 40.6967 16.7973C40.4482 16.3124 39.8299 15.1688 38.8475 13.7526C37.865 12.3364 37.009 11.3549 36.6412 10.9514C36.5353 10.8353 36.3571 10.8275 36.2399 10.9309L33.5144 13.3345C33.4176 13.4199 33.3892 13.5581 33.4471 13.6738C33.6652 14.1094 34.2418 15.2119 35.0341 16.3538C35.8263 17.4958 36.6584 18.424 36.9907 18.7817C37.079 18.8767 37.2193 18.8998 37.3343 18.8407L40.5726 17.1763Z" fill="#B8DBC8"></path><path d="M7.53066 31.2649C7.3933 31.3402 7.34138 31.5095 7.41662 31.6471C7.67806 32.1251 8.327 33.252 9.34734 34.6417C10.3677 36.0313 11.2499 36.9898 11.6284 37.3834C11.7374 37.4966 11.9158 37.4996 12.0302 37.3931L14.6897 34.9182C14.7842 34.8303 14.8089 34.6914 14.7479 34.5773C14.5182 34.1477 13.912 33.0609 13.0892 31.9402C12.2664 30.8196 11.4095 29.9138 11.0677 29.5651C10.977 29.4724 10.836 29.4531 10.7227 29.5153L7.53066 31.2649Z" fill="#B8DBC8"></path><path d="M6.40816 20.1019C6.25952 20.054 6.17679 19.8977 6.22441 19.7482C6.38965 19.2295 6.81106 18.0011 7.5467 16.445C8.28233 14.8888 8.96491 13.7819 9.26132 13.3241C9.34673 13.1921 9.52082 13.1552 9.65301 13.2379L12.7396 15.1683C12.8488 15.2366 12.8994 15.3684 12.8612 15.4922C12.7178 15.9577 12.3308 17.1384 11.7377 18.393C11.1446 19.6476 10.4769 20.6979 10.2079 21.105C10.1363 21.2133 10.0018 21.2591 9.87898 21.2195L6.40816 20.1019Z" fill="#B8DBC8"></path><mask id="mask0_2094_41589" maskUnits="userSpaceOnUse" x="11" y="11" width="26" height="26"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.9978 36.7541C31.0986 36.7541 36.8549 31.0461 36.8549 24.005C36.8549 16.9638 31.0986 11.2559 23.9978 11.2559C16.897 11.2559 11.1406 16.9638 11.1406 24.005C11.1406 31.0461 16.897 36.7541 23.9978 36.7541ZM23.9978 35.7342C30.5305 35.7342 35.8263 30.4828 35.8263 24.005C35.8263 17.5271 30.5305 12.2758 23.9978 12.2758C17.465 12.2758 12.1692 17.5271 12.1692 24.005C12.1692 30.4828 17.465 35.7342 23.9978 35.7342Z" fill="currentColor"></path></mask><g mask="url(#mask0_2094_41589)"><path d="M21.4299 11.0021L24.5148 10.9336L24.5609 12.9729L21.4759 13.0415L21.4299 11.0021Z" fill="#B8DBC8"></path><path d="M28.3322 11.3949L31.1971 12.5315L30.4329 14.4254L27.568 13.2888L28.3322 11.3949Z" fill="#B8DBC8"></path><path d="M17.4308 12.2151L14.9296 14.007L16.1343 15.6604L18.6355 13.8685L17.4308 12.2151Z" fill="#B8DBC8"></path><path d="M12.3368 17.3762L11.14 20.1965L13.0361 20.9876L14.2329 18.1673L12.3368 17.3762Z" fill="#B8DBC8"></path><path d="M10.8828 23.7507L10.8828 26.8105L12.94 26.8105V23.7507L10.8828 23.7507Z" fill="#B8DBC8"></path><path d="M12.5203 30.4231L14.2092 32.9839L15.9309 31.8674L14.242 29.3066L12.5203 30.4231Z" fill="#B8DBC8"></path><path d="M16.7971 35.5881L19.6607 36.7279L20.427 34.8348L17.5634 33.6951L16.7971 35.5881Z" fill="#B8DBC8"></path><path d="M23.4828 37.2646L26.5682 37.3118L26.5999 35.2722L23.5146 35.225L23.4828 37.2646Z" fill="#B8DBC8"></path><path d="M30.5929 35.8649L33.1037 34.0863L31.9079 32.4264L29.3971 34.205L30.5929 35.8649Z" fill="#B8DBC8"></path><path d="M35.2458 31.0912L36.5971 28.3404L34.7477 27.4471L33.3964 30.1979L35.2458 31.0912Z" fill="#B8DBC8"></path><path d="M37.392 24.5156L37.3686 21.4559L35.3115 21.4714L35.335 24.5311L37.392 24.5156Z" fill="#B8DBC8"></path><path d="M35.824 17.7544L34.0818 15.2289L32.3839 16.3806L34.1261 18.9061L35.824 17.7544Z" fill="#B8DBC8"></path></g></svg>}
                  {tab === "Slots" && <svg className="svg-icon icon-slot" viewBox="0 0 48 48"><path fill-rule="evenodd" clip-rule="evenodd" d="M44.3345 12.4706C44.3345 12.5712 44.3284 12.6703 44.3166 12.7677C45.1351 13.5954 45.7981 14.8116 46.551 16.8628C47.3071 18.9227 47.4185 21.2382 47.3249 23.112C47.4636 23.6175 47.5791 24.1858 47.6596 24.8235V26.4706V28.1176C47.6596 31.1373 45.997 33.0588 45.997 33.0588C45.997 33.0588 45.178 33.8702 44.3529 34.1507C43.2807 37.1286 41.7029 38 41.0047 38H32.4196C32.4196 38 34.3592 36.6275 34.3592 26.4706C34.3592 16.3137 32.1425 14.9412 32.1425 14.9412H41.0047C41.7436 14.9412 43.4678 15.9172 44.5351 19.3333H44.8887C44.8887 19.3333 45.1166 19.4463 45.4446 19.7445C45.0423 18.0423 43.024 15.3901 42.1176 14.9412L42.112 14.9355L42.1045 14.9275C42.0178 14.9365 41.9298 14.9412 41.8407 14.9412C40.4634 14.9412 39.3469 13.8351 39.3469 12.4706C39.3469 11.1061 40.4634 10 41.8407 10C43.218 10 44.3345 11.1061 44.3345 12.4706ZM3.19266 34.1086C2.40779 33.7971 1.66254 33.0588 1.66254 33.0588C1.66254 33.0588 0 31.1373 0 28.1176V26.4706V24.8235C0.554181 20.4314 2.77091 19.3333 2.77091 19.3333H3.1877C3.72876 17.677 4.54266 16.2484 5.73962 15.4199C6.2972 15.034 6.97712 14.9412 7.6573 14.9412H15.7942C15.7942 14.9412 13.3003 15.6103 13.3003 26.4706C13.3003 37.3309 15.5171 38 15.5171 38H7.65711C6.97693 38 6.30146 37.9043 5.72691 37.5436C4.54065 36.799 3.73188 35.6083 3.19266 34.1086ZM14.1316 26.4706C14.1316 16.0392 16.3483 14.9412 16.3483 14.9412H31.4844C31.4844 14.9412 33.7011 16.0392 33.7011 26.4706C33.7011 36.902 31.5883 38 31.5883 38H16.0713C16.0713 38 14.1316 36.902 14.1316 26.4706ZM16.6658 18.809C16.9429 18.5345 18.4295 18.8795 19.1595 19.3581C19.2651 19.4274 19.4042 19.3209 19.6288 19.1489C19.997 18.8669 20.5952 18.4088 21.6533 18.26C22.4623 18.1462 23.9874 18.4453 25.3594 18.7143C26.3399 18.9066 27.2422 19.0835 27.7493 19.0835C28.9129 19.0836 29.758 18.7737 30.2448 18.5344C30.6653 18.3276 30.9773 19.2982 31.234 20.0966C31.5467 21.0326 31.3319 21.4747 31.091 21.9706C30.9879 22.183 30.8799 22.4053 30.7973 22.6522C30.613 23.203 30.1752 23.9704 29.789 24.6474C29.5978 24.9824 29.4195 25.295 29.2906 25.5484C29.2026 25.7216 29.1039 25.9059 28.9999 26.1003C28.5289 26.9802 27.9487 28.0643 27.7493 29.2404L27.7379 29.3079C27.5295 30.536 27.3821 31.4051 27.6211 33.7554C27.6211 33.8537 27.6236 33.9412 27.6259 34.0181C27.6346 34.3158 27.6387 34.456 27.4722 34.4561C26.4988 34.4567 22.2316 34.4577 20.4469 34.4561C20.2909 34.4559 20.2772 34.0312 20.2706 33.8259L20.2695 33.7923C20.269 33.7783 20.2685 33.7659 20.2679 33.7554C19.9924 28.6912 24.1488 24.5736 26.9181 22.9267C27.4493 22.6108 27.1952 22.6522 27.1952 22.6522C27.1952 22.6522 25.5326 23.4757 24.4242 23.4757C23.5301 23.4757 22.6857 23.1532 21.9679 22.8791C21.3511 22.6435 20.8278 22.4436 20.4469 22.5149C19.7137 22.6522 19.7137 23.4757 19.9908 23.7502C20.0966 23.8551 20.1882 23.9411 20.2664 24.0147C20.3929 24.1336 20.4844 24.2197 20.545 24.2992C20.6869 24.4856 20.1979 25.2068 19.7137 25.3973C19.2295 25.5877 17.4985 25.9463 16.9428 24.8482C16.3171 23.3992 16.7617 22.3209 17.0179 21.6997C17.1014 21.4971 17.1649 21.3431 17.1647 21.2407C17.1645 21.1684 17.1844 21.0557 17.2078 20.9226C17.2628 20.6105 17.3375 20.1863 17.2207 19.9071C17.0687 19.4563 16.8728 19.2136 16.7507 19.0625C16.6497 18.9375 16.5993 18.875 16.6658 18.809Z" fill="currentColor"></path></svg>}
                  <span>{tab}</span>
                </div></div></div></div>
              ))}
            </div></div></div></div></div>
            <div className="x-page-list">
              {[
                { level: "L0", items: ["0.3%", "0.09%", "0.027%", "0.0081%", "0.00243%", "0.000729%"] },
                { level: "L1", items: ["0.35%", "0.1225%", "0.042875%", "0.015006%", "0.005252%", "0.001838%"] },
                { level: "L2", items: ["0.375%", "0.140625%", "0.052734%", "0.019775%", "0.007416%", "0.002781%"] },
                { level: "L3", items: ["0.4%", "0.16%", "0.064%", "0.0256%", "0.01024%", "0.004096%"] },
                { level: "L4", items: ["0.425%", "0.180625%", "0.076766%", "0.032625%", "0.013866%", "0.005893%"] },
                { level: "L5", items: ["0.45%", "0.2025%", "0.091125%", "0.041006%", "0.018453%", "0.008304%"] },
                { level: "L6", items: ["0.5%", "0.25%", "0.125%", "0.0625%", "0.03125%", "0.015625%"] },
              ].map(group => (
                <div key={group.level} className="item">
                  <div className="title">Rebate level <span>{group.level}</span></div>
                  <div className="box">
                    {group.items.map((val, j) => (
                      <div key={j} className="li">
                        <svg className="svg-icon icon-round img img" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="9.4" fill="white" stroke="var(--main-color)" strokeWidth="1.2" />
                          <circle cx="10" cy="10" r="5" fill="var(--main-color)" />
                        </svg>
                        <div>
                          <span className="sum">{j + 1} level lower level commission rebate</span>
                          <span className="num">{val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "subordinate" ? (
          <div className="x-page">
            <div className="navbar"><div className="navbar-fixed"><div className="navbar__content"><div className="navbar__content-left" onClick={() => setActiveTab("referral")}><svg className="back-arrow" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></div><div className="navbar__content-center"><div className="navbar__content-title">New subordinates</div></div><div className="navbar__content-right"></div></div></div></div>
            <div className="bet-container-sticky"><div className="van-sticky"><div><div className="fun-tabs tabs"><div className="fun-tabs__tab-list">
              {["today", "yesterday", "thisMonth"].map((tab) => (
                <div key={tab} className="fun-tab-item funtab_item"><div className="fun-tab-item__wrap"><div className="fun-tab-item__label"><div className={`tab_item${tab === subDateFilter ? " tab_active" : ""}`} onClick={() => setSubDateFilter(tab)}>
                  <span>{tab === "today" ? "Today" : tab === "yesterday" ? "Yesterday" : "This Month"}</span>
                </div></div></div></div>
              ))}
            </div></div></div></div></div>
            <div className="x-page-list" style={{ padding: "10px" }}>
              {agencyTeam.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <img src={noDataImg} alt="No data" className="w-[150px] h-[139px] object-contain block mb-3" />
                  <p style={{ color: "#acafc2", fontSize: "13px", margin: 0 }}>No data</p>
                </div>
              ) : (
                <>
                  {agencyTeam.map((member) => (
                    <div key={member.userId} className="TeamReport__C-body-item">
                      <div className="TeamReport__C-body-item-head">
                        <span>UID:{member.userId}</span>
                      </div>
                      <div className="TeamReport__C-body-item-detail">
                        <div>Level <span>{(member.level ?? member.tier) === 1 ? "Direct subordinate" : `Level ${member.level ?? member.tier}`}</span></div>
                        <div>Mobile <span className="val-light">{member.mobile}</span></div>
                        <div>Register Time <span className="val-light">{member.registeredAt?.replace("T", " ").slice(0, 16)}</span></div>
                      </div>
                    </div>
                  ))}
                  <p style={{ color: "#acafc2", fontSize: "13px", textAlign: "center", padding: "10px 0", margin: 0 }}>No data</p>
                </>
              )}
            </div>
          </div>
        ) : activeTab === "rules" ? (
          <div className="x-page">
            <div className="navbar"><div className="navbar-fixed"><div className="navbar__content"><div className="navbar__content-left" onClick={() => setActiveTab("referral")}><svg className="back-arrow" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></div><div className="navbar__content-center"><div className="navbar__content-title">Invitation rules</div></div><div className="navbar__content-right"></div></div></div></div>
            <div className="x-page-list">
            <div className="rules-card">
              <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
              <div className="rules-card-title">01</div>
              <div className="rules-card-txt">
                <p>There are 6 subordinate levels in inviting friends, if A invites B, then B is a level 1 subordinate of A. If B invites C, then C is a level 1 subordinate of B and also a level 2 subordinate of A. If C invites D, then D is a level 1 subordinate of C, at the same time a level 2 subordinate of B and also a level 3 subordinate of A.</p>
              </div>
            </div>
            <div className="rules-card">
              <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
              <div className="rules-card-title">02</div>
              <div className="rules-card-txt">
                <p>When inviting friends to register, you must send the invitation link provided or enter the invitation code manually so that your friends become your level 1 subordinates.</p>
              </div>
            </div>
            <div className="rules-card">
              <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
              <div className="rules-card-title">03</div>
              <div className="rules-card-txt">
                <p>The invitee registers via the inviter's invitation code and completes the deposit, shortly after that the commission will be received immediately</p>
              </div>
            </div>
            <div className="rules-card">
              <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
              <div className="rules-card-title">04</div>
              <div className="rules-card-txt">
                <p>The calculation of yesterday's commission starts every morning at 01:00. After the commission calculation is completed, the commission is rewarded to the wallet and can be viewed through the commission collection record.</p>
              </div>
            </div>
            <div className="rules-card">
              <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
              <div className="rules-card-title">05</div>
              <div className="rules-card-txt">
                <p>Commission rates vary depending on your agency level on that day<br/>
                Number of Teams: How many downline deposits you have to date.<br/>
                Team Deposits: The total number of deposits made by your downline in one day.<br/>
                Team Deposit: Your downline deposits within one day.</p>
              </div>
            </div>
            <div className="rules-grade">
              <div className="rules-grade-th">
                <div className="item">Level</div>
                <div className="item">Number</div>
                <div className="item">Betting</div>
                <div className="item">Deposit</div>
              </div>
              <div className="rules-grade-tr">
                <div className="item">L0</div>
                <div className="item">0</div>
                <div className="item">0</div>
                <div className="item">0</div>
              </div>
              <div className="rules-grade-tr">
                <div className="item">L1</div>
                <div className="item">10</div>
                <div className="item">500K</div>
                <div className="item">100K</div>
              </div>
              <div className="rules-grade-tr">
                <div className="item">L2</div>
                <div className="item">15</div>
                <div className="item">1,000K</div>
                <div className="item">200K</div>
              </div>
              <div className="rules-grade-tr">
                <div className="item">L3</div>
                <div className="item">30</div>
                <div className="item">1,000K</div>
                <div className="item">500K</div>
              </div>
              <div className="rules-grade-tr">
                <div className="item">L4</div>
                <div className="item">45</div>
                <div className="item">5M</div>
                <div className="item">1,000K</div>
              </div>
              <div className="rules-grade-tr">
                <div className="item">L5</div>
                <div className="item">50</div>
                <div className="item">25M</div>
                <div className="item">5M</div>
              </div>
              <div className="rules-grade-tr">
                <div className="item">L6</div>
                <div className="item">60</div>
                <div className="item">100M</div>
                <div className="item">20M</div>
              </div>
            </div>
            <div className="rules-card">
              <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
              <div className="rules-card-title">06</div>
              <div className="rules-card-txt">
                The commission percentage depends on the membership level. The higher the membership level, the higher the bonus percentage. Different game types also have different payout percentages.
                <p>The commission rate is specifically explained as follows</p>
                <div className="txt" style={{ color: "#f2413b" }} onClick={() => setActiveTab("rebateratio")}>View rebate ratio &gt;&gt;</div>
              </div>
            </div>
            <div className="rules-card">
              <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
              <div className="rules-card-title">07</div>
              <div className="rules-card-txt">
                TOP20 commission rankings will be randomly awarded with a separate bonus
              </div>
            </div>
            <div className="rules-card">
              <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
              <div className="rules-card-title">08</div>
              <div className="rules-card-txt">
                The final interpretation of this activity belongs to 1xKING
              </div>
            </div>
            </div>
          </div>
        ) : (
          <>
            <div className="TeamReport__C">
              <div className="searchbar-container">
                <input type="text" className="searchbar-container__searchbar" placeholder="Search subordinate UID" value={searchUid} onChange={e => setSearchUid(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchAgencyTeam(1)} />
<GameButton variant="dark" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "64px", height: "32px", borderRadius: "19px", padding: "0", fontSize: "14px", minWidth: "64px", color: "rgba(255,255,255,0.7)" }} onClick={() => fetchAgencyTeam(1)} disabled={teamLoading}>{teamLoading ? "..." : <svg width="18" height="18" viewBox="0 0 1024 1024" fill="white"><path d="M956.8 905.6L723.2 672c54.4-64 86.4-147.2 86.4-236.8 0-204.8-166.4-371.2-371.2-371.2S67.2 230.4 67.2 435.2s166.4 371.2 371.2 371.2c89.6 0 172.8-32 236.8-86.4l233.6 233.6c6.4 6.4 16 9.6 25.6 9.6s19.2-3.2 25.6-9.6c12.8-12.8 12.8-32 0-44.8zM131.2 435.2c0-169.6 137.6-307.2 307.2-307.2s307.2 137.6 307.2 307.2-137.6 307.2-307.2 307.2-307.2-137.6-307.2-307.2z"></path></svg>}</GameButton>
              </div>
              <div className="TeamReport__C-head-line2">
                <div className="level-dropdown" onClick={() => setLevelOpen(o => !o)}>
                  <span>{levelVal}</span>
                  <svg width="12" height="12" viewBox="0 0 1024 1024"><path d="M884 311.6c-9.4-9.4-24.6-9.4-33.9 0L512 649.7 173.9 311.6c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l355.1 355.1c9.4 9.4 24.6 9.4 33.9 0L884 345.5c9.4-9.4 9.4-24.6 0-33.9z"></path></svg>
                </div>
                <div className="date-dropdown" onClick={() => setDateOpen(o => !o)}>
                  <span>{`${yr}-${String(mo).padStart(2,"0")}-${String(dd).padStart(2,"0")}`}</span>
                  <svg width="12" height="12" viewBox="0 0 1024 1024"><path d="M884 311.6c-9.4-9.4-24.6-9.4-33.9 0L512 649.7 173.9 311.6c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l355.1 355.1c9.4 9.4 24.6 9.4 33.9 0L884 345.5c9.4-9.4 9.4-24.6 0-33.9z"></path></svg>
                </div>
              </div>

              {teamLoading && !teamAggregation ? (
                <div className="header-container">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className="num skeleton-box" style={{ display: "inline-block", width: "60%", height: "18px", borderRadius: "4px", marginBottom: "6px" }}>&nbsp;</div>
                      <div className="label skeleton-box" style={{ display: "inline-block", width: "80%", height: "12px", borderRadius: "4px" }}>&nbsp;</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="header-container">
                  <div><span className="num">{teamAggregation?.depositCount ?? 0}</span><span className="label">Deposit number</span></div>
                  <div><span className="num">{teamAggregation?.depositAmount ?? 0}</span><span className="label">Deposit amount</span></div>
                  <div><span className="num">{teamAggregation?.bettorCount ?? 0}</span><span className="label">Number of bettors</span></div>
                  <div><span className="num">{teamAggregation?.betAmount ?? 0}</span><span className="label">Total bet</span></div>
                  <div><span className="num">{teamAggregation?.firstDepositCount ?? 0}</span><span className="label">First deposit number</span></div>
                  <div><span className="num">{teamAggregation?.firstDepositAmount ?? 0}</span><span className="label">First deposit amount</span></div>
                </div>
              )}

              {agencyTeam.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <img src={noDataImg} alt="No data" className="w-[150px] h-[139px] object-contain block mb-3" />
                  <p style={{ color: "#acafc2", fontSize: "13px", margin: 0 }}>No data</p>
                </div>
              ) : (
                <>
                  {agencyTeam.map((member) => (
                    <div key={member.userId} className="TeamReport__C-body-item">
                      <div className="TeamReport__C-body-item-head">
                        <span>UID:{member.userId}</span>
                      </div>
                      <div className="TeamReport__C-body-item-detail">
                        <div>Level <span>{member.tier === 1 ? "Direct subordinate" : `Level ${member.tier}`}</span></div>
                        <div>Deposit amount <span className="val-light">{member.totalDeposit ?? 0}</span></div>
                        <div>Mobile <span className="val-light">{member.mobile}</span></div>
                        <div>Register Time <span className="val-light">{member.registeredAt?.replace("T", " ").slice(0, 16)}</span></div>
                      </div>
                    </div>
                  ))}
                  {agencyTeam.length < teamTotal && (
                    <GameButton variant="dark" onClick={() => fetchAgencyTeam(teamPage + 1, true)} disabled={teamLoading} style={{ width: "100%", marginTop: "8px", height: "36px", borderRadius: "19px" }}>
                      {teamLoading ? "Loading..." : "Load more"}
                    </GameButton>
                  )}
                  <p style={{ color: "#acafc2", fontSize: "13px", textAlign: "center", padding: "10px 0", margin: 0 }}>No data</p>
                </>
              )}
            </div>

            {dateOpen && (
              <>
                <div className="van-overlay" onClick={() => setDateOpen(false)}></div>
                <div className="van-popup van-popup--round van-popup--bottom">
                  <div className="van-picker">
                    <div className="van-picker__toolbar">
                      <button type="button" className="van-picker__cancel" onClick={() => setDateOpen(false)}>Cancel</button>
                      <div className="van-picker__title">Choose a date</div>
                      <button type="button" className="van-picker__confirm" onClick={() => setDateOpen(false)}>Confirm</button>
                    </div>
                    <div className="van-picker__columns">
                      <div className="van-picker-column">
                        <div className="van-picker-column__wrapper" style={{ transform: `translateY(${-((yr - 2020) * 44) + 110}px)` }} onWheel={e => { e.preventDefault(); const step = Math.max(1, Math.round(Math.abs(e.deltaY) / 30)); setYr(y => Math.max(2020, Math.min(MAX_YR, y + (e.deltaY > 0 ? step : -step)))); }} onTouchStart={e => { e.currentTarget.dataset.touchY = e.touches[0].clientY; }} onTouchEnd={e => { const start = parseFloat(e.currentTarget.dataset.touchY||"0"); const diff = start - e.changedTouches[0].clientY; if (Math.abs(diff) > 10) { const step = Math.max(1, Math.round(Math.abs(diff) / 44)); setYr(y => Math.max(2020, Math.min(MAX_YR, y + (diff > 0 ? step : -step)))); } }}>
                          {(yrs => { return yrs.map(y => (
                            <div key={y} className={`van-picker-column__item${y === yr ? " van-picker-column__item--selected" : ""}`}>{String(y)}</div>
                          ))})(Array.from({ length: MAX_YR - 2020 + 1 }, (_, i) => 2020 + i))}
                        </div>
                      </div>
                      <div className="van-picker-column">
                        <div className="van-picker-column__wrapper" style={{ transform: `translateY(${-((mo - 1) * 44) + 110}px)` }} onWheel={e => { e.preventDefault(); const step = Math.max(1, Math.round(Math.abs(e.deltaY) / 20)); setMo(m => { const maxMo = yr >= MAX_YR ? MAX_MO : 12; return Math.max(1, Math.min(maxMo, m + (e.deltaY > 0 ? step : -step))); }); }} onTouchStart={e => { e.currentTarget.dataset.touchY = e.touches[0].clientY; }} onTouchEnd={e => { const start = parseFloat(e.currentTarget.dataset.touchY||"0"); const diff = start - e.changedTouches[0].clientY; if (Math.abs(diff) > 10) { const step = Math.max(1, Math.round(Math.abs(diff) / 30)); setMo(m => { const maxMo = yr >= MAX_YR ? MAX_MO : 12; return Math.max(1, Math.min(maxMo, m + (diff > 0 ? step : -step))); }); } }}>
                          {(months => { return months.map(m => (
                            <div key={m} className={`van-picker-column__item${m === mo ? " van-picker-column__item--selected" : ""}`}>{String(m).padStart(2, "0")}</div>
                          ))})(Array.from({ length: yr >= MAX_YR ? MAX_MO : 12 }, (_, i) => i + 1))}
                        </div>
                      </div>
                      <div className="van-picker-column">
                        <div className="van-picker-column__wrapper" style={{ transform: `translateY(${-((dd - 1) * 44) + 110}px)` }} onWheel={e => { e.preventDefault(); const step = Math.max(1, Math.round(Math.abs(e.deltaY) / 20)); setDd(d => { let maxDd = 31; if (yr === MAX_YR && mo === MAX_MO) maxDd = MAX_DD; else if ([4,6,9,11].includes(mo)) maxDd = 30; else if (mo === 2) maxDd = 28; return Math.max(1, Math.min(maxDd, d + (e.deltaY > 0 ? step : -step))); }); }} onTouchStart={e => { e.currentTarget.dataset.touchY = e.touches[0].clientY; }} onTouchEnd={e => { const start = parseFloat(e.currentTarget.dataset.touchY||"0"); const diff = start - e.changedTouches[0].clientY; if (Math.abs(diff) > 10) { const step = Math.max(1, Math.round(Math.abs(diff) / 30)); setDd(d => { let maxDd = 31; if (yr === MAX_YR && mo === MAX_MO) maxDd = MAX_DD; else if ([4,6,9,11].includes(mo)) maxDd = 30; else if (mo === 2) maxDd = 28; return Math.max(1, Math.min(maxDd, d + (diff > 0 ? step : -step))); }); } }}>
                          {(days => { return days.map(d => (
                            <div key={d} className={`van-picker-column__item${d === dd ? " van-picker-column__item--selected" : ""}`}>{String(d).padStart(2, "0")}</div>
                          ))})(Array.from({ length: (yr === MAX_YR && mo === MAX_MO) ? MAX_DD : [4,6,9,11].includes(mo) ? 30 : mo === 2 ? 28 : 31 }, (_, i) => i + 1))}
                        </div>
                      </div>
                      <div className="van-picker__mask"></div>
                      <div className="van-picker__frame"></div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {levelOpen && (
              <>
                <div className="van-overlay" onClick={() => setLevelOpen(false)}></div>
                <div className="van-popup van-popup--round van-popup--bottom">
                  <div className="van-picker">
                    <div className="van-picker__toolbar">
                      <button type="button" className="van-picker__cancel" onClick={() => setLevelOpen(false)}>Cancel</button>
                      <div className="van-picker__title">Select Level</div>
                      <button type="button" className="van-picker__confirm" onClick={() => setLevelOpen(false)}>Confirm</button>
                    </div>
                    <div className="van-picker__columns">
                      <div className="van-picker-column">
                        <div className="van-picker-column__wrapper" style={{ transform: `translateY(${-((levelVal === "All" ? 0 : levelVal === "Level 1" ? 1 : levelVal === "Level 2" ? 2 : 3) * 44) + 110}px)` }} onWheel={e => { e.preventDefault(); const opts = ["All","Level 1","Level 2","Level 3"]; const idx = opts.indexOf(levelVal); const next = Math.max(0, Math.min(3, idx + (e.deltaY > 0 ? 1 : -1))); setLevelVal(opts[next]); }} onTouchStart={e => { e.currentTarget.dataset.touchY = e.touches[0].clientY; }} onTouchEnd={e => { const start = parseFloat(e.currentTarget.dataset.touchY||"0"); const diff = start - e.changedTouches[0].clientY; if (Math.abs(diff) > 10) { const opts = ["All","Level 1","Level 2","Level 3"]; const idx = opts.indexOf(levelVal); const next = Math.max(0, Math.min(3, idx + (diff > 0 ? 1 : -1))); setLevelVal(opts[next]); } }}>
                          {["All", "Level 1", "Level 2", "Level 3"].map(opt => (
                            <div key={opt} className={`van-picker-column__item${opt === levelVal ? " van-picker-column__item--selected" : ""}`}>{opt}</div>
                          ))}
                        </div>
                      </div>
                      <div className="van-picker__mask"></div>
                      <div className="van-picker__frame"></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Earn;
