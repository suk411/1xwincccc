import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import headerBg from "@/assets/dailog/headbg.jpg";
import closeIcon from "@/assets/icons/close-icon.png";
import { GameButton } from "./GameButton";

const GameDialog = DialogPrimitive.Root;
const GameDialogTrigger = DialogPrimitive.Trigger;
const GameDialogPortal = DialogPrimitive.Portal;
const GameDialogClose = DialogPrimitive.Close;

const GameDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
GameDialogOverlay.displayName = "GameDialogOverlay";

interface GameDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title?: string;
  showCloseButton?: boolean;
}

const GameDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  GameDialogContentProps
>(({ className, children, title, showCloseButton = true, ...props }, ref) => (
  <GameDialogPortal>
    <GameDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-[90%] max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      style={{ backgroundColor: "#330914" }}
      {...props}
    >
      {/* Header with background image */}
      <div className="relative h-12 flex items-center justify-center">
        <img
          src={headerBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {title && (
          <h2 className="relative z-10 text-white font-bold text-lg tracking-wide">
            {title}
          </h2>
        )}
        
        {/* Close button */}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 transition-transform duration-150 active:scale-90">
            <img
              src={closeIcon}
              alt="Close"
              className="w-full h-full object-contain"
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </div>

      {/* Content area */}
      <div className="p-4">
        {children}
      </div>
    </DialogPrimitive.Content>
  </GameDialogPortal>
));
GameDialogContent.displayName = "GameDialogContent";

interface GameDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
}

const GameDialogFooter = ({
  className,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  ...props
}: GameDialogFooterProps) => (
  <div
    className={cn("flex gap-3 px-4 pb-4", className)}
    {...props}
  >
    <GameButton
      variant="black"
      size="lg"
      className="flex-1"
      onClick={onCancel}
    >
      {cancelText}
    </GameButton>
    <GameButton
      variant="gold"
      size="lg"
      className="flex-1"
      onClick={onConfirm}
    >
      {confirmText}
    </GameButton>
  </div>
);
GameDialogFooter.displayName = "GameDialogFooter";

export {
  GameDialog,
  GameDialogPortal,
  GameDialogOverlay,
  GameDialogClose,
  GameDialogTrigger,
  GameDialogContent,
  GameDialogFooter,
};
