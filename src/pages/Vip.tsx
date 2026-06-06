import { useEffect, useMemo, useRef, useState } from "react";
import { useTransitionNavigate } from "@/providers/NavigationProvider";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { GameButton } from "@/components/GameButton";
import { GameCard } from "@/components/GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import upgradeIcon from "@/assets/vip/upgrade-icon.png";
import lockIcon from "@/assets/vip/lockicon.png";
import checkinIcon from "@/assets/vip/checkin-icon.png";

import cardBg1 from "@/assets/vip/vip-card-bg-1.png";
import cardBg2 from "@/assets/vip/vip-card-bg-2.png";
import cardBg3 from "@/assets/vip/vip-card-bg-3.png";
import cardBg4 from "@/assets/vip/vip-card-bg-4.png";

import badge1 from "@/assets/vip/vip-badge-1.png";
import badge2 from "@/assets/vip/vip-badge-2.png";
import badge3 from "@/assets/vip/vip-badge-3.png";
import badge4 from "@/assets/vip/vip-badge-4.png";
import badge5 from "@/assets/vip/vip-badge-5.png";

import level1 from "@/assets/vip/vip-level-1.png";
import level2 from "@/assets/vip/vip-level-2.png";
import level3 from "@/assets/vip/vip-level-3.png";
import level4 from "@/assets/vip/vip-level-4.png";
import level5 from "@/assets/vip/vip-level-5.png";

const CARD_BGS = [cardBg1, cardBg2, cardBg3, cardBg4];

const getCardBg = (lv: number) => {
  if (lv <= 2) return CARD_BGS[0];
  if (lv <= 4) return CARD_BGS[1];
  if (lv <= 5) return CARD_BGS[2];
  return CARD_BGS[3];
};

const BADGES = [badge1, badge2, badge3, badge4, badge5];

const getBadge = (lv: number) => BADGES[Math.min(lv - 1, BADGES.length - 1)];

const LEVEL_IMGS = [level1, level2, level3, level4, level5];

const getLevelImg = (lv: number) => LEVEL_IMGS[Math.min(lv - 1, LEVEL_IMGS.length - 1)];

const VIP_TIERS = [
  { level: "VIP 1", minDeposit: 0, weeklyBonus: 0, upgradeBonus: 0, weeklyRequirement: 0 },
  { level: "VIP 2", minDeposit: 100, weeklyBonus: 0, upgradeBonus: 0, weeklyRequirement: 0 },
  { level: "VIP 3", minDeposit: 2000, weeklyBonus: 21, upgradeBonus: 15, weeklyRequirement: 200 },
  { level: "VIP 4", minDeposit: 5000, weeklyBonus: 41, upgradeBonus: 31, weeklyRequirement: 300 },
  { level: "VIP 5", minDeposit: 25000, weeklyBonus: 151, upgradeBonus: 90, weeklyRequirement: 400 },
  { level: "VIP 6", minDeposit: 100000, weeklyBonus: 551, upgradeBonus: 900, weeklyRequirement: 1000 },
];

