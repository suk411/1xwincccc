import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { GameCard } from "@/components/GameCard";
import { GameButton } from "@/components/GameButton";
import earnBanner from "@/assets/earn/earn-banner.png";
import goldBorder from "@/assets/events/gold-border.png";
import emptyBox from "@/assets/events/empty-box.png";
import level1Bg from "@/assets/earn/level1-bg.png";
import level2Bg from "@/assets/earn/level2-bg.png";
import level3Bg from "@/assets/earn/level3-bg.png";
import agentMapTree from "@/assets/earn/agent-map-tree.png";

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
        <span className="text-white/70 text-xs">{label}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-white text-sm font-medium">{reward}</span>
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center border border-white/30"
      >
        <span className="text-white/60 text-[10px]">?</span>
      </div>
    </div>
  </div>
);

const RecordsCard = () => {
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

      {/* Table Header */}
      <div className="flex items-center justify-between px-2 py-1">
        {recordTab === "invitation" ? (
          <>
            <span className="text-white/60 text-xs">Created Time</span>
            <span className="text-white/60 text-xs">User ID</span>
          </>
        ) : (
          <>
            <span className="text-white/60 text-xs">Date</span>
            <span className="text-white/60 text-xs">Invites</span>
            <span className="text-white/60 text-xs">Regular</span>
            <span className="text-white/60 text-xs">Depositor</span>
            <span className="text-white/60 text-xs">Reward</span>
          </>
        )}
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <img src={emptyBox} alt="No records" className="w-24 h-24 object-contain opacity-50" />
        <span className="text-white/40 text-sm">No Invite Records</span>
      </div>
    </GameCard>
  );
};

