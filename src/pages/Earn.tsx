import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { GameButton } from "@/components/GameButton";
import {
  GameDialog,
  GameDialogTrigger,
  GameDialogContent,
  GameDialogBody,
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
            <GameDialogBody>
              {/* Demo content to test scrolling */}
              <div className="text-white space-y-4">
                <p>Dialog content goes here</p>
                <p>More content...</p>
                <p>Even more content...</p>
                <p>Scroll test content...</p>
                <p>Additional content...</p>
                <p>More scrollable content...</p>
                <p>Keep scrolling...</p>
                <p>Almost there...</p>
                <p>Final content item</p>
              </div>
            </GameDialogBody>
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
