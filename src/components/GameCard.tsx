import * as React from "react";
import { cn } from "@/lib/utils";

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg p-3", className)}
      style={{ backgroundColor: "#541323" }}
      {...props}
    >
      {children}
    </div>
  )
);
GameCard.displayName = "GameCard";

export { GameCard };
