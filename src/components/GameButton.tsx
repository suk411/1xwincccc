import * as React from "react";
import { cn } from "@/lib/utils";

const gradientStyles = {
  red: "linear-gradient(0deg, rgb(150, 29, 42) 2%, rgb(99, 10, 23) 14%, rgb(89, 12, 24) 25%, rgb(166, 26, 48) 69%, rgb(255, 74, 102) 100%)",
  gold: "linear-gradient(rgb(255, 246, 230) 1%, rgb(238, 210, 110) 44%, rgb(195, 132, 45) 75%, rgb(195, 132, 45) 86%, rgb(255, 205, 78) 100%)",
  mute: "radial-gradient(ellipse at center, rgba(129, 43, 54, 0.5) 0%, rgba(129, 43, 54, 0.3) 70%, rgba(129, 43, 54, 0.1) 100%)",
};

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "red" | "gold" | "mute";
  size?: "sm" | "lg";
  children: React.ReactNode;
}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant = "red", size = "lg", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-20 px-4 ",
      lg: "h-10 w-24 px-6 ",
    };

    const textColor = variant === "gold" ? "text-[#5a2d0a]" : "text-white";
    const borderColor = variant === "mute" 
      ? "border-[rgba(183,69,83,0.5)] border-solid" 
      : "border-black/30";

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center  transition-transform active:scale-95 overflow-hidden rounded-[4px] border",
          sizeClasses[size],
          textColor,
          borderColor,
          className
        )}
        style={{ backgroundImage: gradientStyles[variant] }}
        {...props}
      >
        {/* Subtle highlight overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Button text */}
        <span className="relative z-10 drop-shadow-sm">{children}</span>
      </button>
    );
  }
);

GameButton.displayName = "GameButton";

export { GameButton };
