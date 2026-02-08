import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import headerBg from "@/assets/dailog/headbg.jpg";
import closeIcon from "@/assets/icons/close-icon.png";

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
        "fixed left-[50%] top-[50%] z-50 w-[90%] max-w-sm max-h-[70vh] translate-x-[-50%] translate-y-[-50%] rounded-xl shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] flex flex-col overflow-hidden",
        className
      )}
      style={{ backgroundColor: "#330914" }}
      {...props}
    >
      {/* Header with background image */}
      <div className="relative h-12 flex-shrink-0 flex items-center justify-center">
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

      {/* Content wrapper */}
      {children}
    </DialogPrimitive.Content>
  </GameDialogPortal>
));
GameDialogContent.displayName = "GameDialogContent";

const GameDialogBody = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex-1 overflow-y-auto px-4 py-4 scrollbar-hide flex flex-col items-center text-center", 
      className
    )}
    {...props}
  >
    <div className="w-full max-w-[90%]">
      {children}
    </div>
  </div>
);
GameDialogBody.displayName = "GameDialogBody";

const GameDialogFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex-shrink-0 flex gap-3 w-full px-4 pb-4 pt-2 justify-center", className)}
    {...props}
  >
    {children}
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
  GameDialogBody,
  GameDialogFooter,
};
