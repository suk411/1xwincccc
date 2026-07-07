import { useEffect, useState, useRef, useMemo, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import { useTransitionNavigate } from "@/providers/NavigationProvider";

import { GameCard } from "@/components/GameCard";
import headerBg from "@/assets/bank/header-bg.png";
import bankIcon from "@/assets/bank/bank-icon.png";
import depositBadge from "@/assets/bank/deposit-badge.png";
import upiLogo from "@/assets/bank/upi-logo.jpg";
import usdtLogo from "@/assets/bank/usdt-logo.png";
import upayLogo from "@/assets/bank/upay-logo.png";
import bankLogo from "@/assets/bank/bank-logo.png";
import addDetailsPlusIcon from "@/assets/bank/adddetils-plusicon.png";
import giftBox from "@/assets/bank/gift-box-small.png";
import eventBg from "@/assets/bank/event-bg.png";
import { ClipboardCheck, X } from "lucide-react";
import AddAccountDialog, { type BankAccount } from "@/components/bank/AddAccountDialog";
import { GameButton } from "@/components/GameButton";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { GameDialog, GameDialogBody, GameDialogContent, GameDialogFooter } from "@/components/GameDialog";

const BASE_DEPOSIT_AMOUNTS = [100, 200, 300, 500, 1000, 2000, 3000, 5000, 8000, 10000];
const FORMATTED_BASE_DEPOSIT = BASE_DEPOSIT_AMOUNTS.map(a => ({ value: a, label: a.toLocaleString() }));

const USDT_OPTIONS = [
  { deposit: 50, bonus: 0 },
  { deposit: 100, bonus: 0 },
  { deposit: 200, bonus: 0 },
  { deposit: 500, bonus: 0 },
  { deposit: 1000, bonus: 0 },
  { deposit: 2000, bonus: 0 },
];
const FORMATTED_USDT = USDT_OPTIONS.map(o => ({ ...o, label: o.deposit.toLocaleString() }));

const WITHDRAW_AMOUNTS = [110, 200, 500, 1000, 2000, 3000, 5000, 10000];
const FORMATTED_WITHDRAW = WITHDRAW_AMOUNTS.map(a => ({ value: a, label: a.toLocaleString() }));

const CACHE_KEY = "withdraw_info_cache";

const loadCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const saveCache = (data: any) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
};

// --- Memoized Sub-Components ---

interface DepositAmountGridProps {
  depositAmounts: number[];
  selectedAmount: number;
  customAmount: string;
  bonusOptIn: boolean;
  bonusFade: 'entering' | 'exiting' | null;
  getBonus: (amount: number) => number;
  onSelect: (amount: number) => void;
}

const DepositAmountGrid = memo(({ depositAmounts, selectedAmount, customAmount, bonusOptIn, bonusFade, getBonus, onSelect }: DepositAmountGridProps) => {
  const formattedAmounts = useMemo(() => {
    return depositAmounts.map(amount => {
      const pre = FORMATTED_BASE_DEPOSIT.find(f => f.value === amount);
      return {
        value: amount,
        label: pre ? pre.label : amount.toLocaleString(),
        bonus: getBonus(amount),
      };
    });
  }, [depositAmounts, getBonus]);

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {formattedAmounts.map(({ value, label, bonus }) => {
        const isActive = !customAmount && selectedAmount === value;
      return (
          <div
            key={value}
            onClick={() => onSelect(value)}
            className="relative rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-200"
            style={{
              background: isActive
                ? "linear-gradient(180deg, #5b0116 0%, #35030c 100%)"
                : "rgba(211, 54, 93, 0.2)",
              border: isActive
                ? "1.5px solid rgba(255, 180, 50, 0.6)"
                : "1px solid rgba(255,255,255,0.1)",
              boxShadow: isActive ? "0 0 8px rgba(255, 150, 30, 0.2)" : "none",
            }}
          >
            <span className="text-sm text-center pt-2.5 pb-1 font-medium" style={{
              backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}>{label}</span>
            {bonus > 0 && (
              <div style={{
                maxHeight: (bonusOptIn || bonusFade !== null) ? '30px' : '0px',
                opacity: (bonusOptIn || bonusFade !== null) ? 1 : 0,
                transition: 'max-height 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
              }}>
                {(bonusOptIn || bonusFade !== null) && (
                  <div
                    className="text-center text-[10px] font-bold rounded-b-md py-0.5"
                    style={{
                      animation: bonusFade === 'entering'
                        ? 'slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1) both'
                        : (bonusFade === 'exiting' ? 'slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none'),
                      backgroundImage: isActive
                        ? "linear-gradient(156deg, rgb(255, 180, 50) 0%, rgb(255, 140, 40) 100%)"
                        : "linear-gradient(156deg, rgb(255, 213, 103) 0%, rgb(255, 167, 74) 98%)",
                      color: "#5a2d0a"
                    }}
                  >
                    +{bonus}
                  </div>
                )}
              </div>
            )}
          </div>
      );
    })}
    </div>
  );
});

interface PaymentChannelListProps {
  channels: { id: string; label: string; icon?: string }[];
  activeChannel: string;
  activeMethod: string;
  onSelect: (id: string) => void;
  getLimit: (method: string, channel: string) => { min: number; max: number } | null;
}

