import PageLayout from "@/components/PageLayout";
import { GameButton } from "@/components/GameButton";
import { GameInput } from "@/components/GameInput";
import { GameTabs } from "@/components/GameTabs";
import { toast } from "@/hooks/use-toast";
import { CreditCard, User, LayoutGrid, Clock, Gamepad2, Dice5 } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [name, setName] = useState("Sukfeg");
  const [activeTab, setActiveTab] = useState("all");

  const handleToast = () => {
    toast({ title: "Copy successful" });
  };

  return (
    <PageLayout title="Home">
      <div className="flex-1 flex flex-col items-center justify-start gap-4 px-4 pt-6">
        {/* GameTabs demo */}
        <div className="w-full max-w-sm">
          <GameTabs
            tabs={[
              { label: "All", value: "all", icon: <LayoutGrid size={14} /> },
              { label: "Recent", value: "recent", icon: <Clock size={14} /> },
              { label: "Slots", value: "slots", icon: <Gamepad2 size={14} /> },
              { label: "Casino", value: "casino", icon: <Dice5 size={14} /> },
                    { label: "cars", value: "cars", icon: <Gamepad2 size={14} /> },
              { label: "Casino", value: "casino", icon: <Dice5 size={14} /> },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* GameInput demo */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <GameInput
            icon={<CreditCard size={18} />}
            placeholder="Enter account number"
            hint="Enter 16 or 18-digit account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <GameInput
            icon={<CreditCard size={18} />}
            placeholder="Enter IFSC code"
            hint="Please enter 11 digits"
            error
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            onClear={() => setIfsc("")}
          />
          <GameInput
            icon={<User size={18} />}
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Existing buttons */}
        <div className="flex gap-3 mt-4">
          <GameButton variant="red" size="lg">Save QR</GameButton>
          <GameButton variant="gold" size="lg" onClick={handleToast}>Copy link</GameButton>
        </div>
        <div className="flex gap-3">
          <GameButton variant="red" size="sm">Small Red</GameButton>
          <GameButton variant="gold" size="sm">Small Gold</GameButton>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
