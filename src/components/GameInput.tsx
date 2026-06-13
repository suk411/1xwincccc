import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface GameInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  hint?: string;
  error?: boolean;
}

const GameInput = React.forwardRef<HTMLInputElement, GameInputProps>(
  ({ className, icon, hint, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 h-10 border transition-all duration-300",
            error ? "border-[#e37681] scale-[1.03]" : "border-transparent",
            className
          )}
          style={{ backgroundColor: "#541324" }}
        >
          {icon && (
            <span className="flex-shrink-0 text-[#e37681]">{icon}</span>
          )}
          <input
            ref={ref}
            type={inputType}
            className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-[#964850] min-w-0"
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="flex-shrink-0 text-[#964850]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {hint && (
          <p className={cn("mt-1 ml-1 text-xs", error ? "text-[#e37681]" : "text-[#964850]")}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

GameInput.displayName = "GameInput";

export { GameInput };
