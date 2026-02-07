import * as React from "react";
import { cn } from "@/lib/utils";

import btnGreen from "@/assets/buttons/btn-green.png";
import btnBlack from "@/assets/buttons/btn-black.png";
import btnRed from "@/assets/buttons/btn-red.png";
import btnPurple from "@/assets/buttons/btn-purple.png";

const buttonImages = {
  green: btnGreen,
  black: btnBlack,
  red: btnRed,
  purple: btnPurple,
};

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "black" | "red" | "purple";
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
          "relative inline-flex items-center justify-center font-bold text-white transition-transform active:scale-95",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Button background image */}
        <img
          src={buttonImages[variant]}
          alt=""
          className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        />
        {/* Button text */}
        <span className="relative z-10 px-6 drop-shadow-md">{children}</span>
      </button>
    );
  }
);

GameButton.displayName = "GameButton";

export { GameButton };
