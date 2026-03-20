import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import { GameCard } from "@/components/GameCard";
import headerBg from "@/assets/bank/header-bg.png";
import bankIcon from "@/assets/bank/bank-icon.png";
import depositBadge from "@/assets/bank/deposit-badge.png";
import upiLogo from "@/assets/bank/upi-logo.png";
import usdtLogo from "@/assets/bank/usdt-logo.png";
import upayLogo from "@/assets/bank/upay-logo.png";
import giftBox from "@/assets/bank/gift-box-small.png";
import eventBg from "@/assets/bank/event-bg.png";
import { Info, ClipboardCheck, ChevronRight, Check, PlusCircle, Wallet, CreditCard, CheckCircle } from "lucide-react";
import AddAccountDialog, { type BankAccount } from "@/components/bank/AddAccountDialog";
import { GameButton } from "@/components/GameButton";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { GameDialog, GameDialogBody, GameDialogContent, GameDialogFooter } from "@/components/GameDialog";
import { Progress } from "@/components/ui/progress";

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
const WITHDRAW_AMOUNTS = [110, 200, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000];

const Bank = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balance, refresh: refreshBalance } = useProfile();
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedWithdrawAmount, setSelectedWithdrawAmount] = useState(110);
  const [activeChannel, setActiveChannel] = useState("upi");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showViewAccount, setShowViewAccount] = useState(false);
  const [bindAccount, setBindAccount] = useState<BankAccount | null>(null);
  const [withdrawInfo, setWithdrawInfo] = useState<import("@/services/authService").WithdrawInfoResponse | null>(null);
  const [loadingWithdrawInfo, setLoadingWithdrawInfo] = useState(false);
  const [bindingAccount, setBindingAccount] = useState(false);
  const [paying, setPaying] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const channels = [
    { id: "upi", label: "UPI", icon: upiLogo },
    { id: "usdt", label: "USDT", icon: usdtLogo },
    { id: "upay", label: "UPAY", icon: upayLogo },
  ];

  const loadWithdrawInfo = async () => {
    setLoadingWithdrawInfo(true);
    try {
      const info = await authService.getWithdrawInfo();
      setWithdrawInfo(info);
      if (info.data.bindAccount) {
        setBindAccount(info.data.bindAccount as BankAccount);
      } else {
        setBindAccount(null);
      }
    } catch (err: any) {
      toast({ description: err?.message || "Failed to load withdraw info", variant: "destructive" });
    } finally {
      setLoadingWithdrawInfo(false);
    }
  };

  useEffect(() => {
    if (activeTab === "withdraw") {
      loadWithdrawInfo();
    }
  }, [activeTab]);

  const handleBindAccount = async (account: BankAccount) => {
    if (bindingAccount) return;
    setBindingAccount(true);
    try {
      const res = await authService.bindBankAccount({
        bankName: account.bankName,
        bankCode: account.bankCode,
        accountNumber: account.accountNumber,
        accountHolder: account.accountHolder,
      });
      setBindAccount((res.bindAccount as BankAccount) || account);
      setWithdrawInfo((prev) =>
        prev
          ? {
            ...prev,
            data: {
              ...prev.data,
              isBankBound: true,
              bindAccount: (res.bindAccount as BankAccount) || account,
            },
          }
          : null,
      );
      toast({ description: res.msg || "Bank account bound successfully" });
      setShowAddAccount(false);
    } catch (err: any) {
      toast({ description: err?.message || "Failed to bind bank account", variant: "destructive" });
    } finally {
      setBindingAccount(false);
    }
  };

  const walletBalance = withdrawInfo?.data?.walletBalance ?? withdrawInfo?.data?.balance ?? balance;
  const withdrawableAmount = withdrawInfo?.data?.totalAvailable ?? withdrawInfo?.data?.withdrawable ?? withdrawInfo?.data?.canWithdrawAmount ?? 0;
  const turnoverRequirement = withdrawInfo?.data?.turnover?.total_required ?? withdrawInfo?.data?.turnover?.requirement ?? (withdrawInfo?.data as any)?.turnover_requirement ?? 0;
  const turnoverCompleted = withdrawInfo?.data?.turnover?.completed ?? 0;
  const turnoverProgress = withdrawInfo?.data?.turnover?.progress ?? (withdrawInfo?.data as any)?.turnover_progress ?? 0;
  const dailyLimit = withdrawInfo?.data?.vipMeta?.dailyWithdrawLimit ?? withdrawInfo?.data?.dailyLimit ?? withdrawInfo?.data?.vipLimit ?? 0;
  const remainingLimit = withdrawInfo?.data?.remainingDailyLimit ?? withdrawInfo?.data?.canWithdrawAmount ?? 0;
  
  const chargeRate = withdrawInfo?.data?.charge ?? 0.0;
  const feeAmount = selectedWithdrawAmount * chargeRate;
  const selectedDepositBonus = DEPOSIT_OPTIONS.find(o => o.deposit === selectedAmount)?.bonus || 0;

  const handlePay = async () => {
    if (paying) return;
    setPaying(true);
    try {
      const res = await authService.deposit(selectedAmount);
      if (res.paymentUrl) {
        navigate("/payment", { state: { paymentUrl: res.paymentUrl } });
        toast({ description: "Opening payment..." });
      } else {
        toast({ description: res.msg || "Deposit initiated", variant: "destructive" });
      }
      refreshBalance();
    } catch (err: any) {
      toast({ description: err.message || "Deposit failed", variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  const handleWithdraw = async () => {
    if (withdrawing) return;
    if (!withdrawInfo?.data?.isBankBound && !bindAccount) {
      toast({ description: "Please bind a bank account first", variant: "destructive" });
      return;
    }
    
    setWithdrawing(true);
    try {
      const res = await authService.requestWithdraw(selectedWithdrawAmount);
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
      {(paying || loadingWithdrawInfo || bindingAccount || withdrawing) && (
        <Loader
          overlay
          label={
            paying
              ? "Payment processing..."
              : withdrawing
                ? "Processing withdrawal..."
                : bindingAccount
                  ? "Saving bank account..."
                  : "Loading withdraw info..."
          }
        />
      )}
      {/* Top Header with red bg */}
      <div className="relative w-full h-12 flex items-center justify-between px-4">
        <img src={headerBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 flex items-center gap-2">
          <img src={bankIcon} alt="Bank" className="w-8 h-8 object-contain" />
          <div className="flex items-center gap-1">
            <span className="text-white/70 text-sm">Balance:</span>
            <span className="text-primary font-bold text-base">₹{activeTab === 'deposit' ? balance.toFixed(2) : walletBalance.toFixed(2)}</span>
          </div>
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
            className="flex-1 h-8 rounded-sm text-sm transition-all"
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
            className="flex-1 h-8 rounded-md text-sm transition-all"
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
            <GameCard className="px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-red-600" />
                <span className="text-white text-xs">You have pending orders</span>
              </div>
              <ChevronRight size={18} className="text-white" onClick={() => navigate("/bank/records")} />
            </GameCard>

            <GameCard className="p-2 flex flex-col gap-2">
              <span className="text-white text-sm">Choose Deposit Amount</span>
              <div className="grid grid-cols-3 gap-2">
                {DEPOSIT_OPTIONS.map((opt) => {
                  const isActive = selectedAmount === opt.deposit;
                  return (
                    <div
                      key={opt.deposit}
                      onClick={() => setSelectedAmount(opt.deposit)}
                      className="relative rounded-md overflow-hidden flex flex-col cursor-pointer"
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
            </GameCard>

            <GameCard className="p-3 flex flex-col gap-2">
              <span className="text-white text-sm">Payment channel</span>
              <div className="flex gap-2">
                {channels.map((ch) => {
                  const isActive = activeChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all border"
                      style={{
                        backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)",
                        borderColor: isActive ? "rgb(200, 60, 90)" : "transparent",
                        color: "white",
                      }}
                    >
                      <img src={ch.icon} alt={ch.label} className="w-5 h-5 object-contain rounded" />
                      {ch.label}
                    </button>
                  );
                })}
              </div>
            </GameCard>

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
          </>
        ) : (
          <>
            <GameCard className="p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs">Balance:</span>
                <span className="text-white text-sm font-bold">₹{walletBalance.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-1 mt-1 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs">Turnover Progress:</span>
                  <span className="text-xs font-bold">₹{turnoverCompleted.toFixed(2)} / ₹{turnoverRequirement.toFixed(2)}</span>
                </div>
                <Progress
                  value={turnoverProgress}
                  className="h-2 border-[0.8px] border-[rgb(112,28,50)] bg-[rgb(112,28,50)] rounded-[20px] [&>div]:bg-[linear-gradient(105deg,#f5d742_100%,#51f542_90%,#a67a00_20%)]"
                />
                <div className="flex justify-end mt-0.5">
                  <span className=" text-green-500  text-[10px]">{turnoverProgress.toFixed(1)}% Completed</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/10">
                <span className=" text-[11px]">Daily Withdraw Limit:</span>
                <span className=" text-[11px]">₹{remainingLimit.toFixed(2)} / ₹{dailyLimit.toFixed(2)}</span>
              </div>
            </GameCard>

            <GameCard className="p-3 flex flex-col gap-2">
              <span className="text-white text-sm">Select Amount</span>
              <div className="grid grid-cols-3 gap-2">
                {WITHDRAW_AMOUNTS.map((amount) => {
                  const isActive = selectedWithdrawAmount === amount;
                  return (
                    <div
                      key={amount}
                      onClick={() => setSelectedWithdrawAmount(amount)}
                      className="relative rounded-md overflow-hidden flex flex-col cursor-pointer"
                      style={{ backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)" }}
                    >
                      {amount === 110 && (
                        <>
                          <img src={depositBadge} alt="" className="absolute top-0 left-0 w-10 h-5 object-contain" />
                          <span className="absolute top-0 left-4 text-white text-[8px] font-bold">1st</span>
                        </>
                      )}
                      <span className="text-white text-base text-center py-2">{amount.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </GameCard>

            <GameCard className="p-3 flex flex-col gap-2">
              <span className="text-white text-sm">Withdrawal Account</span>
              {withdrawInfo?.data?.isBankBound ? (
                <>
                  <div
                    className="flex items-center justify-between rounded-md px-3 py-2.5"
                    style={{ backgroundColor: "rgba(211, 54, 93, 0.2)" }}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-primary" />
                      <div className="flex flex-col">
                        <span className="text-white text-sm">{withdrawInfo?.data?.bindAccount?.bankName || bindAccount?.bankName || "Linked Bank"}</span>
                        {(withdrawInfo?.data?.bindAccount?.accountNumber || bindAccount?.accountNumber) && (
                          <span className="text-white text-xs">
                            **** **** **** {(withdrawInfo?.data?.bindAccount?.accountNumber || bindAccount?.accountNumber || "").slice(-4)}
                          </span>
                        )}
                      </div>
                    </div>
                    <GameButton
                      size="sm"
                      variant="gold"
                      className="text-xs px-3 h-8"
                      onClick={() => setShowViewAccount(true)}
                    >
                      View
                    </GameButton>
                  </div>
                  <p className="text-[11px] text-white/60">
                    Bank account can only be bound once per user. Contact support to change details.
                  </p>
                </>
              ) : (
                <div
                  onClick={() => setShowAddAccount(true)}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 cursor-pointer"
                  style={{ backgroundColor: "rgba(211, 54, 93, 0.2)" }}
                >
                  <div className="flex items-center gap-2">
                    <Wallet size={18} className="text-primary" />
                    <span className="text-yellow-400 text-sm">Add Account</span>
                  </div>
                  <PlusCircle size={20} className="text-white" />
                </div>
              )}
            </GameCard>

            <GameCard className="px-5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-white" />
                <span className="text-white text-sm">Withdrawal Fee</span>
              </div>
              <span className="text-primary text-sm">₹{feeAmount.toFixed(2)}</span>
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
              ₹{(activeTab === "deposit" ? selectedAmount : selectedWithdrawAmount).toLocaleString()}
            </span>
          </div>
          {activeTab === "deposit" && (
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-[10px]">Received</span>
              <span className="text-green-400 text-[10px] font-bold">₹{(selectedAmount + selectedDepositBonus).toLocaleString()}</span>
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
          className="rounded-md text-sm h-12 w-36"
          size="lg"
          variant="gold"
          onClick={activeTab === "deposit" ? handlePay : handleWithdraw}
          disabled={paying || withdrawing}
        >
          {paying ? "Processing..." : withdrawing ? "Processing..." : activeTab === "deposit" ? "Pay" : "Withdraw"}
        </GameButton>
      </div>

      <AddAccountDialog
        open={showAddAccount}
        onOpenChange={setShowAddAccount}
        onConfirm={handleBindAccount}
      />

      {withdrawInfo?.data?.isBankBound && (
        <GameDialog open={showViewAccount} onOpenChange={setShowViewAccount}>
          <GameDialogContent title="Bank Account Details">
            <GameDialogBody>
              <div className="w-full flex flex-col gap-2 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Account Holder</span>
                  <span className="text-white font-medium">{(withdrawInfo?.data?.bindAccount?.accountHolder || bindAccount?.accountHolder) ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Bank Name</span>
                  <span className="text-white font-medium">{(withdrawInfo?.data?.bindAccount?.bankName || bindAccount?.bankName) ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Account Number</span>
                  <span className="text-white font-medium">{(withdrawInfo?.data?.bindAccount?.accountNumber || bindAccount?.accountNumber) ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">IFSC / Bank Code</span>
                  <span className="text-white font-medium">{(withdrawInfo?.data?.bindAccount?.bankCode || bindAccount?.bankCode) ?? "-"}</span>
                </div>
              </div>
            </GameDialogBody>
            <GameDialogFooter>
              <GameButton variant="gold" size="lg" className="flex-1" onClick={() => setShowViewAccount(false)}>
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
