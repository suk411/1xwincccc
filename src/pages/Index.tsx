import PageLayout from "@/components/PageLayout";
import { GameButton } from "@/components/GameButton";

const Index = () => {
  return (
    <PageLayout title="Home">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-3">
          <GameButton variant="gradient-red" size="lg">
            Save QR
          </GameButton>
          <GameButton variant="gradient-gold" size="lg">
            Copy link
          </GameButton>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
