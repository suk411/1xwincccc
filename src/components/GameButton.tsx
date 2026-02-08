import * as React from "react";
import { cn } from "@/lib/utils";

import btnGreen from "@/assets/buttons/btn-green.png";
import btnBlack from "@/assets/buttons/btn-black.png";
import btnRed from "@/assets/buttons/btn-red.png";
import btnPurple from "@/assets/buttons/btn-purple.png";
import btngold from "@/assets/buttons/btn-gold.png";
import btndarkgold from "@/assets/buttons/btn-darkgold.png";
import btndarkred from "@/assets/buttons/btn-darkred.png";

const buttonImages = {
  green: btnGreen,
  black: btnBlack,
  red: btnRed,
  purple: btnPurple,
  gold: btngold,
  darkgold: btndarkgold,
  darkred: btndarkred,
};

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "black" | "red" | "purple" | "gold" | "darkgold" | "darkred";
  size?: "sm" | "lg";
  children: React.ReactNode;
}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant = "green", size = "lg", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 px-4 text-xs",
      lg: "h-10 px-6 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-bold text-white transition-transform active:scale-95 overflow-hidden rounded-sm",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Button background image */}
        <img
          src={buttonImages[variant]}
          alt=""
          className="absolute inset-0 w-full h-full object-fill pointer-events-none rounded-sm"
        />

        {/* Dark top-to-center overlay (rounded) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

        {/* Button text */}
        <span className="relative z-10 px-6 drop-shadow-md">{children}</span>
      </button>
    );
  }
);

GameButton.displayName = "GameButton";

export { GameButton };
