import * as React from "react";
import { cn } from "@/lib/utils";

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "outer" | "inner";
}

const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
  ({ className, variant = "outer", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg", className)}
      style={{
        backgroundColor: variant === "inner" ? "#6e1b2f" : "#521222",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
      }}
      {...props}
    >
      {children}
    </div>
  )
);
GameCard.displayName = "GameCard";

export { GameCard };
