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
              <div >
                This is a demo dialog. You can put any content here, such as forms, information, or actions related to earning rewards in the game.
              </div>
            </GameDialogBody>
            <GameDialogFooter>
              <GameButton variant="black" size="lg" className=" w-2 flex-1" onClick={() => setOpen(false)}>
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
