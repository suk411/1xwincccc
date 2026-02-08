import PageLayout from "@/components/PageLayout";
import { GameButton } from "@/components/GameButton";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const handleToast = () => {
    toast({
      title: "Copy sdfsdfasdfsdfsdfsdfasdfasfdsucfsdfsdfblasdhgfkjasdfasdfcessful",
    });
  };

  return (
    <PageLayout title="Home">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-3">
          <GameButton variant="red" size="lg">
            Save QR
          </GameButton>
          <GameButton variant="gold" size="lg" onClick={handleToast}>
            Copy link
          </GameButton>
        </div>
        <div className="flex gap-3">
          <GameButton variant="red" size="sm">
            Small Red
          </GameButton>
          <GameButton variant="gold" size="sm">
            Small Gold
          </GameButton>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
