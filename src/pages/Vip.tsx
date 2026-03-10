import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { GameButton } from "@/components/GameButton";
import { GameCard } from "@/components/GameCard";
import Loader from "@/components/Loader";

import avatar from "@/assets/profile/avatar.png";
import vipBadge from "@/assets/profile/vip-badge.png";
import vipRedBg from "@/assets/vip/vip-header-bg.png";
import vipGoldCardBg from "@/assets/vip/vip-gold-card-bg.png";
import upgradeIcon from "@/assets/vip/upgrade-icon.png";
import checkinIcon from "@/assets/vip/checkin-icon.png";
import svipIcon from "@/assets/vip/svip-icon.png";
import backArrow from "@/assets/icons/close-icon.png";
import svipBgIcon from "@/assets/vip/Svip-bg-icon.png";


const Vip = () => {
  const navigate = useNavigate();
  const { userId, refresh: refreshProfile } = useProfile();
  const { toast } = useToast();

  const [vipData, setVipData] = useState<import("@/services/authService").VipResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [vipTab, setVipTab] = useState("privilege");

  const VIP_THRESHOLDS = [0, 200, 400, 1000, 2000, 3000];

  const fmt = (value: number | string | null | undefined) => {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  };

  const vipLevel = vipData?.vipLevel ?? 0;
  const totalDeposits = Number(vipData?.totalDeposits ?? 0);
  const nextThreshold = vipLevel >= VIP_THRESHOLDS.length - 1 ? totalDeposits : VIP_THRESHOLDS[vipLevel + 1];
  const progressPercent = nextThreshold > 0 ? Math.min((totalDeposits / nextThreshold) * 100, 100) : 0;
  const upgradeDepositAmount = Math.max(0, nextThreshold - totalDeposits);

  const canClaim = Boolean(vipData?.canClaimMonthly || vipData?.canClaimUpgrade);

  const loadVip = async () => {
    setLoading(true);
    try {
      const data = await authService.getVip();
      setVipData(data);
    } catch (err: any) {
      toast({ description: err?.message || "Failed to load VIP data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVip();
  }, []);

  const handleUpgrade = async () => {
    if (busy || upgradeDepositAmount <= 0) return;
    setBusy(true);
    try {
      const res = await authService.deposit(upgradeDepositAmount);
      if (res.paymentUrl) {
        navigate("/payment", { state: { paymentUrl: res.paymentUrl } });
        toast({ description: "Opening payment..." });
      } else {
        toast({ description: res.msg || "Deposit initiated", variant: "destructive" });
      }
      refreshProfile();
    } catch (err: any) {
      toast({ description: err?.message || "Deposit failed", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleClaim = async () => {
    if (busy || !canClaim) return;
    setBusy(true);
    try {
      const res = await authService.checkinVip();
      toast({
        description: `Credited ₹${fmt(res.totalCredited)} (monthly ₹${fmt(res.monthlyBonus)} + upgrade ₹${fmt(res.upgradeBonus)})`,
      });
      await loadVip();
      refreshProfile();
    } catch (err: any) {
      toast({ description: err?.message || "Claim failed", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const vipTableRows = useMemo(() => {
    if (vipTab === "privilege") {
      return [
        { level: "VIP 1", deposit: "₹200", withdraw: "₹500" },
        { level: "VIP 2", deposit: "₹400", withdraw: "₹1000" },
        { level: "VIP 3", deposit: "₹1000", withdraw: "₹2000" },
        { level: "VIP 4", deposit: "₹2000", withdraw: "₹3000" },
        { level: "SVIP 1", deposit: "₹3000", withdraw: "Unlimited", icon: svipIcon },
      ];
    }

    return [
      { level: "VIP 1", checkin: "₹160", upgrade: "₹10" },
      { level: "VIP 2", checkin: "₹160", upgrade: "₹20" },
      { level: "VIP 3", checkin: "₹240", upgrade: "₹30" },
      { level: "VIP 4", checkin: "₹240", upgrade: "₹40" },
      { level: "SVIP 1", checkin: "₹400", upgrade: "₹50", icon: svipIcon },
    ];
  }, [vipTab]);

  return (
    <>
      {(loading || busy) && <Loader overlay label={loading ? "Loading VIP..." : "Processing..."} />}
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 h-48">
        <img src={vipRedBg} className="absolute bg-red-950 inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 " />

        <div className="relative z-10 flex  flex-col h-full">

          {/* TITLE */}
          <div className="flex items-center   justify-center relative py-3">
            <button
              onClick={() => navigate(-1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
            >
              <img src={backArrow} className="w-5 h-5" />
            </button>

            <h1 className="text-white ">VIP</h1>
          </div>

          {/* GOLD CARD */}
          <div className=" absolute  bottom-0  mt-16 w-full">
            <img src={vipGoldCardBg} className="absolute inset-0 p-2 rounded-lg w-full h-full object-cover" />

            <div className="relative z-10 flex flex-col">

              <div className="flex items-center">
                <div className="w-12 h-12 m-4 rounded-full overflow-hidden border-2">
                  <img src={avatar} className="w-full h-full object-cover" />
                </div>

                <div>
                
                  <p className="text-[#3a1a00] font-bold text-base">
                    User{userId }   
                  </p>

                  <div className="relative w-16 h-6 mt-1">
                    <img src={vipBadge} className="w-full h-full object-contain" />
                    <span className="absolute inset-0 flex items-center justify-center pl-3 pt-1 text-[10px] font-bold text-white">
                     {vipLevel}
                    </span>
                  </div>
                
                </div>
              </div>

              {/* PROGRESS */}
              <div className="flex items-center m-4 gap-3">

                <div className="flex-1">
                  <div className="flex justify-center mb-1">
                    <div className="bg-[#5a3000]/30 rounded-full px-3 py-0.5 text-xs text-[#5a2900] font-semibold border border-yellow-800/30">
                      ₹{fmt(totalDeposits)} / ₹{fmt(nextThreshold)}
                    </div>
                  </div>

                  <Progress
                    value={progressPercent}
                    className="h-2 bg-[#8a5a10]/40 [&>div]:bg-[#5a3000]"
                  />
                </div>

                <GameButton
                  variant="gold"
                  size="sm"
                  className="h-8 w-24"
                  onClick={handleUpgrade}
                  disabled={busy || upgradeDepositAmount <= 0}
                >
                  {busy ? "Processing" : upgradeDepositAmount > 0 ? "Upgrade" : "Maxed"}
                </GameButton>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      {/* Scrollable content below header */}
      <div className="pt-[38vh] flex-1 px-4 pb-24 space-y-3 overflow-y-auto">
        <GameCard className="p-0 overflow-hidden">
          <div className="flex items-center p-3 gap-3">
            <img src={upgradeIcon} alt="Upgrade" className="w-14 h-12 object-contain flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">Upgrade VIP{vipLevel} → VIP{Math.min(vipLevel + 1, 5)}</p>
              <p className="text-gray-300 text-xs">
                Deposit {upgradeDepositAmount > 0 ? `₹${upgradeDepositAmount.toLocaleString()}` : "—"} to reach next level
              </p>
            </div>
            <GameButton
              variant="mute"
              size="sm"
              className="text-xs h-7 w-20 border border-[rgba(183,69,83,0.5)] flex-shrink-0"
              onClick={handleUpgrade}
              disabled={busy || upgradeDepositAmount <= 0}
            >
              {busy ? "Processing" : upgradeDepositAmount > 0 ? "Upgrade" : "Maxed"}
            </GameButton>
          </div>
        </GameCard>

        <GameCard className="p-0 overflow-hidden">
          <div className="flex items-center p-3 gap-3">
            <img src={checkinIcon} alt="Check-In" className="w-12 h-12 object-contain flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">VIP Bonus</p>
              <p className="text-gray-300 text-xs">
                Upgrade bonus <span className="text-yellow-400 ">₹{(vipData?.pendingUpgradeBonus ?? 0).toLocaleString()}</span>
              </p>
              <p className="text-gray-300 text-xs">
                Monthly bonus <span className="text-yellow-400 ">₹{(vipData?.monthlyCheckinBonus ?? 0).toLocaleString()}</span>
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1 flex-shrink-0 min-w-[70px]">
              <span className="text-yellow-400  ">
                ₹{(((vipData?.pendingUpgradeBonus ?? 0) + (vipData?.monthlyCheckinBonus ?? 0)).toLocaleString())}
              </span>
              <GameButton
                variant="mute"
                size="sm"
                className="text-xs h-6 w-14 border border-[rgba(183,69,83,0.5)]"
                onClick={handleClaim}
                disabled={busy || !canClaim}
              >
                {busy ? "Processing" : canClaim ? "Claim" : "Claimed"}
              </GameButton>
            </div>
          </div>
        </GameCard>

        <GameCard className="p-0 overflow-hidden">
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-3">
              <img src={svipIcon} alt="SVIP" className="w-12 h-12 object-contain flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate"> Become SVIP </p>
                <p className="text-gray-300 text-xs">To get daily unlimited withdrwal </p>
              </div>
            </div>
            <GameButton variant="red" size="sm" className="w-full h-10 mt-2" onClick={() => navigate("/bank")}>
              Deposit
            </GameButton>
          </div>
        </GameCard>


        {/* VIP LEVEL LIST */}
        <GameCard className="p-3 space-y-3">

          <h2 className="text-white text-center font-semibold">
            VIP LEVEL LIST
          </h2>

          {/* TABS (BANK STYLE) */}
          <div className="flex gap-1 bg-[#3a0f16] p-1 rounded-full">

            <button
              onClick={() => setVipTab("privilege")}
              className="flex-1 h-8 rounded-full text-sm"
              style={
                vipTab === "privilege"
                  ? { background: "#000", color: "#fff" }
                  : { color: "rgba(255,255,255,0.6)" }
              }
            >
              VIP Privilege
            </button>

            <button
              onClick={() => setVipTab("bonus")}
              className="flex-1 h-8 rounded-full text-sm"
              style={
                vipTab === "bonus"
                  ? { background: "#000", color: "#fff" }
                  : { color: "rgba(255,255,255,0.6)" }
              }
            >
              Bonus
            </button>

          </div>

          {/* TABLE */}
          <div className="bg-[#6c1c2b] rounded-xl overflow-hidden text-sm">

            {/* HEADER */}
            <div className="grid grid-cols-3 px-3 py-2 text-[11px] text-gray-200 font-semibold">
              <span>VIP Level</span>
              <span>{vipTab === "privilege" ? "Deposit" : "Monthly Bonus"}</span>
              <span>{vipTab === "privilege" ? "Today withdrawn" : "Upgrade Reward"}</span>
            </div>

            {/* ROWS */}
            {vipTableRows.map((row) => (
              <div
                key={row.level}
                className="grid grid-cols-3 px-3 py-3 items-center bg-[#7c2234] border-t border-[#9a3a4d]"
              >

                {/* VIP BADGE */}
                <div className="flex items-center gap-2">

                  {row.level.includes("SVIP") ? (
                    <div className="relative  w-18 h-8 "><img src={svipBgIcon} className="w-full h-full object-contain" />
                     <span className="absolute inset-0 flex items-center justify-center pl-8 text-[9px] font-bold text-white">
                       SVIP
                      </span>
                    </div>
                    
                  ) : (
                    <div className="relative  w-16 h-6">
                      <img src={vipBadge} className="w-full h-full object-contain" />
                      <span className="absolute inset-0 flex items-center justify-center pl-4 text-[9px] font-bold text-white">
                        {row.level}
                      </span>
                    </div>
                  )}

                </div>

                <span className="text-yellow-300">
                  {vipTab === "privilege" ? row.deposit : row.checkin}
                </span>

                <span className="text-yellow-300">
                  {vipTab === "privilege" ? row.withdraw : row.upgrade}
                </span>

              </div>
            ))}

          </div>

        </GameCard>

      </div>
    </>
  );
};

export default Vip;