import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "@/components/Loader";
import { GameCard } from "@/components/GameCard";
import headerBg from "@/assets/bank/header-bg.png";
import bankIcon from "@/assets/bank/bank-icon.png";
import depositBadge from "@/assets/bank/deposit-badge.png";
import upiLogo from "@/assets/bank/upi-logo.jpg";
import usdtLogo from "@/assets/bank/usdt-logo.png";
import upayLogo from "@/assets/bank/upay-logo.png";
import bankLogo from "@/assets/bank/bank-logo.png";
import giftBox from "@/assets/bank/gift-box-small.png";
import eventBg from "@/assets/bank/event-bg.png";
import { ClipboardCheck } from "lucide-react";
import AddAccountDialog, { type BankAccount } from "@/components/bank/AddAccountDialog";
import { GameButton } from "@/components/GameButton";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { GameDialog, GameDialogBody, GameDialogContent, GameDialogFooter } from "@/components/GameDialog";

const DEPOSIT_OPTIONS = [
  { deposit: 100, bonus: 20 },
  { deposit: 200, bonus: 40 },
  { deposit: 300, bonus: 60 },
  { deposit: 500, bonus: 100 },
  { deposit: 1000, bonus: 250 },
  { deposit: 3000, bonus: 750 },
  { deposit: 5000, bonus: 1250 },
  { deposit: 8000, bonus: 2000 },
  { deposit: 10000, bonus: 3000 },
  { deposit: 20000, bonus: 6000 },
  { deposit: 30000, bonus: 7500 }
];

const USDT_OPTIONS = [
  { deposit: 50, bonus: 0 },
  { deposit: 100, bonus: 0 },
  { deposit: 200, bonus: 0 },
  { deposit: 500, bonus: 0 },
  { deposit: 1000, bonus: 0 },
  { deposit: 2000, bonus: 0 },
];
const WITHDRAW_AMOUNTS = [110, 200, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000];

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