const Vip = () => {
  const { goBack, navigateWithTransition } = useTransitionNavigate();
  const { userId, refresh: refreshProfile } = useProfile();
  const { toast } = useToast();

  const [vipData, setVipData] = useState<import("@/services/authService").VipResponse | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [weeklyDialogOpen, setWeeklyDialogOpen] = useState(false);
  const [visibleTierIdx, setVisibleTierIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const fmt = (value: number | string | null | undefined) => {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  };

  const vipLevelStr = vipData?.vipLevel ?? "";
  const currentTierIndex = Math.max(0, VIP_TIERS.findIndex((t) => {
    const num = parseInt(vipLevelStr.replace(/\D/g, ""));
    return t.level === `VIP ${num}`;
  }));

  const currentTier = VIP_TIERS[currentTierIndex] || VIP_TIERS[0];
  const nextTier = VIP_TIERS[currentTierIndex + 1] || VIP_TIERS[VIP_TIERS.length - 1];

  const totalDeposits = Number(vipData?.totalDeposits ?? 0);
  const nextThreshold = currentTierIndex < VIP_TIERS.length - 1
    ? nextTier.minDeposit
    : currentTier.minDeposit;

  const visibleTierKey = VIP_TIERS[visibleTierIdx]?.level ?? vipLevelStr;
  const visibleTierInfo = vipData?.vipLevels?.[visibleTierKey];
  const canClaimWeekly = vipData?.weeklyStatus === "eligible";
  const canClaimUpgrade = vipData?.upgradeStatus === "unclaimed";

  const loadVip = async (isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    try {
      const data = await authService.getVip();
      setVipData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load VIP data";
      toast({ description: msg, variant: "destructive" });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadVip(true);
  }, []);

  useEffect(() => {
    setVisibleTierIdx(currentTierIndex);
    if (trackRef.current && currentTierIndex >= 0) {
      const card = trackRef.current.children[currentTierIndex] as HTMLElement;
      if (card) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }, 100);
      }
    }
  }, [vipData]);

  const handleClaimWeekly = async () => {
    if (busy || !canClaimWeekly) return;
    setBusy(true);
    try {
      const res = await authService.claimWeeklyBonus();
      toast({ description: `Weekly bonus ₹${fmt(res.weeklyBonus)} credited! Balance: ₹${fmt(res.balanceAfter)}` });
      await loadVip();
      refreshProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Claim failed";
      toast({ description: msg, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleWeeklyClick = () => {
    if (busy) return;
    if (canClaimWeekly) {
      handleClaimWeekly();
    } else if (vipData?.weeklyStatus === "deposit_not_met") {
      setWeeklyDialogOpen(true);
    }
  };

  const handleClaimUpgrade = async () => {
    if (busy || !canClaimUpgrade) return;
    setBusy(true);
    try {
      const res = await authService.claimUpgradeBonus();
      toast({ description: `Upgrade bonus ₹${fmt(res.upgradeBonus)} credited! Balance: ₹${fmt(res.balanceAfter)}` });
      await loadVip();
      refreshProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Claim failed";
      toast({ description: msg, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const vipTableRows = useMemo(() => {
    const levels = vipData?.vipLevels;
    return VIP_TIERS.map((tier) => {
      const info = levels?.[tier.level];
      return {
        level: tier.level,
        deposit: info ? `₹${fmt(info.minDeposit)}` : `₹${fmt(tier.minDeposit)}`,
        weeklyBonus: info ? `₹${fmt(info.weeklyBonus)}` : `₹${fmt(tier.weeklyBonus)}`,
        upgradeBonus: info ? `₹${fmt(info.upgradeBonus)}` : `₹${fmt(tier.upgradeBonus)}`,
      };
    });
  }, [vipData]);

  return (
    <>
      {/* SIMPLE NAVBAR HEADER matching Earn.tsx invitation sub-pages */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "var(--app-max-width)",
          height: "46px",
          background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)",
          color: "#fff",
          zIndex: 101,
          boxSizing: "border-box",
          userSelect: "none",
          WebkitUserSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => goBack()}
          style={{
            position: "absolute",
            left: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            color: "#fff",
          }}
        >
          <svg style={{ width: "20px", height: "20px", fill: "none", stroke: "currentColor" }} viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span style={{ fontSize: "18px", fontWeight: 400, color: "#fff", textAlign: "center" }}>VIP</span>
      </div>

      {/* BODY */}
      <div className="pt-[52px] flex-1 px-4 pb-24 space-y-3 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {initialLoading ? (
          <div className="space-y-4 pt-4">
            <Skeleton className="w-full h-[181.6px] rounded-xl bg-white/10" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-32 rounded-xl bg-white/10" />
              <Skeleton className="h-32 rounded-xl bg-white/10" />
            </div>
            <Skeleton className="w-40 h-5 bg-white/10 mx-auto" />
            <Skeleton className="w-full h-64 rounded-xl bg-white/10" />
          </div>
        ) : (
        <>
        <style>{`.vip-scroll-track::-webkit-scrollbar { display: none; } body::-webkit-scrollbar, .overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
        {/* VIP CARDS - Exact clone from test.html */}
        <div className="py-2">
          <div
            ref={sliderRef}
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              height: "181.6px",
              padding: "0 0 0 0",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <div
              ref={trackRef}
              className="flex vip-scroll-track"
              onScroll={() => {
                const el = trackRef.current;
                if (!el) return;
                const center = el.scrollLeft + el.clientWidth / 2;
                const cardW = 341.55;
                const idx = Math.round((center - cardW / 2) / cardW);
                setVisibleTierIdx(Math.max(0, Math.min(idx, VIP_TIERS.length - 1)));
              }}
              style={{
                height: "181.6px",
                transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                cursor: "grab",
                overflowX: "auto",
                overflowY: "hidden",
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {VIP_TIERS.map((tier, idx) => {
                const isCurrent = idx === currentTierIndex;
                const tierDeposit = tier.minDeposit;
                const nextTierMin = VIP_TIERS[idx + 1]?.minDeposit ?? tierDeposit;
                const cardNextThreshold = idx < VIP_TIERS.length - 1 ? VIP_TIERS[idx + 1].minDeposit : tierDeposit;
                const progressWidth = isCurrent
                  ? (nextThreshold > 0 ? Math.min((totalDeposits / nextThreshold) * 100, 100) : 100)
                  : (cardNextThreshold > tierDeposit ? Math.min((tierDeposit / cardNextThreshold) * 100, 100) : 100);
                const depositDisplay = isCurrent
                  ? fmt(totalDeposits)
                  : fmt(tierDeposit);
                const cardProgressDisplay = isCurrent
                  ? fmt(totalDeposits)
                  : fmt(tierDeposit);
                const cardNextDisplay = fmt(cardNextThreshold);

                return (
                  <div
                    key={tier.level}
                    className="snap-start"
                    style={{
                      display: "block",
                      position: "relative",
                      width: "341.55px",
                      height: "181.6px",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={getBadge(idx + 1)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "16.5px",
                        zIndex: 3,
                        width: "auto",
                        height: "138.6px",
                        objectFit: "scale-down",
                      }}
                    />
                    <img
                      src={getLevelImg(idx + 1)}
                      style={{
                        position: "absolute",
                        right: "55px",
                        top: "35.2px",
                        zIndex: 3,
                        height: "57.2px",
                        width: "auto",
                        objectFit: "scale-down",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "305.03px",
                        height: "181.6px",
                        margin: "0 18.26px",
                        padding: "10px 0 0",
                        boxSizing: "border-box",
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      {/* Card background */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${getCardBg(idx + 1)})`,
                          backgroundSize: "100% 100%",
                          backgroundPosition: "0% 100%",
                        }}
                      />

                      {/* Spacer for top area (icons) */}
                      <div style={{ height: "117.21px", position: "relative", zIndex: 2 }} />

                      {/* progress-box */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "305.03px",
                          margin: "-5px 0 0 0",
                          padding: 0,
                          color: "#4d5461",
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            textAlign: "center",
                            fontSize: "12px",
                            marginBottom: "5px",
                            color: "#4d5461",
                          }}
                        >
                          Accumulate Deposit <b style={{ color: "inherit" }}>{depositDisplay}</b>
                        </span>
                        {isCurrent && (
                        <div
                          style={{
                            display: "flex",
                            position: "relative",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "259.49px",
                            height: "14px",
                            backgroundColor: "#79808f",
                            borderRadius: "7px",
                            color: "#fff",
                            fontSize: "10px",
                            padding: "0 10px",
                            boxSizing: "border-box",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              width: `${progressWidth}%`,
                              height: "100%",
                              backgroundColor: "#fc8618",
                              borderRadius: "7px",
                              zIndex: 1,
                              transition: "width 0.3s ease",
                            }}
                          />
                          <span style={{ position: "relative", zIndex: 2 }}>V{idx + 1}</span>
                          <span style={{ position: "relative", zIndex: 2 }}>
                            {`${cardProgressDisplay} / ${cardNextDisplay}`}
                          </span>
                          <span style={{ position: "relative", zIndex: 2 }}>V{idx + 2}</span>
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BONUS CARDS - Grid of 2 */}
        <div className="grid grid-cols-2 gap-3">
          <GameCard className="p-0 overflow-hidden">
            <div className="flex flex-col items-center p-3 gap-2">
              <img src={checkinIcon} alt="Weekly" className="w-10 h-10 object-contain" />
              <span className="text-white text-xs">Weekly Bonus</span>
              <span className="text-yellow-400 text-sm font-semibold">₹{fmt(visibleTierInfo?.weeklyBonus)}</span>
              <GameButton
                variant={visibleTierIdx === currentTierIndex && visibleTierIdx > 1 && (canClaimWeekly || vipData?.weeklyStatus === "deposit_not_met") ? "gold" : "mute"}
                style={{
                  height: "26px",
                  fontSize: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  borderRadius: "13px",
                  width: "100%",
                }}
                onClick={handleWeeklyClick}
                disabled={busy || visibleTierIdx !== currentTierIndex || visibleTierIdx <= 1 || (vipData?.weeklyStatus !== "eligible" && vipData?.weeklyStatus !== "deposit_not_met")}
              >
                {busy ? "..." : visibleTierIdx === currentTierIndex && visibleTierIdx > 1 && (canClaimWeekly || vipData?.weeklyStatus === "deposit_not_met") ? "Claim" : visibleTierIdx === currentTierIndex && vipData?.weeklyStatus === "claimed" ? "Claimed" : <img src={lockIcon} className="w-4 h-4" />}
              </GameButton>
            </div>
          </GameCard>
          <GameCard className="p-0 overflow-hidden">
            <div className="flex flex-col items-center p-3 gap-2">
              <img src={upgradeIcon} alt="Upgrade" className="w-10 h-10 object-contain" />
              <span className="text-white text-xs">Upgrade Bonus</span>
              <span className="text-yellow-400 text-sm font-semibold">₹{fmt(visibleTierInfo?.upgradeBonus)}</span>
              <GameButton
                variant={visibleTierIdx === currentTierIndex && visibleTierIdx > 1 && canClaimUpgrade ? "gold" : "mute"}
                style={{
                  height: "26px",
                  fontSize: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  borderRadius: "13px",
                  width: "100%",
                }}
                onClick={handleClaimUpgrade}
                disabled={busy || visibleTierIdx !== currentTierIndex || visibleTierIdx <= 1 || !canClaimUpgrade}
              >
                {busy ? "..." : visibleTierIdx === currentTierIndex && visibleTierIdx > 1 && canClaimUpgrade ? "Claim" : visibleTierIdx === currentTierIndex && vipData?.upgradeStatus === "claimed" ? "Claimed" : <img src={lockIcon} className="w-4 h-4" />}
              </GameButton>
            </div>
          </GameCard>
        </div>

        {/* VIP LEVEL LIST */}
        <GameCard className="p-3 space-y-3">
          <h2 className="text-white text-center font-semibold">VIP LEVEL LIST</h2>

          <div className="rounded-xl overflow-hidden text-sm">
            <div className="grid grid-cols-4 gap-3 px-[7px] py-2 text-[11px] text-gray-200 font-semibold">
              <span className="text-center">Level</span>
              <span className="text-center">Min Deposit</span>
              <span className="text-center">Weekly Bonus</span>
              <span className="text-center">Upgrade Bonus</span>
            </div>

            {vipTableRows.map((row, ridx) => {
              const lvNum = ridx + 1;
              return (
              <div
                key={row.level}
                className="grid grid-cols-4 gap-3 px-[7px] py-3 items-center border-t border-white/10"
              >
                <div className="flex justify-center">
                  <div className="relative h-8" style={{ width: lvNum === 6 ? "72px" : "64px" }}>
                    <img src={getBadge(lvNum)} className="w-full h-full object-contain" />
                  </div>
                </div>
                <span className="text-yellow-300 text-center">{row.deposit}</span>
                <span className="text-yellow-300 text-center">{row.weeklyBonus}</span>
                <span className="text-yellow-300 text-center">{row.upgradeBonus}</span>
              </div>
              );
            })}
          </div>
        </GameCard>
        </>
        )}
      </div>

      <Dialog open={weeklyDialogOpen} onOpenChange={setWeeklyDialogOpen}>
        <DialogContent className="bg-[#1a0a0e] border border-[#3a1520] text-white w-[85%] max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-yellow-400">Insufficient Deposit</DialogTitle>
            <DialogDescription className="text-center text-gray-300 pt-2">
              You need to deposit at least <span className="text-yellow-400 font-semibold">₹{fmt(visibleTierInfo?.weeklyDepositRequirement)}</span> this week to claim the weekly bonus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-3 pt-2">
            <GameButton
              variant="mute"
              style={{ flex: 1, height: "36px", borderRadius: "18px", fontSize: "13px" }}
              onClick={() => setWeeklyDialogOpen(false)}
            >
              Cancel
            </GameButton>
            <GameButton
              variant="gold"
              style={{ flex: 1, height: "36px", borderRadius: "18px", fontSize: "13px" }}
              onClick={() => {
                setWeeklyDialogOpen(false);
                navigateWithTransition("/bank");
              }}
            >
              Deposit
            </GameButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Vip;
