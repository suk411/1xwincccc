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
            error ? "border-[#e37681] scale-[1.03]" : "",
            className
          )}
          style={{
            backgroundColor: "#541324",
            border: error ? undefined : "1px solid rgba(255, 180, 50, 0.25)",
            boxShadow: error ? undefined : "0 0 6px rgba(255, 150, 30, 0.08)",
          }}
        >
          {icon && (
            <span className="flex-shrink-0" style={{
              backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}>{icon}</span>
          )}
          <input
            ref={ref}
            type={inputType}
            className="flex-1 bg-transparent outline-none text-base placeholder:text-[#964850] min-w-0"
            style={{
              backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              caretColor: "white",
            }}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="flex-shrink-0"
              style={{
                color: "transparent",
              }}
            >
              <span style={{
                backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
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