const Bank = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { balance, refresh: refreshBalance } = useProfile();
  const cached = loadCache();
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
  const [bindAccount, setBindAccount] = useState<BankAccount | null>(cached?.data?.bindAccount || null);
  const [withdrawInfo, setWithdrawInfo] = useState<import("@/services/authService").WithdrawInfoResponse | null>(cached || null);
  const [loadingWithdrawInfo, setLoadingWithdrawInfo] = useState(false);
  const [bindingAccount, setBindingAccount] = useState(false);
  const [paying, setPaying] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [depositConfig, setDepositConfig] = useState<import("@/services/authService").DepositConfigItem[]>([]);
  const [loadingDepositConfig, setLoadingDepositConfig] = useState(false);

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
  const methods = Object.keys(channelOptions).length > 0
    ? Object.keys(channelOptions).map(id => ({ id, label: methodLabels[id] || id.toUpperCase(), icon: methodIcons[id] || upiLogo }))
    : [
        { id: "upi", label: "UPI", icon: upiLogo },
        { id: "usdt", label: "USDT", icon: usdtLogo },
        { id: "upay", label: "UPAY", icon: upayLogo },
      ];

  const getChannelLimit = (methodId: string, channelId: string) => {
    const ch = depositConfig.find(c => c.channel === channelId && categorizeChannel(c) === methodId);
    return ch ? { min: ch.minAmount, max: ch.maxAmount } : null;
  };

  const WITHDRAW_METHODS = [
    { id: "bank_card", label: "BANK CARD", icon: bankLogo },
    { id: "upi", label: "UPI", icon: upiLogo },
    { id: "upay", label: "UPAY", icon: upayLogo },
  ];

  const loadWithdrawInfo = async () => {
    if (!withdrawInfo) setLoadingWithdrawInfo(true);
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
    } finally {
      setLoadingWithdrawInfo(false);
    }
  };

  const depositConfigLoaded = useRef(false);

  const loadDepositConfig = async () => {
    if (depositConfigLoaded.current) return;
    setLoadingDepositConfig(true);
    try {
      const res = await authService.getDepositConfig();
      if (res?.data?.length) {
        setDepositConfig(res.data);
        depositConfigLoaded.current = true;
        const firstCat = categorizeChannel(res.data[0]);
        setActiveMethod(firstCat);
      }
    } catch {
      // fall back to hardcoded methods
    } finally {
      setLoadingDepositConfig(false);
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
    }
  }, [activeTab]);

  const handleBindAccount = async (account: BankAccount) => {
    if (bindingAccount) return;
    setBindingAccount(true);
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
      setBindingAccount(false);
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
  const selectedDepositBonus = [...DEPOSIT_OPTIONS]
    .sort((a, b) => b.deposit - a.deposit)
    .find(o => currentEffectiveAmount >= o.deposit)?.bonus || 0;

  const handlePay = async () => {
    if (paying) return;
    
    const depositAmount = customAmount ? parseInt(customAmount) : selectedAmount;
    const limit = getChannelLimit(activeMethod, activePaymentChannel);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({ description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (limit) {
      if (depositAmount < limit.min) {
        toast({ description: `Minimum deposit for this channel is ₹${limit.min}`, variant: "destructive" });
        return;
      }
      if (depositAmount > limit.max) {
        toast({ description: `Maximum deposit for this channel is ₹${limit.max}`, variant: "destructive" });
        return;
      }
    }

    setPaying(true);
    try {
      const res = await authService.deposit(depositAmount, activePaymentChannel);
      if (res.paymentUrl) {
        window.open(res.paymentUrl, "_blank");
        toast({ description: "Opening payment..." });
      } else {
        toast({ description: res.msg || "Deposit initiated", variant: "destructive" });
      }
      refreshBalance();
    } catch (err: any) {
      toast({ description: err.message || "Please try again or choose another payment method.", variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  const handleWithdraw = async () => {
    if (withdrawing) return;
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

    setWithdrawing(true);
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
      setWithdrawing(false);
    }
  };

  return (
    <main className="relative flex-1 flex flex-col pb-52 w-full">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }`}</style>
      {(paying || loadingWithdrawInfo || bindingAccount || withdrawing || loadingDepositConfig) && (
        <Loader
          overlay
          label={
            paying
              ? "Payment processing..."
              : withdrawing
                ? "Processing withdrawal..."
                : bindingAccount
                  ? "Saving bank account..."
                  : loadingDepositConfig
                    ? "Loading payment options..."
                    : "Loading withdraw info..."
          }
        />
      )}
      {/* Top Header with red bg */}
      <div className="relative w-full h-12 flex items-center justify-between px-4">
        <img src={headerBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 flex items-center gap-2">
          <img src={bankIcon} alt="Bank" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-base">Bank</span>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <ClipboardCheck size={20} className="text-white cursor-pointer mr-4" onClick={() => navigate(activeTab === "deposit" ? "/bank/records" : "/bank/withdrawals")} />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-2 pt-2">
        {/* Deposit / Withdraw tabs */}
        <GameCard className="flex gap-1">
          <button
            onClick={() => setActiveTab("deposit")}
            className="flex-1 h-8 rounded-sm text-sm transition-all border border-white/10"
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
            className="flex-1 h-8 rounded-md text-sm transition-all border border-white/10"
            style={
              activeTab === "withdraw"
                ? { backgroundImage: "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)", color: "#5a2d0a" }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Withdraw
          </button>
        </GameCard>

        {/* New Bank Card */}
        <div 
          className="relative w-full h-24 rounded-2xl overflow-hidden shadow-xl p-3 flex flex-col justify-center"
          style={{
            background: 'linear-gradient(135deg, #5a0a1a 0%, #3a0611 50%, #4a0915 100%)',
            border: '1.5px solid rgba(255, 180, 50, 0.45)',
          }}
        >
          <div className="relative z-10 flex justify-between items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/80 text-[10px] font-medium uppercase tracking-wider">Total Balance</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-white text-lg font-black">₹</span>
                <span className="text-white text-lg font-black">
                  {(activeTab === 'deposit' ? balance : walletBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {/* Credit Card Icon as requested */}
            <img 
              src="https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/assets/creditcardicon.png" 
              alt="Credit Card" 
              className="w-8 h-8 object-contain opacity-90"
            />
          </div>
        </div>

        {activeTab === "deposit" ? (
          <>
            <GameCard className="p-3 flex flex-col gap-2" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
              <span className="text-white text-sm">Payment Methods</span>
              <div className="flex gap-2 justify-start">
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
                      className="flex flex-col justify-between items-center w-[31%] h-20 p-2.5 rounded-md cursor-pointer transition-all"
                      style={{
                        background: isActive ? "rgb(177, 44, 73)" : "transparent",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        border: isActive ? "none" : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="flex justify-center items-center w-full h-[35px]">
                        <img src={method.icon} alt={method.label} className="w-[35px] h-[35px] object-contain" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}>
                        {method.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GameCard>

            <GameCard className="p-3 flex flex-col gap-2" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
              <span className="text-white text-sm">Payment Channel</span>
              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar" style={{ scrollBehavior: "smooth" }}>
                {channelOptions[activeMethod]?.map((ch) => {
                  const isActive = activePaymentChannel === ch.id;
                  const limit = getChannelLimit(activeMethod, ch.id);
                  return (
                    <div
                      key={ch.id}
                      onClick={() => setActivePaymentChannel(ch.id)}
                      className="rounded-lg overflow-hidden cursor-pointer transition-all shrink-0"
                      style={{
                        background: isActive ? "rgb(177, 44, 73)" : "rgba(255,255,255,0.05)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        minWidth: "140px",
                      }}
                    >
                      <div className="flex flex-col px-3 py-2" style={{ color: "#fff" }}>
                        <div style={{ fontSize: "15px", fontWeight: 500, marginBottom: "2px", whiteSpace: "nowrap" }}>
                          {ch.label}
                        </div>
                        <div style={{ fontSize: "12px", opacity: 0.9, whiteSpace: "nowrap" }}>
                          {limit ? `₹${limit.min.toLocaleString()} - ₹${limit.max.toLocaleString()}` : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GameCard>

            <GameCard className="p-2 flex flex-col gap-2">
              <span className="text-white text-sm">Choose Deposit Amount</span>
              {activeMethod === "usdt" ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {USDT_OPTIONS.map((opt) => {
                      const isActive = !customAmount && selectedAmount === opt.deposit;
                      return (
                        <div
                          key={opt.deposit}
                          onClick={() => { setSelectedAmount(opt.deposit); setCustomAmount(""); }}
                          className="relative rounded-md overflow-hidden flex flex-col cursor-pointer border border-white/10"
                          style={{ backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)" }}
                        >
                          <img src={usdtLogo} alt="" className="absolute top-0 left-0 w-8 h-5 object-contain mt-0.5 ml-0.5" />
                          <span className="text-white text-base text-center pt-3 pb-1">{opt.deposit.toLocaleString()}</span>
                          <div className="text-center text-[10px] pb-1 text-white/60">USDT</div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="flex items-center rounded-[30px] h-11 px-3"
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    <img src={usdtLogo} alt="USDT" className="w-5 h-5 object-contain mr-2" />
                    <input
                      type="text"
                      placeholder="Please enter USDT amount"
                      className="bg-transparent border-none outline-none w-full h-full text-sm text-white placeholder-white/50"
                      value={depositAmountInput}
                      onChange={handleDepositAmountChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {DEPOSIT_OPTIONS.map((opt) => {
                      const isActive = !customAmount && selectedAmount === opt.deposit;
                      return (
                        <div
                          key={opt.deposit}
                          onClick={() => { setSelectedAmount(opt.deposit); setCustomAmount(""); }}
                          className="relative rounded-md overflow-hidden flex flex-col cursor-pointer border border-white/10"
                          style={{ backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)" }}
                        >
                          <img src={depositBadge} alt="" className="absolute top-0 left-0 w-12 h-5 object-contain" />
                          <span className="absolute top-0 left-4 text-white text-[8px] font-bold">1st</span>
                          <span className="text-white text-base text-center pt-2.5 pb-0.5">{opt.deposit.toLocaleString()}</span>
                          <div
                            className="text-center text-[11px] font-bold rounded-b-md"
                            style={{ backgroundImage: "linear-gradient(156deg, rgb(255, 213, 103) 0%, rgb(255, 167, 74) 98%)", color: "#5a2d0a" }}
                          >
                            +{opt.bonus}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="flex items-center rounded-[30px] h-11 px-3"
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    <span className="text-primary text-lg font-medium">₹</span>
                    <input
                      type="text"
                      placeholder="Please enter an amount"
                      className="bg-transparent border-none outline-none w-full h-full ml-3 text-sm text-white placeholder-white/50"
                      value={depositAmountInput}
                      onChange={handleDepositAmountChange}
                    />
                  </div>
                </>
              )}
            </GameCard>

            {activeMethod === "usdt" && (
              <GameCard className="p-3 flex flex-col gap-2" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Exchange Rate</span>
                  <span className="text-yellow-500 font-medium">1 USDT = ₹86.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Received Amount</span>
                  <span className="text-white font-medium">{(currentEffectiveAmount / 86).toFixed(2)} USDT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Paid Amount</span>
                  <span className="text-white font-medium">₹{currentEffectiveAmount.toLocaleString()}</span>
                </div>
              </GameCard>
            )}

            <GameCard className="p-3 flex flex-col gap-2">
              <span className="text-white font-bold text-sm">Deposit Event</span>
              <div
                className="relative rounded-lg flex items-center gap-3 px-3 py-3"
                style={{ backgroundImage: `url(${eventBg})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
              >
                <img src={giftBox} alt="Gift" className="w-16 h-16 object-contain" />
                <div className="flex flex-col flex-1">
                  <span className="text-white text-[10px] font-bold">First Deposit</span>
                  <span className="text-green-500 font-bold text-sm">100% Deposit Bonus</span>
                  <span className="text-white/60 text-[10px]">3x Turnover required on total amount</span>
                </div>
              </div>
            </GameCard>

            <GameCard className="p-3">
              <div className="space-y-1.5">
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  Each deposit will be credited within 1-5 minutes.
                </p>
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  You can use customer service at any time to resolve deposit issues.
                </p>
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  If you encounter fluctuations in the banking system, don't worry, just try a few more times and you will succeed.
                </p>
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  Please ensure that you have installed Paytm and PhonePe.
                </p>
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  The wagering requirement for withdrawal is 1× the deposit amount and 3× the bonus amount.
                </p>
              </div>
            </GameCard>
          </>
        ) : (
          <>
            {/* Withdraw method selector - from withdrwalui.html */}
            <div className="flex gap-2 justify-start">
              {WITHDRAW_METHODS.map((method) => {
                const isActive = activeWithdrawMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setActiveWithdrawMethod(method.id)}
                    className="flex flex-col justify-between items-center w-[31%] h-20 p-2.5 rounded-md cursor-pointer transition-all border border-white/10"
                    style={{
                      backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <div className="flex justify-center items-center w-full h-[35px]">
                      <img src={method.icon} alt={method.label} className="w-[35px] h-[35px] object-contain" />
                    </div>
                    <span className="text-xs font-medium">{method.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Payment method info card — from testui/test.html */}
            <GameCard className="p-3">
              {hasPaymentMethod() ? (
                <div className="bankInfo" style={{ display: "block", width: "100%", maxWidth: 456, margin: "13.65px 0", boxSizing: "border-box" }}>
                  <div
                    className="bankInfoItem type1 cursor-pointer"
                    onClick={() => setShowViewAccount(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12.285px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "12.285px",
                      height: "91.53px",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Left: Icon + Name */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 111.6, height: 66.6 }}>
                      {activeWithdrawMethod === "upi" ? (
                        <img src={upiLogo} alt="" className="svg-icon" style={{ width: 28.8, height: 28.8, marginBottom: 3.6, objectFit: "contain" }} />
                      ) : activeWithdrawMethod === "upay" ? (
                        <img src={upayLogo} alt="" className="svg-icon" style={{ width: 28.8, height: 28.8, marginBottom: 3.6, objectFit: "contain" }} />
                      ) : (
                        <svg className="svg-icon icon-1" viewBox="0 0 62 59" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28.8, height: 28.8, marginBottom: 3.6 }}>
                          <path d="M42.7474 21.041C43.8798 22.8892 44.446 25.0217 44.5875 27.1542C55.0621 29.8554 62.1395 35.6843 61.9979 42.0819C61.9979 51.4651 48.1262 59 30.999 59C13.8717 59 0 51.4651 0 42.0819C0 35.4 7.21894 29.5711 17.5519 26.8699C17.5519 29.4289 18.1181 31.9879 19.392 34.2626L29.1588 51.1807C29.8666 52.4602 30.4328 53.8819 30.7159 55.3036L31.1405 54.5928C33.5468 50.4699 33.5468 45.2096 31.1405 41.0867L23.3554 27.5807C20.9491 23.3157 20.9491 18.1976 23.3554 14.0747L23.78 13.3639C24.0631 14.7855 24.6293 16.2072 25.337 17.4867L29.8666 25.4482L36.944 37.8169C37.6517 39.0964 38.2179 40.5181 38.501 41.9398L38.9256 41.2289C41.3319 37.106 41.3319 31.8458 38.9256 27.7229L31.1405 14.2169C28.7342 10.094 28.7342 4.83373 31.1405 0.710843L31.5651 0C31.8482 1.42169 32.4144 2.84337 33.1222 4.12289L42.7474 21.041Z" fill="#ffb753"/>
                        </svg>
                      )}
                      <span style={{ fontSize: 14.4, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
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
                      paddingLeft: "30.717px",
                      flex: 1,
                      background: 'url("https://yaarwin.org/assets/png/line-0198e433.webp") no-repeat 0 50% / contain',
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 400, lineHeight: 1.4 }}>
                        {withdrawInfo?.data?.paymentMethods?.holderName || ""}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "17.199px", fontWeight: 400, lineHeight: 1.4 }}>
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
                  className="flex flex-col items-center justify-center gap-2 h-24 cursor-pointer border border-white/10 rounded-md"
                  onClick={() => setShowAddAccount(true)}
                >
                  <img
                    src="https://yaarwin.org/assets/png/add-1ad7f3f5.webp"
                    alt="Add"
                    className="w-11 h-11 object-contain opacity-80"
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
                <p className="text-primary text-[11px] text-center mt-2">
                  Need to add beneficiary information to be able to withdraw money
                </p>
              )}
            </GameCard>

            {/* Amount input section - from withdrwalui.html */}
            <GameCard className="p-3">
              <div
                className="flex items-center rounded-[30px] h-11 px-3 mb-2.5"
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <span className="text-primary text-lg font-medium">₹</span>
                <input
                  type="text"
                  placeholder="Please enter the amount"
                  className="bg-transparent border-none outline-none w-full h-full ml-3 text-sm text-white placeholder-white/50"
                  value={withdrawAmountInput}
                  onChange={handleWithdrawAmountChange}
                />
              </div>
              <div className="flex flex-col gap-1.5 ml-0.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-white/50">
                    Withdrawable balance <span className="text-yellow-500 font-bold">₹{walletBalance.toFixed(2)}</span>
                  </span>
                  <button
                    onClick={handleAllWithdraw}
                    className="bg-transparent text-primary text-[11px] cursor-pointer px-2.5 py-0.5 font-normal border border-primary/40 rounded"
                  >
                    All
                  </button>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-white/50">Withdrawal amount received</span>
                  <span className="text-yellow-500 font-bold text-right">₹{withdrawReceivedAmount.toFixed(2)}</span>
                </div>
              </div>
            </GameCard>

            {/* Rules section - from withdrwalui.html */}
            <GameCard className="p-3">
              <div className="space-y-1.5">
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  Need to bet <span className="text-primary">₹{remainingTurnover.toFixed(0)}</span> to be able to withdraw
                </p>
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  Withdraw time <span className="text-primary">00:00-23:55</span>
                </p>
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  Inday Remaining Withdrawal Times <span className="text-primary">{limits?.remainingToday ?? 3}</span>
                </p>
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  Withdrawal amount range <span className="text-primary">₹{(methodLimits?.min ?? 110).toFixed(2)}-₹{(methodLimits?.max ?? 50000).toFixed(2)}</span>
                </p>
              </div>
              <div className="border-t border-white/5 mt-3 pt-3 space-y-1.5">
                <p className="text-white/80 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  Please confirm your beneficial account information before withdrawing. If your information is incorrect, our company will not be liable for the amount of loss.
                </p>
                <p className="text-white/50 text-[12px] leading-5 pl-5 relative">
                  <span className="absolute left-[7.5px] top-[7px] w-[5px] h-[5px] bg-primary rotate-45" />
                  If your beneficial information is incorrect, please contact customer service.
                </p>
              </div>
            </GameCard>
          </>
        )}
      </div>

      {/* Bottom payment bar - fixed above bottom nav */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[var(--app-max-width)] z-30 px-4 py-3 pb-28 flex items-center justify-between"
        style={{ backgroundImage: "linear-gradient(180deg, #9c1735 0%, #480816 100%)" }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-white/70 text-xs">{activeTab === "deposit" ? "Payment" : "Withdraw"}</span>
            <span className="text-white font-bold text-sm">
              ₹{(activeTab === "deposit" ? (customAmount ? parseInt(customAmount) || 0 : selectedAmount) : selectedWithdrawAmount).toLocaleString()}
            </span>
          </div>
          {activeTab === "deposit" && (
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-[10px]">Received</span>
              <span className="text-green-400 text-[10px] font-bold">₹{((customAmount ? parseInt(customAmount) || 0 : selectedAmount) + selectedDepositBonus).toLocaleString()}</span>
              <span className="text-white/50 text-[10px]">Bonus</span>
              <span className="text-primary text-[10px] font-bold">₹{selectedDepositBonus.toLocaleString()}</span>
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
          variant="gold"
          style={{
            height: "38px",
            fontSize: "13px",
            paddingLeft: "48px",
            paddingRight: "48px",
            borderRadius: "19px",
          }}
          onClick={activeTab === "deposit" ? handlePay : handleWithdraw}
          disabled={paying || withdrawing}
        >
          {paying ? "Processing..." : withdrawing ? "Processing..." : activeTab === "deposit" ? "Pay" : "Withdraw"}
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
              <div className="w-full flex flex-col gap-2 text-left text-sm">
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
