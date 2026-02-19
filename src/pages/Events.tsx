import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { GameTabs } from "@/components/GameTabs";
import firstDepositBanner from "@/assets/events/first-deposit-banner.png";
import casinoRebateBanner from "@/assets/events/casino-rebate-banner.png";
import groupBanner from "@/assets/events/group-banner.png";
import goldBorder from "@/assets/events/gold-border.png";

const tabs = [
  { label: "Deposit", value: "deposit" },
  { label: "Withdrawal", value: "withdrawal" },
];

interface EventCard {
  banner: string;
  title: string;
  description: string;
}

const depositEvents: EventCard[] = [
  {
    banner: firstDepositBanner,
    title: "First Deposit Carnival",
    description: "Get up to ₹20,000 bonus on your first deposit!",
  },
  {
    banner: groupBanner,
    title: "Join the Group",
    description: "Grab gift codes & claim cash daily up to ₹16,888",
  },
];

const withdrawalEvents: EventCard[] = [
  {
    banner: casinoRebateBanner,
    title: "Casino Rebate",
    description: "Lose? We pay you back! Loss rebate up to 30%",
  },
];

const Events = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const events = activeTab === "deposit" ? depositEvents : withdrawalEvents;

  return (
    <main className="relative flex-1 flex flex-col pb-20">
      <PageHeader title="Events" />

      <div className="px-3 mt-2">
        <GameTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="flex flex-col gap-4 px-3 mt-3">
        {events.map((event, i) => (
          <div key={i} className="relative rounded-xl overflow-hidden">
            {/* Gold border frame */}
            <img
              src={goldBorder}
              alt=""
              className="absolute inset-0 w-full h-full z-10 pointer-events-none"
              style={{ objectFit: "fill" }}
            />

            {/* Card content */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            >
              {/* Banner */}
              <img
                src={event.banner}
                alt={event.title}
                className="w-full h-auto object-cover rounded-t-lg"
              />

              {/* Info */}
              <div className="p-3">
                <h3 className="text-white font-bold text-sm">{event.title}</h3>
                <p className="text-[#c4889a] text-xs mt-1">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Events;