const Earn = () => {
  const [activeTab, setActiveTab] = useState<"referral" | "commission">("referral");

  return (
    <main className="relative flex-1 flex flex-col pb-36 max-w-screen-lg mx-auto w-full">
      <PageHeader title="Earn" />

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
            Commission
          </button>
        </GameCard>

        {/* Banner */}
        <div className="relative rounded-xl overflow-hidden">
          <img src={goldBorder} alt="" className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ objectFit: "fill" }} />
          <img src={earnBanner} alt="Earn up to ₹88" className="w-full h-auto object-cover rounded-xl" />
        </div>

        {activeTab === "referral" ? (
          <>
            {/* Bonus Card */}
            <GameCard className="p-3 flex flex-col gap-3">
              <div>
                <span className="text-white/70 text-xs">Pending Bonus</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#f5c842] text-xl font-bold">₹0</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-white font-medium" style={{ backgroundColor: "rgb(5, 121, 45)" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.168.073L8.559 3.958a.15.15 0 01-.16.352H6.732a.15.15 0 00-.21.131c-.125.905-.877 4.905-4.45 5.497a.1.1 0 01-.133-.06.1.1 0 01.014-.118c.612-.48 1.412-1.41 1.637-3.063.086-.672.128-1.349.125-2.026a.15.15 0 00-.212-.152H1.615a.15.15 0 01-.16-.352L4.848.073a.15.15 0 01.32 0z" fill="white"/></svg>
                    Today's Earnings+₹0
                  </span>
                </div>
              </div>
              <div className="w-full h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
              <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "rgb(112, 28, 50)" }}>
                <div>
                  <span className="text-white/70 text-xs">Claimable Bonus</span>
                  <p className="text-white text-base font-bold">₹0</p>
                </div>
                <GameButton variant="gold" size="sm" className="w-36 rounded-md">Claim Now</GameButton>
              </div>
            </GameCard>

            {/* Invite Stats Card */}
            <GameCard className="p-3 flex flex-col gap-2">
              <InviteRow icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.333 6.667a2.333 2.333 0 100-4.667 2.333 2.333 0 000 4.667z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.333 13.599V14h10v-.401c0-1.494 0-2.24-.291-2.811a2.67 2.67 0 00-1.166-1.165c-.57-.291-1.317-.291-2.81-.291H5.6c-1.494 0-2.24 0-2.811.29a2.67 2.67 0 00-1.166 1.166c-.29.57-.29 1.317-.29 2.81z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.667 4.332v4M10.667 6.332h4" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Total Invites" values={[0, 0, 0]} reward="₹10/ 👤" />
              <InviteRow icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.333 6.667a2.333 2.333 0 100-4.667 2.333 2.333 0 000 4.667z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.667 5.334l2 2 2-2" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.333 13.601V14h10v-.399c0-1.494 0-2.24-.291-2.811a2.67 2.67 0 00-1.166-1.165c-.57-.291-1.317-.291-2.81-.291H5.6c-1.494 0-2.24 0-2.811.29a2.67 2.67 0 00-1.166 1.166c-.29.57-.29 1.317-.29 2.81z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Valid Invites" values={[0, 0, 0]} reward="₹30/ 👤" />
              <InviteRow icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.333 2.666v4c0 .736-1.343 1.333-3 1.333s-3-.597-3-1.333v-4" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.333 4.666c0 .736-1.343 1.333-3 1.333s-3-.597-3-1.333" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.333 2.667c0 .737-1.343 1.334-3 1.334s-3-.597-3-1.334C1.333 1.93 2.677 1.334 4.333 1.334s3 .597 3 1.333z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.667 2h2a1.333 1.333 0 011.333 1.333v2" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.333 14H3.333A1.333 1.333 0 012 12.666v-2" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.667 11.333a1.667 1.667 0 100-3.333 1.667 1.667 0 000 3.333z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.667 14.666H8.667c0-1.657 1.343-3 3-3s3 1.343 3 3z" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Deposit Invites" values={[0, 0, 0]} reward="₹48/ 👤" />
              <InviteRow icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="10" fill="#B12C49"/><path fillRule="evenodd" clipRule="evenodd" d="M10 14.375a4.375 4.375 0 004.375-4.375H10V5.625A4.375 4.375 0 005.625 10 4.375 4.375 0 0010 14.375z" stroke="#FF9FA7" strokeWidth="1.01" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M11.458 8.542V5.875a4.38 4.38 0 012.667 2.667h-2.667z" stroke="#FF9FA7" strokeWidth="1.01" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Core Users" values={[0, 0, 0]} reward="₹100/ 👤" />
            </GameCard>

            {/* Invitation Records / Daily Bonus Records */}
            <RecordsCard />
          </>
        ) : (
          <>
            {/* Commission Card */}
            <GameCard className="p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "rgb(112, 28, 50)" }}>
                <div>
                  <span className="text-white/70 text-xs">Claimable Bonus</span>
                  <p className="text-[#f5c842] text-xl font-bold mt-0.5">₹0</p>
                </div>
               <GameButton variant="gold" size="sm" className="w-36 rounded-md">Claim Now</GameButton>
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "rgb(112, 28, 50)" }}>
                <div>
                  <span className="text-white/70 text-xs">Pending Bonus</span>
                  <p className="text-[#f5c842] text-base font-bold mt-0.5">₹0</p>
                </div>
                <div className="text-right">
                  <span className="text-white/70 text-xs">Next Payout Time</span>
                  <p className="text-[#f5c842] text-base font-bold mt-0.5">06:15:36</p>
                </div>
              </div>
            </GameCard>

            {/* Daily Team Data */}
            <GameCard className="p-3 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" rx="10" fill="#AC4059"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 14.375C12.4163 14.375 14.375 12.4162 14.375 10H10V5.625C7.58378 5.625 5.62503 7.58375 5.62503 10C5.62503 12.4162 7.58378 14.375 10 14.375Z" stroke="#FA829D" strokeWidth="1.01" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.4581 8.54188V5.875C12.7033 6.31704 13.683 7.2967 14.125 8.54188H11.4581Z" stroke="#FA829D" strokeWidth="1.01" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white font-bold text-sm">Daily Team Data</span>
              </div>

              {/* Level 1 */}
              <div className="rounded-lg overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${level1Bg})` }}>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-white font-bold text-sm">Level 1 Team</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-xs">👤 0</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] text-white font-medium" style={{ backgroundColor: "rgb(5, 121, 45)" }}>
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5.168.073L8.559 3.958a.15.15 0 01-.16.352H6.732a.15.15 0 00-.21.131c-.125.905-.877 4.905-4.45 5.497a.1.1 0 01-.133-.06.1.1 0 01.014-.118c.612-.48 1.412-1.41 1.637-3.063.086-.672.128-1.349.125-2.026a.15.15 0 00-.212-.152H1.615a.15.15 0 01-.16-.352L4.848.073a.15.15 0 01.32 0z" fill="white"/></svg>
                      +0
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <span className="text-white/60 text-[10px]">Commission</span>
                    <p className="text-white text-sm font-bold">₹0</p>
                  </div>
                  <div className="text-center">
                    <span className="text-white/60 text-[10px]">Deposits</span>
                    <p className="text-white text-sm font-bold">= ₹0</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>
                      <span className="text-white/60 text-[10px]">Ratio</span>
                      <p className="text-white text-sm font-bold">× 5%</p>
                    </div>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white/60 text-[8px]">?</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="rounded-lg overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${level2Bg})` }}>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-white font-bold text-sm">Level 2 Team</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-xs">👤 0</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] text-white font-medium" style={{ backgroundColor: "rgb(5, 121, 45)" }}>
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5.168.073L8.559 3.958a.15.15 0 01-.16.352H6.732a.15.15 0 00-.21.131c-.125.905-.877 4.905-4.45 5.497a.1.1 0 01-.133-.06.1.1 0 01.014-.118c.612-.48 1.412-1.41 1.637-3.063.086-.672.128-1.349.125-2.026a.15.15 0 00-.212-.152H1.615a.15.15 0 01-.16-.352L4.848.073a.15.15 0 01.32 0z" fill="white"/></svg>
                      +0
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <span className="text-white/60 text-[10px]">Commission</span>
                    <p className="text-white text-sm font-bold">₹0</p>
                  </div>
                  <div className="text-center">
                    <span className="text-white/60 text-[10px]">Deposits</span>
                    <p className="text-white text-sm font-bold">= ₹0</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>
                      <span className="text-white/60 text-[10px]">Ratio</span>
                      <p className="text-white text-sm font-bold">× 1%</p>
                    </div>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white/60 text-[8px]">?</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 3 */}
              <div className="rounded-lg overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${level3Bg})` }}>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-white font-bold text-sm">Level 3 Team</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-xs">👤 0</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] text-white font-medium" style={{ backgroundColor: "rgb(5, 121, 45)" }}>
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5.168.073L8.559 3.958a.15.15 0 01-.16.352H6.732a.15.15 0 00-.21.131c-.125.905-.877 4.905-4.45 5.497a.1.1 0 01-.133-.06.1.1 0 01.014-.118c.612-.48 1.412-1.41 1.637-3.063.086-.672.128-1.349.125-2.026a.15.15 0 00-.212-.152H1.615a.15.15 0 01-.16-.352L4.848.073a.15.15 0 01.32 0z" fill="white"/></svg>
                      +0
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <span className="text-white/60 text-[10px]">Commission</span>
                    <p className="text-white text-sm font-bold">₹0</p>
                  </div>
                  <div className="text-center">
                    <span className="text-white/60 text-[10px]">Deposits</span>
                    <p className="text-white text-sm font-bold">= ₹0</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>
                      <span className="text-white/60 text-[10px]">Ratio</span>
                      <p className="text-white text-sm font-bold">× 0.5%</p>
                    </div>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white/60 text-[8px]">?</span>
                    </div>
                  </div>
                </div>
              </div>
            </GameCard>

            {/* Agent Map */}
            <GameCard className="p-3 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="#AC4059"/>
                  <path d="M5.73329 11.0669C6.32239 11.0669 6.79996 10.5894 6.79996 10.0003C6.79996 9.41117 6.32239 8.93359 5.73329 8.93359C5.14419 8.93359 4.66663 9.41117 4.66663 10.0003C4.66663 10.5894 5.14419 11.0669 5.73329 11.0669Z" stroke="#FA829D" strokeLinejoin="round"/>
                  <path d="M14.8 5.73317C15.0946 5.73317 15.3333 5.49439 15.3333 5.19984C15.3333 4.90529 15.0946 4.6665 14.8 4.6665C14.5054 4.6665 14.2667 4.90529 14.2667 5.19984C14.2667 5.49439 14.5054 5.73317 14.8 5.73317Z" stroke="#FA829D" strokeLinejoin="round"/>
                  <path d="M14.7999 10.533C15.0945 10.533 15.3332 10.2942 15.3332 9.99964C15.3332 9.70508 15.0945 9.46631 14.7999 9.46631C14.5053 9.46631 14.2666 9.70508 14.2666 9.99964C14.2666 10.2942 14.5053 10.533 14.7999 10.533Z" stroke="#FA829D" strokeLinejoin="round"/>
                  <path d="M14.7999 15.3338C15.0945 15.3338 15.3332 15.095 15.3332 14.8004C15.3332 14.5059 15.0945 14.2671 14.7999 14.2671C14.5053 14.2671 14.2666 14.5059 14.2666 14.8004C14.2666 15.095 14.5053 15.3338 14.7999 15.3338Z" stroke="#FA829D" strokeLinejoin="round"/>
                  <path d="M12.1332 5.20068H8.93323V14.8007H12.1332" stroke="#FA829D" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.79999 10H12.1333" stroke="#FA829D" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white font-bold text-sm">Agent Map</span>
              </div>

              <div className="flex justify-center">
                <img src={agentMapTree} alt="Agent Map Tree" className="w-full max-w-[300px] h-auto object-contain" />
              </div>

              {/* Level Labels */}
              <div className="flex flex-col gap-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-medium" style={{ backgroundColor: "#AC4059" }}>Level 1 Team</span>
                  <span>(A1+B1+...) ×(5~10%)=Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-medium" style={{ backgroundColor: "#5B4FA0" }}>Level 2 Team</span>
                  <span>(A21+B22+...) ×(1~2%)=Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-medium" style={{ backgroundColor: "#7B2D8E" }}>Level 3 Team</span>
                  <span>(A31+B23+...) ×(0.5~1%)=Commission</span>
                </div>
              </div>
            </GameCard>
          </>
        )}
      </div>

      {/* Fixed bottom Invite Friends bar */}
      <div
        className="fixed bottom-10 pb-12 left-0 right-0 z-30 px-4 py-3 flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(180deg, #9c1735 0%, #480816 100%)",
        }}
      >
        <GameButton className="w-full rounded-full text-base" size="lg" variant="gold">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0">
            <path d="M9.16667 1.83398L15.1667 7.83398L9.16667 13.5007V9.83398C4.5 9.83398 2.5 14.834 2.5 14.834C2.5 9.16732 4.16667 5.50065 9.16667 5.50065V1.83398Z" stroke="#7B1C0C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Invite Friends
        </GameButton>
      </div>
    </main>
  );
};

export default Earn;
