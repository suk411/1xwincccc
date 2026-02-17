import { useNavigate } from "react-router-dom";
import { GameCard } from "@/components/GameCard";
import headerBg from "@/assets/bank/header-bg.png";
import bankIcon from "@/assets/bank/bank-icon.png";
import backArrow from "@/assets/icons/back-arrow.png";
import depositBadge from "@/assets/bank/deposit-badge.png";
import upiLogo from "@/assets/bank/upi-logo.png";
import usdtLogo from "@/assets/bank/usdt-logo.png";
import upayLogo from "@/assets/bank/upay-logo.png";
import giftBox from "@/assets/bank/gift-box-small.png";
import eventBg from "@/assets/bank/event-bg.png";
import { useState } from "react";
import { Info, ClipboardCheck, ChevronRight, Check, PlusCircle, Wallet, CreditCard, CheckCircle } from "lucide-react";
import AddAccountDialog, { type BankAccount } from "@/components/bank/AddAccountDialog";
import { GameButton } from "@/components/GameButton";

const DEPOSIT_AMOUNTS = [200, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000];
const WITHDRAW_AMOUNTS = [110, 200, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000];

const Bank = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [selectedAmount, setSelectedAmount] = useState(200);
  const [selectedWithdrawAmount, setSelectedWithdrawAmount] = useState(110);
  const [activeChannel, setActiveChannel] = useState("upi");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountIdx, setSelectedAccountIdx] = useState<number>(0);

  const channels = [
    { id: "upi", label: "UPI", icon: upiLogo },
    { id: "usdt", label: "USDT", icon: usdtLogo },
    { id: "upay", label: "UPAY", icon: upayLogo },
  ];

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
      {/* Top Header with red bg */}
      <div className="relative w-full h-12 flex items-center justify-between px-4">
        <img
          src={headerBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Left: icon + balance */}
        <div className="relative z-10 flex items-center gap-2">
          <img src={bankIcon} alt="Bank" className="w-8 h-8 object-contain" />
          <div className="flex items-center gap-1">
            <span className="text-white/70 text-sm">Balance:</span>
            <span className="text-primary font-bold text-base">₹1.4</span>
          </div>
        </div>
        {/* Right: records & help icons */}
        <div className="relative z-10 flex items-center gap-3">
          <ClipboardCheck size={20} className="text-white cursor-pointer mr-4" onClick={() => navigate("/bank/records")} />
        
        </div>
      </div>

      <div className="flex flex-col gap-2 px-2 pt-2">
        {/* Deposit / Withdraw tabs */}
        <GameCard className="flex gap-1">
          <button
            onClick={() => setActiveTab("deposit")}
            className="flex-1 h-8 rounded-sm  text-sm transition-all"
            style={
              activeTab === "deposit"
                ? {
                    backgroundImage:
                      "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                    color: "#5a2d0a",
                  }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className="flex-1 h-8 rounded-md text-sm  transition-all"
            style={
              activeTab === "withdraw"
                ? {
                    backgroundImage:
                      "linear-gradient(166deg, #ffe786 0%, #ffb753 68%, #ffa74a 98%)",
                    color: "#5a2d0a",
                  }
                : { color: "rgba(255,255,255,0.7)" }
            }
          >
            Withdraw
          </button>
        </GameCard>

        {activeTab === "deposit" ? (
          <>
            {/* Pending orders */}
            <GameCard className="px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-red-600" />
                <span className="text-white text-xs">You have 1 pending orders</span>
              </div>
              <ChevronRight size={18} className="text-white" />
            </GameCard>

            {/* Choose Deposit Amount */}
            <GameCard className="p-2 flex flex-col gap-2">
              <span className="text-white  text-sm">Choose Deposit Amount</span>
              <div className="grid grid-cols-3 gap-2">
                {DEPOSIT_AMOUNTS.map((amount) => {
                  const isActive = selectedAmount === amount;
                  return (
                    <div
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className="relative rounded-md overflow-hidden flex flex-col cursor-pointer"
                      style={{
                        backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)",
                      }}
                    >
                      <img src={depositBadge} alt="" className="absolute top-0left-0 w-12 h-5 object-contain" />
                      <span className="absolute top-0  left-4 text-white text-[8px] font-bold">1st</span>
                      <span className="text-white text-base text-center pt-2.5  pb-0.5">{amount.toLocaleString()}</span>
                      <div
                        className="text-center text-[11px] font-bold  rounded-b-md"
                        style={{
                          backgroundImage: "linear-gradient(156deg, rgb(255, 213, 103) 0%, rgb(255, 167, 74) 98%)",
                          color: "#5a2d0a",
                        }}
                      >
                        +1.4
                      </div>
                    </div>
                  );
                })}
              </div>
            </GameCard>

            {/* Payment Channel */}
            <GameCard className="p-3 flex flex-col gap-2">
              <span className="text-white  text-sm">Payment channel</span>
              <div className="flex gap-2">
                {channels.map((ch) => {
                  const isActive = activeChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs  transition-all border"
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

            {/* Deposit Event */}
            <GameCard className="p-3 flex flex-col gap-2">
              <span className="text-white font-bold text-sm">Deposit Event</span>
              <div
                className="relative rounded-lg  flex items-center gap-3 px-3 py-3"
                style={{ backgroundImage: `url(${eventBg})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
              >
                <img src={giftBox} alt="Gift" className="w-16 h-16 object-contain" />
                <div className="flex flex-col flex-1">
                  <span className="text-white text-[10px] font-bold">First Deposit</span>
                  <span className="text-green-500 font-bold text-sm">100% Deposit  Bonus</span>
                  <span className="text-white/60 text-[10px]">3x Turnover required on total amount</span>
                </div>
                
              </div>
            </GameCard>
          </>
        ) : (
          <>
            {/* Withdrawable & Restricted */}
            <GameCard className="p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs ">Withdrawable:</span>
                <span className="text-white text-sm">₹50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs ">Restricted Amount:</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary text-xs">₹0</span>
                <button className="text-primary text-xs underline">Turnover History</button>
              </div>
            </GameCard>

            {/* Select Withdraw Amount */}
            <GameCard className="p-3 flex flex-col gap-2">
              <span className="text-white  text-sm">Select Amount</span>
              <div className="grid grid-cols-3 gap-2">
                {WITHDRAW_AMOUNTS.map((amount) => {
                  const isActive = selectedWithdrawAmount === amount;
                  return (
                    <div
                      key={amount}
                      onClick={() => setSelectedWithdrawAmount(amount)}
                      className="relative rounded-md overflow-hidden flex flex-col cursor-pointer"
                      style={{
                        backgroundColor: isActive ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)",
                      }}
                    >
                      {amount === 110 && (
                        <>
                          <img src={depositBadge} alt="" className="absolute top-0 left-0 w-10 h-5 object-contain" />
                          <span className="absolute top-0 left-4 text-white text-[8px] font-bold">1st</span>
                        </>
                      )}
                      <span className="text-white  text-base text-center py-2">{amount.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </GameCard>

            {/* Withdrawal Account */}
            <GameCard className="p-3 flex flex-col gap-2">
              <span className="text-white  text-sm">Withdrawal Account</span>

              {savedAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAccountIdx(idx)}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 cursor-pointer"
                  style={{
                    backgroundColor: selectedAccountIdx === idx ? "rgb(177, 44, 73)" : "rgba(211, 54, 93, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-white" />
                    <div className="flex flex-col">
                      <span className="text-white text-sm ">{acc.name}</span>
                      <span className="text-white text-xs">{acc.accountNumber}</span>
                    </div>
                  </div>
                  {selectedAccountIdx === idx && (
                    <CheckCircle size={20} className="text-primary" />
                  )}
                </div>
              ))}

              <div
                onClick={() => setShowAddAccount(true)}
                className="flex items-center justify-between rounded-md px-3 py-2.5 cursor-pointer"
                style={{ backgroundColor: "rgba(211, 54, 93, 0.2)" }}
              >
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-red-500" />
                  <span className="text-yellow-400 text-sm ">Add Account</span>
                </div>
                <PlusCircle size={20} className="text-white" />
              </div>
            </GameCard>

            {/* Withdrawal Fee */}
            <GameCard className="px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-white" />
                <span className="text-white text-sm ">Withdrawal Fee</span>
              </div>
              <span className="text-primary  text-sm">₹3.3</span>
            </GameCard>
          </>
        )}

      </div>

      {/* Fixed bottom payment bar */}
      <div
        className="fixed bottom-10 pb-12  left-0 right-0 z-30 px-4  py-3 flex items-center justify-between"
        style={{
          backgroundImage: "linear-gradient(180deg, #9c1735 0%, #480816 100%)",
        }}
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
              <span className="text-green-400 text-[10px] font-bold">₹{(selectedAmount + 1.4).toLocaleString()}</span>
              <span className="text-white/50 text-[10px]">Bonus</span>
              <span className="text-primary text-[10px] font-bold">₹1.4</span>
            </div>
          )}
          {activeTab === "withdraw" && (
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-[10px]">Fee</span>
              <span className="text-primary text-[10px] font-bold">₹3.3</span>
            </div>
          )}
        </div>
        <GameButton className="px-8 mx-2 rounded-md  text-sm" size="sm" variant="gold">
          {activeTab === "deposit" ? "Pay" : "Withdraw"}
        </GameButton>
          

      </div>

      <AddAccountDialog
        open={showAddAccount}
        onOpenChange={setShowAddAccount}
        onConfirm={(account) => {
          setSavedAccounts((prev) => [...prev, account]);
          setSelectedAccountIdx(savedAccounts.length);
          setShowAddAccount(false);
        }}
      />
    </main>
  );
};

export default Bank;
