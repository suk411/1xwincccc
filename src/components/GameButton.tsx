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

const gradientStyles = {
  "gradient-red": "linear-gradient(0deg, rgb(150, 29, 42) 2%, rgb(99, 10, 23) 14%, rgb(89, 12, 24) 25%, rgb(166, 26, 48) 69%, rgb(255, 74, 102) 100%)",
  "gradient-gold": "linear-gradient(rgb(255, 246, 230) 1%, rgb(238, 210, 110) 44%, rgb(195, 132, 45) 75%, rgb(195, 132, 45) 86%, rgb(255, 205, 78) 100%)",
};

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "black" | "red" | "purple" | "gold" | "darkgold" | "darkred" | "gradient-red" | "gradient-gold";
  size?: "sm" | "lg";
  children: React.ReactNode;
}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant = "green", size = "lg", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 px-2 text-xs",
      lg: "h-10 px-4 text-sm",
    };

    const isGradient = variant === "gradient-red" || variant === "gradient-gold";
    const textColor = variant === "gradient-gold" ? "text-[#5a2d0a]" : "text-white";

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-bold transition-transform active:scale-95 overflow-hidden rounded-md border",
          sizeClasses[size],
          textColor,
          isGradient ? "border-black/30" : "border-transparent",
          className
        )}
        style={isGradient ? { backgroundImage: gradientStyles[variant] } : undefined}
        {...props}
      >
        {/* Button background image (for non-gradient variants) */}
        {!isGradient && (
          <img
            src={buttonImages[variant as keyof typeof buttonImages]}
            alt=""
            className="absolute inset-0 w-full h-full object-fill pointer-events-none rounded-sm"
          />
        )}

        {/* Dark top-to-center overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

        {/* Button text */}
        <span className="relative z-10 px-6 drop-shadow-md">{children}</span>
      </button>
    );
  }
);

GameButton.displayName = "GameButton";

export { GameButton };
