import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { GameButton } from "@/components/GameButton";
import {
  GameDialog,
  GameDialogTrigger,
  GameDialogContent,
  GameDialogFooter,
} from "@/components/GameDialog";

const Earn = () => {
  const [open, setOpen] = useState(false);

  return (
    <PageLayout title="Earn">
      <div className="flex-1 flex items-center justify-center">
        <GameDialog open={open} onOpenChange={setOpen}>
          <GameDialogTrigger asChild>
            <GameButton variant="gold" size="lg">
              Open Dialog
            </GameButton>
          </GameDialogTrigger>
          <GameDialogContent title="Profile Info">
            <div className="text-white text-center py-8">
              Dialog content goes here
            </div>
            <GameDialogFooter
              onCancel={() => setOpen(false)}
              onConfirm={() => setOpen(false)}
            />
          </GameDialogContent>
        </GameDialog>
      </div>
    </PageLayout>
  );
};

export default Earn;
