import * as React from "react";
import { cn } from "@/lib/utils";

export interface GameInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  hint?: string;
  error?: boolean;
  onClear?: () => void;
}

const GameInput = React.forwardRef<HTMLInputElement, GameInputProps>(
  ({ className, icon, hint, error, onClear, value, ...props }, ref) => {
    const showClear = onClear && value;

    return (
      <div className="w-full">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 h-10 border",
            error ? "border-[#e37681]" : "border-transparent",
            className
          )}
          style={{ backgroundColor: "#541324" }}
        >
          {icon && (
            <span className="flex-shrink-0 text-[#e37681]">{icon}</span>
          )}
          <input
            ref={ref}
            value={value}
            className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-[#964850] min-w-0"
            {...props}
          />
          {showClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex-shrink-0 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white/60 text-xs"
            >
              ✕
            </button>
          )}
        </div>
        {hint && (
          <p className="mt-1 ml-1 text-xs" style={{ color: "#964850" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

GameInput.displayName = "GameInput";

export { GameInput };
