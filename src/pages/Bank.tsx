import PageLayout from "@/components/PageLayout";
import { GameButton } from "@/components/GameButton";

const Bank = () => {
  return (
    <PageLayout title="Bank">
      <div className="flex-1 flex flex-col gap-8 p-4">
        {/* Large Buttons */}
        <div className="space-y-3">
          <h2 className="text-white text-lg font-bold">Large Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <GameButton variant="green" size="lg">
              Deposit
            </GameButton>
            <GameButton variant="black" size="lg">
              Withdraw
            </GameButton>
            <GameButton variant="red" size="lg">
              Cancel
            </GameButton>
            <GameButton variant="purple" size="lg">
              Bonus
            </GameButton>
            <GameButton variant="gold" size="lg">
              Gold
            </GameButton>
            <GameButton variant="darkgold" size="lg" >
              Dark Gold
            </GameButton>
            <GameButton variant="darkred" size="lg">
              Dark Red
            </GameButton>
          </div>
        </div>

        {/* Small Buttons */}
        <div className="space-y-3">
          <h2 className="text-white text-lg font-bold">Small Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <GameButton variant="green" size="sm" className="w-20">
              Deposit
            </GameButton>
            <GameButton variant="black" size="sm">
              Withdraw
            </GameButton>
            <GameButton variant="red" size="sm">
              Cancel
            </GameButton>
            <GameButton variant="purple" size="sm">
              Bonus
            </GameButton>
            <GameButton variant="gold" size="sm">
              Gold
            </GameButton>
            <GameButton variant="darkgold" size="sm">
              Dark Gold
            </GameButton>
            <GameButton variant="darkred" size="sm">
              Dark Red
            </GameButton>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Bank;
