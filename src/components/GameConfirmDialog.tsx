import { GameDialog, GameDialogContent, GameDialogBody, GameDialogFooter } from "@/components/GameDialog";
import { GameButton } from "@/components/GameButton";
import { GameObject } from "@/services/gameService";

interface GameConfirmDialogProps {
  isOpen: boolean;
  game: GameObject | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const GameConfirmDialog: React.FC<GameConfirmDialogProps> = ({
  isOpen,
  game,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!game) return null;

  const handleConfirm = () => {
    onConfirm();
    // Close dialog immediately when confirming
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onCancel();
    }
  };

  return (
    <GameDialog open={isOpen} onOpenChange={handleOpenChange}>
      <GameDialogContent title="Play Game" showCloseButton={!isLoading}>
        <GameDialogBody>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-yellow-500/30">
              <img
                src={game.logo}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{game.name}</h3>
              <p className="text-white/60 text-sm">
                {game.provider.toUpperCase()}
              </p>
            </div>
            <p className="text-white/70 text-sm">
              Do you want to enter the game?
            </p>
          </div>
        </GameDialogBody>

        <GameDialogFooter>
          <div className="flex gap-2 w-full px-4 pb-4">
            <GameButton
              variant="dark"
              type="dialog"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </GameButton>
            <GameButton
              variant="red"
              type="dialog"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1"
            >
              Confirm
            </GameButton>
          </div>
        </GameDialogFooter>
      </GameDialogContent>
    </GameDialog>
  );
};

export default GameConfirmDialog;