const PaymentChannelList = memo(({ channels, activeChannel, activeMethod, onSelect, getLimit }: PaymentChannelListProps) => (
  <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar" style={{ scrollBehavior: "smooth" }}>
    {channels.map((ch) => {
      const isActive = activeChannel === ch.id;
      const limit = getLimit(activeMethod, ch.id);
      return (
        <div
          key={ch.id}
          onClick={() => onSelect(ch.id)}
          className="rounded-lg overflow-hidden cursor-pointer transition-all shrink-0"
          style={{
            background: isActive ? "rgb(177, 44, 73)" : "rgba(255,255,255,0.05)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            minWidth: "126px",
          }}
        >
          <div className="flex flex-col px-2.5 py-1.5" style={{ color: "#fff" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px", whiteSpace: "nowrap" }}>
              {ch.label}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.9, whiteSpace: "nowrap" }}>
              {limit ? `₹${limit.min.toLocaleString()} - ₹${limit.max.toLocaleString()}` : ""}
            </div>
          </div>
        </div>
      );
    })}
  </div>
));

interface WithdrawAmountGridProps {
  formattedAmounts: { value: number; label: string }[];
  selectedAmount: number;
  onSelect: (amount: number) => void;
}

const WithdrawAmountGrid = memo(({ formattedAmounts, selectedAmount, onSelect }: WithdrawAmountGridProps) => (
  <div className="grid grid-cols-3 gap-1.5">
    {formattedAmounts.map(({ value, label }) => {
      const isActive = selectedAmount === value;
      return (
        <div
          key={value}
          onClick={() => onSelect(value)}
          className="relative rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-200 py-1.5"
          style={{
            background: isActive
              ? "linear-gradient(180deg, #5b0116 0%, #35030c 100%)"
              : "rgba(211, 54, 93, 0.2)",
            border: isActive
              ? "1.5px solid rgba(255, 180, 50, 0.6)"
              : "1px solid rgba(255,255,255,0.1)",
            boxShadow: isActive ? "0 0 8px rgba(255, 150, 30, 0.2)" : "none",
          }}
        >
          <span className="text-sm text-center font-medium" style={{
            backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}>{label}</span>
        </div>
      );
    })}
  </div>
));

const Bank = () => {
  const { navigateWithTransition } = useTransitionNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { balance, refresh: refreshBalance } = useProfile();
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedWithdrawAmount, setSelectedWithdrawAmount] = useState(110);
  const [activeMethod, setActiveMethod] = useState("upi");
  const [activePaymentChannel, setActivePaymentChannel] = useState("simplypay");
  const [activeWithdrawMethod, setActiveWithdrawMethod] = useState("bank_card");
  const [withdrawAmountInput, setWithdrawAmountInput] = useState("");
  const [depositAmountInput, setDepositAmountInput] = useState("");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showViewAccount, setShowViewAccount] = useState(false);
  const [bindAccount, setBindAccount] = useState<BankAccount | null>(() => {
    const cached = loadCache();
    return cached?.data?.bindAccount || null;
  });
  const [withdrawInfo, setWithdrawInfo] = useState<import("@/services/authService").WithdrawInfoResponse | null>(() => loadCache());

  const [loading, setLoading] = useState({ bindingAccount: false, paying: false, withdrawing: false });
  const [depositConfig, setDepositConfig] = useState<import("@/services/authService").DepositConfigItem[]>([]);
  const [depositConfigReady, setDepositConfigReady] = useState(false);
  const [depositBonusInfo, setDepositBonusInfo] = useState<import("@/services/authService").DepositBonusInfo | null>(null);
  const [bonusOptIn, setBonusOptIn] = useState(false);
  const [bonusFade, setBonusFade] = useState<'entering' | 'exiting' | null>(null);
  const [showBonusApply, setShowBonusApply] = useState(false);

  const categorizeChannel = (ch: import("@/services/authService").DepositConfigItem): string => {
    const name = (ch.name || ch.channel || "").toLowerCase();
    if (name.includes("upay")) return "upay";
    if (name.includes("usdt")) return "usdt";
    return "upi";
  };

  const methodIcons: Record<string, string> = { upi: upiLogo, usdt: usdtLogo, upay: upayLogo };
  const methodLabels: Record<string, string> = { upi: "UPI", usdt: "USDT", upay: "UPAY" };

  const buildChannelOptions = (config: import("@/services/authService").DepositConfigItem[]) => {
    const opts: Record<string, { id: string; label: string; icon?: string }[]> = {};
    config.forEach(ch => {
      const cat = categorizeChannel(ch);
      if (!opts[cat]) opts[cat] = [];
      opts[cat].push({ id: ch.channel, label: ch.name, icon: methodIcons[cat] });
    });
    return opts;
  };

  const channelOptions = buildChannelOptions(depositConfig);
  const methods = [
    { id: "upi", label: "UPI", icon: upiLogo },
    { id: "usdt", label: "USDT", icon: usdtLogo },
    { id: "upay", label: "UPAY", icon: upayLogo },
  ];

  const getChannelLimit = (methodId: string, channelId: string) => {
    const ch = depositConfig.find(c => c.channel === channelId && categorizeChannel(c) === methodId);
    return ch ? { min: ch.minAmount, max: ch.maxAmount } : null;
  };

  const getExchangeRate = (methodId: string, channelId: string): number => {
    const ch = depositConfig.find(c => c.channel === channelId && categorizeChannel(c) === methodId);
    return ch?.exchangeRate ?? 86;
  };

  const depositAmounts = useMemo(() => {
    const limit = getChannelLimit(activeMethod, activePaymentChannel);
    if (!limit) return BASE_DEPOSIT_AMOUNTS;
    const filtered = BASE_DEPOSIT_AMOUNTS.filter(a => a >= limit.min && a <= limit.max);
    return filtered.length > 0 ? filtered : [limit.min];
  }, [activeMethod, activePaymentChannel, depositConfig]);

  useEffect(() => {
    const limit = getChannelLimit(activeMethod, activePaymentChannel);
    if (limit) {
      if (selectedAmount < limit.min || selectedAmount > limit.max) {
        setSelectedAmount(limit.min);
        setCustomAmount("");
        setDepositAmountInput(limit.min.toString());
      }
    }
  }, [activeMethod, activePaymentChannel, depositConfig]);

  const WITHDRAW_METHODS = [
    { id: "bank_card", label: "BANK", icon: bankLogo },
    { id: "upi", label: "UPI", icon: upiLogo },
    { id: "upay", label: "UPAY", icon: upayLogo },
  ];

  const loadWithdrawInfo = async () => {
    try {
      const info = await authService.getWithdrawInfo();
      setWithdrawInfo(info);
      saveCache(info);
      if (info.data.bindAccount) {
        setBindAccount(info.data.bindAccount as BankAccount);
      } else {
        setBindAccount(null);
      }
    } catch (err: any) {
      if (!withdrawInfo) {
        toast({ description: err?.message || "Failed to load withdraw info", variant: "destructive" });
      }
    }
  };

  const depositConfigLoaded = useRef(false);

  const loadDepositConfig = async () => {
    if (depositConfigLoaded.current) return;
    try {
      const res = await authService.getDepositConfig();
      if (res?.data?.length) {
        setDepositConfig(res.data);
        depositConfigLoaded.current = true;
        setDepositConfigReady(true);
        const firstCat = categorizeChannel(res.data[0]);
        setActiveMethod(firstCat);
      }
    } catch {
      // fall back to hardcoded methods
    }
  };

  const loadDepositBonusInfo = async () => {
    try {
      const info = await authService.getDepositBonusInfo();
      setDepositBonusInfo(info);
      setBonusOptIn(info.hasBonusAvailable);
    } catch {
      // bonus info not available
    }
  };

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTab === "withdraw") {
      loadWithdrawInfo();
    } else {
      loadDepositConfig();
      loadDepositBonusInfo();
    }
  }, [activeTab]);

  const handleBindAccount = async (account: BankAccount) => {
    if (loading.bindingAccount) return;
    setLoading(prev => ({ ...prev, bindingAccount: true }));
    try {
      let res: any;
      if (activeWithdrawMethod === "upi") {
        res = await authService.addPaymentMethod("UPI", {
          upiId: account.accountNumber,
          holderName: account.accountHolder,
        });
      } else if (activeWithdrawMethod === "upay") {
        res = await authService.addPaymentMethod("UPAY", {
          rplId: account.rplId || account.accountNumber,
          holderName: account.accountHolder,
        });
      } else {
        res = await authService.addPaymentMethod("BANK", {
          accountNo: account.accountNumber,
          ifsc: account.bankCode,
          bankName: account.bankName,
          holderName: account.accountHolder,
        });
      }
      toast({ description: res.msg || "Payment method added successfully" });
      setShowAddAccount(false);
      loadWithdrawInfo();
    } catch (err: any) {
      toast({ description: err?.message || "Failed to add payment method", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, bindingAccount: false }));
    }
  };

  const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setWithdrawAmountInput(val);
    setSelectedWithdrawAmount(val ? parseInt(val) : 0);
  };

  const handleAllWithdraw = () => {
    const val = Math.floor(walletBalance);
    setWithdrawAmountInput(String(val));
    setSelectedWithdrawAmount(val);
  };


  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setDepositAmountInput(val);
    setCustomAmount(val);
  };

  const walletBalance = withdrawInfo?.data?.walletBalance ?? withdrawInfo?.data?.balance ?? balance;
  const withdrawableAmount = withdrawInfo?.data?.totalAvailable ?? withdrawInfo?.data?.withdrawable ?? withdrawInfo?.data?.canWithdrawAmount ?? 0;

  const getCurrentPaymentMethod = () => {
    const methods = withdrawInfo?.data?.paymentMethods;
    if (!methods) return null;
    if (activeWithdrawMethod === "bank_card") return methods.bank;
    if (activeWithdrawMethod === "upi") return methods.upi;
    if (activeWithdrawMethod === "upay") return methods.upay;
    return null;
  };

  const hasPaymentMethod = () => {
    const method = getCurrentPaymentMethod();
    return method?.isActive === true;
  };

  const turnoverRequirement = withdrawInfo?.data?.turnover?.total_required ?? withdrawInfo?.data?.turnover?.requirement ?? (withdrawInfo?.data as any)?.turnover_requirement ?? 0;
  const turnoverCompleted = withdrawInfo?.data?.turnover?.completed ?? 0;
  const remainingTurnover = Math.max(0, turnoverRequirement - turnoverCompleted);
  const turnoverProgress = withdrawInfo?.data?.turnover?.progress ?? (withdrawInfo?.data as any)?.turnover_progress ?? 0;
  const limits = withdrawInfo?.data?.limits;
  const methodLimits = activeWithdrawMethod === "upi" ? limits?.UPI : activeWithdrawMethod === "upay" ? limits?.UPAY : limits?.BANK;

  const chargePct = withdrawInfo?.data?.chargeInfo?.percentage ?? 0.035;
  const chargeFlat = withdrawInfo?.data?.chargeInfo?.flat ?? 6;
  const feeAmount = (selectedWithdrawAmount * chargePct) + chargeFlat;
  const withdrawReceivedAmount = selectedWithdrawAmount;
  
  const currentEffectiveAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;
  const { hasBonusAvailable, nextBonusRate } = depositBonusInfo ?? {};
  const getBonus = useCallback((amount: number) => {
    if (!hasBonusAvailable || !nextBonusRate) return 0;
    return Math.floor(amount * nextBonusRate);
  }, [hasBonusAvailable, nextBonusRate]);
  const selectedDepositBonus = useMemo(() => getBonus(currentEffectiveAmount), [getBonus, currentEffectiveAmount]);

  const handlePay = async () => {
    if (loading.paying) return;
    
    const depositAmount = customAmount ? parseInt(customAmount) : selectedAmount;
    const limit = getChannelLimit(activeMethod, activePaymentChannel);
    const isUsdt = activeMethod === "usdt";
    const denom = isUsdt ? "USDT" : "₹";
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({ description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (limit) {
      if (depositAmount < limit.min) {
        toast({ description: `Minimum deposit for this channel is ${denom}${limit.min}`, variant: "destructive" });
        return;
      }
      if (depositAmount > limit.max) {
        toast({ description: `Maximum deposit for this channel is ${denom}${limit.max}`, variant: "destructive" });
        return;
      }
    }

    const payWindow = window.open("", "_blank");
    setLoading(prev => ({ ...prev, paying: true }));
    try {
      const shouldOptIn = activeMethod !== "usdt" && bonusOptIn;
      const res = await authService.deposit(depositAmount, activePaymentChannel, shouldOptIn);
      if (res.paymentUrl) {
        if (payWindow) {
          payWindow.location.href = res.paymentUrl;
        } else {
          window.location.href = res.paymentUrl;
        }
      } else {
        if (payWindow) payWindow.close();
        toast({ description: res.msg || "Deposit initiated", variant: "destructive" });
      }
      refreshBalance();
    } catch (err: any) {
      if (payWindow) payWindow.close();
      toast({ description: err.message || "Please try again or choose another payment method.", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, paying: false }));
    }
  };

  const handleWithdraw = async () => {
    if (loading.withdrawing) return;
    if (!hasPaymentMethod() && !bindAccount) {
      toast({ description: "Please add a payment method first", variant: "destructive" });
      return;
    }

    if (remainingTurnover > 0) {
      toast({ 
        description: `Turnover requirement not met. Need to bet ₹${remainingTurnover.toFixed(0)} more.`, 
        variant: "destructive" 
      });
      return;
    }

    if (selectedWithdrawAmount <= 0) {
      toast({ description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (selectedWithdrawAmount > walletBalance) {
      toast({ 
        description: `Insufficient balance. Have ₹${walletBalance.toFixed(2)}`, 
        variant: "destructive" 
      });
      return;
    }

    if (methodLimits) {
      if (selectedWithdrawAmount < methodLimits.min) {
        toast({ description: `Minimum withdrawal for this method is ₹${methodLimits.min}`, variant: "destructive" });
        return;
      }
      if (selectedWithdrawAmount > methodLimits.max) {
        toast({ description: `Maximum withdrawal for this method is ₹${methodLimits.max}`, variant: "destructive" });
        return;
      }
    }

    if (limits && limits.remainingToday !== undefined && limits.remainingToday <= 0) {
      toast({ description: "Daily withdrawal limit reached (max 3 per day)", variant: "destructive" });
      return;
    }

    const apiType = activeWithdrawMethod === "bank_card" ? "BANK" : activeWithdrawMethod === "upay" ? "UPAY" : "UPI";

    setLoading(prev => ({ ...prev, withdrawing: true }));
    try {
      const res = await authService.requestWithdraw(selectedWithdrawAmount, apiType);
      if (res.status === "success") {
        toast({ description: res.msg || "Withdrawal request submitted" });
        refreshBalance();
        loadWithdrawInfo();
      } else {
        toast({ description: res.msg || "Withdrawal failed", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ description: err.message || "Withdrawal failed", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, withdrawing: false }));
    }
  };

  return (
    <main className="relative flex-1 flex flex-col pb-52 w-full">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-100%); opacity: 0; } }
`}</style>
      {/* Top Header with red bg */}
      <div className="relative w-full h-11 flex items-center justify-between px-3">
        <img src={headerBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 flex items-center gap-1.5">
          <img src={bankIcon} alt="Bank" className="w-7 h-7 object-contain" />
          <span className="text-white font-bold text-base">Bank</span>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <ClipboardCheck size={18} className="text-white cursor-pointer" onClick={() => navigateWithTransition(activeTab === "deposit" ? "/bank/records" : "/bank/withdrawals")} />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-2 pt-2">
        {/* Deposit / Withdraw tabs */}
        <GameCard className="flex gap-1">
          <button
            onClick={() => setActiveTab("deposit")}
            className="flex-1 h-7 rounded-sm text-xs transition-all border border-white/10"
            style={
              activeTab === "deposit"
                ? { backgroundImage: "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)", color: "#5a2d0a" }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className="flex-1 h-7 rounded-md text-xs transition-all border border-white/10"
            style={
              activeTab === "withdraw"
                ? { backgroundImage: "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)", color: "#5a2d0a" }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Withdraw
          </button>
        </GameCard>

        {activeTab === "deposit" ? (
          <>
            <GameCard className="p-2 flex flex-col gap-1.5" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
              <span className="text-white text-xs">Payment Methods</span>
              <div className="flex gap-1.5 justify-start">
                {methods.map((method) => {
                  const isActive = activeMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => {
                        setActiveMethod(method.id);
                        const chs = channelOptions[method.id];
                        if (chs?.length) setActivePaymentChannel(chs[0].id);
                      }}
                      className="flex flex-row items-center justify-center gap-1.5 w-[26%] h-[41px] rounded-md cursor-pointer transition-all"
                      style={{
                        background: isActive ? "rgb(177, 44, 73)" : "transparent",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        border: isActive ? "none" : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <img src={method.icon} alt={method.label} className="w-[31px] h-[24px] object-contain shrink-0" />
                      <span className="text-xs font-bold" style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}>
                        {method.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GameCard>

            <GameCard className="p-2 flex flex-col gap-1.5" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
              <span className="text-white text-xs">Payment Channel</span>
              <PaymentChannelList
                channels={channelOptions[activeMethod] || []}
                activeChannel={activePaymentChannel}
                activeMethod={activeMethod}
                onSelect={setActivePaymentChannel}
                getLimit={getChannelLimit}
              />
            </GameCard>

            <GameCard className="p-2 flex flex-col gap-1.5">
              <span className="text-white text-xs">Choose Deposit Amount</span>
              {activeMethod === "usdt" ? (
                <>
    <div className="grid grid-cols-3 gap-1.5" style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    {FORMATTED_USDT.map(({ deposit, bonus, label }) => {
                      const isActive = !customAmount && selectedAmount === deposit;
                      return (
                        <div
                          key={deposit}
                          onClick={() => { setSelectedAmount(deposit); setCustomAmount(""); setDepositAmountInput(deposit.toString()); }}
                          className="relative rounded-md overflow-hidden flex flex-col cursor-pointer border border-white/10"
                          style={{ backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)" }}
                        >
                          <img src={usdtLogo} alt="" className="absolute top-0 left-0 w-7 h-4 object-contain mt-0.5 ml-0.5" />
                          <span className="text-sm text-center pt-2 pb-0.5" style={{
                            backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            color: "transparent",
                          }}>{label}</span>
                          <div className="text-center text-[10px] pb-1 text-white/60">USDT</div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="flex items-center rounded-[30px] h-10 px-2.5"
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    <img src={usdtLogo} alt="USDT" className="w-5 h-5 object-contain mr-2" />
                    {depositAmountInput && (
                      <X size={16} className="text-white/50 cursor-pointer mr-2 flex-shrink-0" onClick={() => { setDepositAmountInput(""); setCustomAmount(""); setSelectedAmount(0); }} />
                    )}
                    <input
                      type="text"
                      placeholder="Please enter USDT amount"
                      className="bg-transparent border-none outline-none w-full h-full text-sm placeholder-white/50"
                      value={depositAmountInput}
                      onChange={handleDepositAmountChange}
                      style={{
                        backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                        caretColor: "white",
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <DepositAmountGrid
                    depositAmounts={depositAmounts}
                    selectedAmount={selectedAmount}
                    customAmount={customAmount}
                    bonusOptIn={bonusOptIn}
                    bonusFade={bonusFade}
                    getBonus={getBonus}
                    onSelect={(amount) => { setSelectedAmount(amount); setCustomAmount(""); setDepositAmountInput(amount.toString()); }}
                  />
                  <div
                    className="flex items-center rounded-[30px] h-10 pl-4 pr-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    <span className="text-base font-medium" style={{
                      backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }}>₹</span>
                    <div className="w-px h-4 bg-white/20 mx-2"></div>
                    <input
                      type="text"
                      placeholder="Please enter an amount"
                      className="bg-transparent border-none outline-none w-full h-full text-sm placeholder-white/50"
                      value={depositAmountInput}
                      onChange={handleDepositAmountChange}
                      style={{
                        backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                        caretColor: "white",
                      }}
                    />
                    {depositAmountInput && (
                      <X size={16} className="text-white/50 cursor-pointer ml-2 flex-shrink-0" onClick={() => { setDepositAmountInput(""); setCustomAmount(""); setSelectedAmount(0); }} />
                    )}
                  </div>
                </>
              )}
            </GameCard>

            {activeMethod === "usdt" && currentEffectiveAmount > 0 && (
              <GameCard className="p-2 flex flex-col gap-1.5" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Exchange Rate</span>
                  <span className="text-yellow-500 font-medium">1 USDT = ₹{getExchangeRate(activeMethod, activePaymentChannel).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Paid Amount</span>
                  <span className="text-white font-medium">{currentEffectiveAmount.toFixed(2)} USDT</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Received Amount</span>
                  <span className="text-white font-medium">₹{(currentEffectiveAmount * getExchangeRate(activeMethod, activePaymentChannel)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </GameCard>
            )}

            <GameCard className="p-2 flex flex-col gap-1.5" style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <span className="text-white font-bold text-xs">Deposit Bonus</span>
              <div
                className="relative rounded-lg flex items-center gap-2 px-2 py-2 cursor-pointer overflow-hidden"
                style={{ backgroundImage: `url(${eventBg})`, backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat", minHeight: "72px" }}
                onClick={() => {
                  if (!depositBonusInfo?.hasBonusAvailable) return;
                  if (showBonusApply) {
                    setBonusFade('entering');
                    setShowBonusApply(false);
                    setTimeout(() => { setBonusOptIn(true); setBonusFade(null); }, 200);
                  } else if (bonusOptIn) {
                    setBonusFade('exiting');
                    setShowBonusApply(true);
                    setTimeout(() => { setBonusOptIn(false); setBonusFade(null); }, 200);
                  } else {
                    setShowBonusApply(true);
                  }
                }}
              >
                {showBonusApply && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg" />
                )}
                <img src={giftBox} alt="Gift" className="w-14 h-14 object-contain relative z-10" />
                {depositBonusInfo ? (
                  <div className="flex flex-col flex-1 relative z-10">
                    {depositBonusInfo.hasBonusAvailable ? (
                      showBonusApply ? (
                        <GameButton
                          variant="red"
                          buttonType="prompt"
                          style={{ transform: "scale(0.7)", transformOrigin: "center" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setBonusFade('entering');
                            setShowBonusApply(false);
                            setTimeout(() => { setBonusOptIn(true); setBonusFade(null); }, 200);
                          }}
                        >
                          Apply Bonus
                        </GameButton>
                      ) : (
                        <>
                          <span className="text-green-500 font-bold text-sm">
                            {depositBonusInfo.nextBonusRate * 100}% Deposit Bonus
                          </span>
                          <span className="text-white/60 text-[10px]">
                            {depositBonusInfo.nextBonusExample}
                          </span>
                          <span className="text-white/40 text-[10px]">
                            {depositBonusInfo.turnoverMultiplier}x turnover required
                          </span>
                        </>
                      )
                    ) : (
                      <>
                        <span className="text-white text-[10px] font-bold">Deposit Bonus</span>
                        <span className="text-white/60 text-[10px]">No bonus available</span>
                        <span className="text-white/40 text-[10px]">
                          {depositBonusInfo.successfulDeposits} deposits completed
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 relative z-10 gap-1.5">
                    <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
                    <div className="h-2.5 w-36 rounded bg-white/10 animate-pulse" />
                    <div className="h-2 w-28 rounded bg-white/10 animate-pulse" />
                  </div>
                )}
              </div>
            </GameCard>

            <GameCard className="p-2">
              <div className="space-y-1">
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  Each deposit will be credited within 1-5 minutes.
                </p>
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  You can use customer service at any time to resolve deposit issues.
                </p>
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  If you encounter fluctuations in the banking system, don't worry, just try a few more times and you will succeed.
                </p>
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  Please ensure that you have installed Paytm and PhonePe.
                </p>
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  The wagering requirement for withdrawal is 1× the deposit amount and 3× the bonus amount.
                </p>
              </div>
            </GameCard>
          </>
        ) : (
          <>
            {/* Withdraw method selector - from withdrwalui.html */}
            <GameCard className="p-2 flex flex-col gap-1.5" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
              <span className="text-white text-xs">Payment Methods</span>
              <div className="flex gap-1.5 justify-start">
              {WITHDRAW_METHODS.map((method) => {
                const isActive = activeWithdrawMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setActiveWithdrawMethod(method.id)}
                    className="flex flex-row items-center justify-center gap-1.5 w-[26%] h-[41px] rounded-md cursor-pointer transition-all border border-white/10"
                    style={{
                      backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <img src={method.icon} alt={method.label} className="w-[31px] h-[24px] object-contain shrink-0" />
                    <span className="text-xs font-bold">{method.label}</span>
                  </div>
                );
              })}
            </div>
            </GameCard>

            {/* Payment method info card — from testui/test.html */}
            <GameCard className="p-2">
              {hasPaymentMethod() ? (
                <div className="bankInfo" style={{ display: "block", width: "100%", maxWidth: 456, margin: "12px 0", boxSizing: "border-box" }}>
                  <div
                    className="bankInfoItem type1 cursor-pointer"
                    onClick={() => setShowViewAccount(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "11px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "11px",
                      height: "82px",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Left: Icon + Name */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 100, height: 60 }}>
                      {activeWithdrawMethod === "upi" ? (
                        <img src={upiLogo} alt="" className="svg-icon" style={{ width: 26, height: 26, marginBottom: 3, objectFit: "contain" }} />
                      ) : activeWithdrawMethod === "upay" ? (
                        <img src={upayLogo} alt="" className="svg-icon" style={{ width: 26, height: 26, marginBottom: 3, objectFit: "contain" }} />
                      ) : (
                        <svg className="svg-icon icon-1" viewBox="0 0 62 59" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 26, height: 26, marginBottom: 3 }}>
                          <path d="M42.7474 21.041C43.8798 22.8892 44.446 25.0217 44.5875 27.1542C55.0621 29.8554 62.1395 35.6843 61.9979 42.0819C61.9979 51.4651 48.1262 59 30.999 59C13.8717 59 0 51.4651 0 42.0819C0 35.4 7.21894 29.5711 17.5519 26.8699C17.5519 29.4289 18.1181 31.9879 19.392 34.2626L29.1588 51.1807C29.8666 52.4602 30.4328 53.8819 30.7159 55.3036L31.1405 54.5928C33.5468 50.4699 33.5468 45.2096 31.1405 41.0867L23.3554 27.5807C20.9491 23.3157 20.9491 18.1976 23.3554 14.0747L23.78 13.3639C24.0631 14.7855 24.6293 16.2072 25.337 17.4867L29.8666 25.4482L36.944 37.8169C37.6517 39.0964 38.2179 40.5181 38.501 41.9398L38.9256 41.2289C41.3319 37.106 41.3319 31.8458 38.9256 27.7229L31.1405 14.2169C28.7342 10.094 28.7342 4.83373 31.1405 0.710843L31.5651 0C31.8482 1.42169 32.4144 2.84337 33.1222 4.12289L42.7474 21.041Z" fill="#ffb753"/>
                        </svg>
                      )}
                      <span style={{ fontSize: 13, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
                        {(() => {
                          const pm = getCurrentPaymentMethod();
                          if (activeWithdrawMethod === "bank_card") return (pm as any)?.bankName || "Bank";
                          if (activeWithdrawMethod === "upi") return "UPI";
                          if (activeWithdrawMethod === "upay") return "UPAY";
                          return "";
                        })()}
                      </span>
                    </div>

                    {/* Middle: Divider + Details */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: "27px",
                      flex: 1,
                      background: 'url("https://yaarwin.org/assets/png/line-0198e433.webp") no-repeat 0 50% / contain',
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 400, lineHeight: 1.4 }}>
                        {withdrawInfo?.data?.paymentMethods?.holderName || ""}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", fontWeight: 400, lineHeight: 1.4 }}>
                        {(() => {
                          const pm = getCurrentPaymentMethod();
                          if (!pm) return "-";
                          if (activeWithdrawMethod === "bank_card") {
                            const acc = (pm as any).accountNo || "";
                            return acc.length > 4 ? "****" + acc.slice(-4) : acc || "-";
                          }
                          if (activeWithdrawMethod === "upi") return (pm as any).address || "-";
                          if (activeWithdrawMethod === "upay") return (pm as any).address || "-";
                          return "-";
                        })()}
                      </span>
                    </div>

                    {/* Arrow */}
                    <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: "none", stroke: "rgba(255,255,255,0.5)", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-1.5 h-[86px] cursor-pointer border border-white/10 rounded-md"
                  onClick={() => setShowAddAccount(true)}
                >
                  <img
                    src={addDetailsPlusIcon}
                    alt="Add"
                    className="w-10 h-10 object-contain opacity-80"
                  />
                  <span className="text-white/70 text-xs">
                    {activeWithdrawMethod === "upi"
                      ? "Add a UPI account information"
                      : activeWithdrawMethod === "upay"
                        ? "Add a UPAY account information"
                        : "Add a bank account information"}
                  </span>
                </div>
              )}
              {!hasPaymentMethod() && (
                <p className="text-primary text-[10px] text-center mt-1.5">
                  Need to add beneficiary information to be able to withdraw money
                </p>
              )}
            </GameCard>

            {/* Withdraw Amount Grid */}
            <GameCard className="p-2 flex flex-col gap-1.5">
              <span className="text-white text-xs">Choose Withdraw Amount</span>
              <WithdrawAmountGrid
                formattedAmounts={FORMATTED_WITHDRAW}
                selectedAmount={selectedWithdrawAmount}
                onSelect={(amount) => { setSelectedWithdrawAmount(amount); setWithdrawAmountInput(amount.toString()); }}
              />
            </GameCard>

            {/* Amount input section */}
            <GameCard className="p-2">
              <div
                className="flex items-center rounded-[30px] h-10 pl-4 pr-4 mb-2"
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <span className="text-base font-medium" style={{
                  backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}>₹</span>
                <div className="w-px h-4 bg-white/20 mx-2"></div>
                <input
                  type="text"
                  placeholder="Please enter the amount"
                  className="bg-transparent border-none outline-none w-full h-full text-sm placeholder-white/50"
                  value={withdrawAmountInput}
                  onChange={handleWithdrawAmountChange}
                  style={{
                    backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    caretColor: "white",
                  }}
                />
                {withdrawAmountInput && (
                  <X size={16} className="text-white/50 cursor-pointer ml-2 flex-shrink-0" onClick={() => { setWithdrawAmountInput(""); setSelectedWithdrawAmount(0); }} />
                )}
              </div>
              <div className="flex flex-col gap-1 ml-0.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white/50">
                    Withdrawable balance <span className="text-yellow-500 font-bold">₹{walletBalance.toFixed(2)}</span>
                  </span>
                  <button
                    onClick={handleAllWithdraw}
                    className="bg-transparent text-primary text-[10px] cursor-pointer px-2 py-0.5 font-normal border border-primary/40 rounded"
                  >
                    All
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white/50">Withdrawal amount received</span>
                  <span className="text-yellow-500 font-bold text-right">₹{withdrawReceivedAmount.toFixed(2)}</span>
                </div>
              </div>
            </GameCard>

            {/* Rules section - from withdrwalui.html */}
            <GameCard className="p-2">
              <div className="space-y-1">
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  Need to bet <span className="text-primary">₹{remainingTurnover.toFixed(0)}</span> to be able to withdraw
                </p>
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  Withdraw time <span className="text-primary">00:00-23:55</span>
                </p>
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  Inday Remaining Withdrawal Times <span className="text-primary">{limits?.remainingToday ?? 3}</span>
                </p>
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  Withdrawal amount range <span className="text-primary">₹{(methodLimits?.min ?? 110).toFixed(2)}-₹{(methodLimits?.max ?? 50000).toFixed(2)}</span>
                </p>
              </div>
              <div className="border-t border-white/5 mt-2 pt-2 space-y-1">
                <p className="text-white/80 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  Please confirm your beneficial account information before withdrawing. If your information is incorrect, our company will not be liable for the amount of loss.
                </p>
                <p className="text-white/50 text-[11px] leading-4 pl-4 relative">
                  <span className="absolute left-[6px] top-[5px] w-[4px] h-[4px] bg-primary rotate-45" />
                  If your beneficial information is incorrect, please contact customer service.
                </p>
              </div>
            </GameCard>
          </>
        )}
      </div>

      {/* Bottom payment bar - fixed above bottom nav */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[var(--app-max-width)] z-30 px-3 py-2 pb-28 flex items-center justify-between"
        style={{ backgroundImage: "linear-gradient(180deg, #9c1735 0%, #480816 100%)" }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-white/70 text-xs">{activeTab === "deposit" ? "Payment" : "Withdraw"}</span>
            {activeTab === "deposit" && activeMethod === "usdt" ? (
              <span className="text-white font-bold text-sm">
                <span style={{
                  backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}>{(customAmount ? parseInt(customAmount) || 0 : selectedAmount).toLocaleString()}</span> USDT
              </span>
            ) : (
              <span className="text-white font-bold text-sm">
                <span style={{
                  backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}>₹{(activeTab === "deposit" ? (customAmount ? parseInt(customAmount) || 0 : selectedAmount) : selectedWithdrawAmount).toLocaleString()}</span>
              </span>
            )}
          </div>
          {activeTab === "deposit" && activeMethod !== "usdt" && (
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-[10px]">Received</span>
              <span className="text-[10px] font-bold" style={{
                backgroundImage: "linear-gradient(0deg, rgb(50, 200, 100) 0%, rgb(30, 160, 60) 43.7%, rgb(80, 220, 120) 45%, rgb(40, 185, 70) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}>₹{((customAmount ? parseInt(customAmount) || 0 : selectedAmount) + (bonusOptIn ? selectedDepositBonus : 0)).toLocaleString()}</span>
              {bonusOptIn && (
                <>
                  <span className="text-white/50 text-[10px]">Bonus</span>
                  <span className="text-[10px] font-bold" style={{
                    backgroundImage: "linear-gradient(0deg, rgb(70, 110, 208) 0%, rgb(64, 72, 179) 43.7%, rgb(97, 130, 237) 45%, rgb(101, 127, 231) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}>₹{selectedDepositBonus.toLocaleString()}</span>
                </>
              )}
            </div>
          )}
          {activeTab === "deposit" && activeMethod === "usdt" && currentEffectiveAmount > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-[10px]">Received</span>
              <span className="text-[10px] font-bold" style={{
                backgroundImage: "linear-gradient(0deg, rgb(50, 200, 100) 0%, rgb(30, 160, 60) 43.7%, rgb(80, 220, 120) 45%, rgb(40, 185, 70) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}>₹{(currentEffectiveAmount * getExchangeRate(activeMethod, activePaymentChannel)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          {activeTab === "withdraw" && (
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-[10px]">Fee</span>
              <span className="text-primary text-[10px] font-bold">₹{feeAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
        <GameButton
          variant={loading.paying || loading.withdrawing || (activeTab === "deposit" && !depositConfigReady) ? "mute" : "gold"}
          style={{
            height: "34px",
            fontSize: "12px",
            paddingLeft: "40px",
            paddingRight: "40px",
            borderRadius: "17px",
          }}
          onClick={activeTab === "deposit" ? handlePay : handleWithdraw}
          disabled={loading.paying || loading.withdrawing || (activeTab === "deposit" && !depositConfigReady)}
        >
          {loading.paying ? "Processing..." : loading.withdrawing ? "Processing..." : activeTab === "deposit" ? "Pay" : "Withdraw"}
        </GameButton>
      </div>

      <AddAccountDialog
        open={showAddAccount}
        method={activeWithdrawMethod}
        onOpenChange={setShowAddAccount}
        onConfirm={handleBindAccount}
      />

      {hasPaymentMethod() && (
        <GameDialog open={showViewAccount} onOpenChange={setShowViewAccount}>
          <GameDialogContent title="Payment Method Details">
            <GameDialogBody>
              <div className="w-full flex flex-col gap-1.5 text-left text-xs">
                {(() => {
                  const pm = getCurrentPaymentMethod();
                  if (!pm) return <span className="text-white/70">No payment method details</span>;
                  const methodName = activeWithdrawMethod === "upi" ? "UPI" : activeWithdrawMethod === "upay" ? "UPAY" : "Bank";
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/70">Type</span>
                        <span className="text-white font-medium">{methodName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Account Holder</span>
                        <span className="text-white font-medium">{withdrawInfo?.data?.paymentMethods?.holderName || "-"}</span>
                      </div>
                      {activeWithdrawMethod === "bank_card" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-white/70">Bank Name</span>
                            <span className="text-white font-medium">{(pm as any).bankName || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Account Number</span>
                            <span className="text-white font-medium">{(pm as any).accountNo || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">IFSC</span>
                            <span className="text-white font-medium">{(pm as any).ifsc || "-"}</span>
                          </div>
                        </>
                      )}
                      {activeWithdrawMethod === "upi" && (
                        <div className="flex justify-between">
                          <span className="text-white/70">UPI ID</span>
                          <span className="text-white font-medium">{(pm as any).address || "-"}</span>
                        </div>
                      )}
                      {activeWithdrawMethod === "upay" && (
                        <div className="flex justify-between">
                          <span className="text-white/70">RLP Address</span>
                          <span className="text-white font-medium">{(pm as any).address || "-"}</span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </GameDialogBody>
            <GameDialogFooter>
              <GameButton variant="mute" buttonType="prompt" style={{ 
                transform: "scale(0.5, 0.6)",
                transformOrigin: "center"
              }} onClick={() => setShowViewAccount(false)}>
                Close
              </GameButton>
            </GameDialogFooter>
          </GameDialogContent>
        </GameDialog>
      )}
    </main>
  );
};

export default Bank;
