import * as React from "react";
import { cn } from "@/lib/utils";

const gradientStyles = {
  red: "linear-gradient(0deg, rgb(150, 29, 42) 2%, rgb(99, 10, 23) 14%, rgb(89, 12, 24) 25%, rgb(166, 26, 48) 69%, rgb(255, 74, 102) 100%)",
  gold: "linear-gradient(rgb(255, 246, 230) 1%, rgb(238, 210, 110) 44%, rgb(195, 132, 45) 75%, rgb(195, 132, 45) 86%, rgb(255, 205, 78) 100%)",
};

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "red" | "gold";
  size?: "sm" | "lg";
  children: React.ReactNode;
}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant = "red", size = "lg", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 px-4 text-xs",
      lg: "h-10 px-6 text-sm",
    };

    const textColor = variant === "gold" ? "text-[#5a2d0a]" : "text-white";

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-bold transition-transform active:scale-95 overflow-hidden rounded-md border border-black/30",
          sizeClasses[size],
          textColor,
          className
        )}
        style={{ backgroundImage: gradientStyles[variant] }}
        {...props}
        onClick={(e) => {
          playClickSound();
          props.onClick?.(e);
        }}
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
