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
            <GameButton variant="red" size="lg">
              Cancel
            </GameButton>
            <GameButton variant="gold" size="lg">
              Confirm
            </GameButton>
          </div>
        </div>

        {/* Small Buttons */}
        <div className="space-y-3">
          <h2 className="text-white text-lg font-bold">Small Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <GameButton variant="red" size="sm">
              Cancel
            </GameButton>
            <GameButton variant="gold" size="sm">
              Confirm
            </GameButton>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Bank;
