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
              {/* Demo content */}
              <div className="text-white space-y-4 px-3">
             idiot i want content have same margin on both side
              </div><div className="text-white space-y-4 px-3">
             idiot i want content have same margin on both side
              </div>
            </GameDialogBody>
            <GameDialogFooter>
              <GameButton variant="black" size="lg" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </GameButton>
              <GameButton variant="gold" size="lg" className="flex-1" onClick={() => setOpen(false)}>
                Confirm
              </GameButton>
            </GameDialogFooter>
          </GameDialogContent>
        </GameDialog>
      </div>
    </PageLayout>
  );
};

export default Earn;
