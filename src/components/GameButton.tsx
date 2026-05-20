import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonVariantConfig {
  background: string;
  color: string;
  boxShadow: string;
  border?: string;
}

const buttonVariants: Record<string, ButtonVariantConfig> = {
  gold: {
    background: "linear-gradient(145deg, rgb(255, 215, 0) 0%, rgb(240, 184, 0) 40%, rgb(232, 165, 58) 100%)",
    color: "rgb(139, 69, 19)",
    boxShadow: "rgba(228, 165, 58, 0.45) 0px 3px 12px 0px, rgba(255, 255, 255, 0.5) 0px 1px 2px 0px inset, rgba(255, 215, 0, 0.3) 0px 0px 0px 1px",
  },
  red: {
    background: "linear-gradient(145deg, rgb(255, 122, 92) 0%, rgb(255, 71, 87) 50%, rgb(224, 48, 80) 100%)",
    color: "#fff",
    boxShadow: "rgba(255, 71, 87, 0.35) 0px 3px 10px 0px, rgba(255, 255, 255, 0.25) 0px 0.5px 0.5px 0px inset",
  },
  dark: {
    background: "linear-gradient(145deg, rgb(177, 44, 73) 0%, rgb(112, 28, 50) 50%, rgb(71, 2, 17) 100%)",
    color: "#fff",
    boxShadow: "rgba(177, 44, 73, 0.35) 0px 3px 10px 0px, rgba(255, 255, 255, 0.15) 0px 0.5px 0.5px 0px inset",
    border: "0.8px solid rgba(255, 159, 167, 0.3)",
  },
  mute: {
    background: "linear-gradient(145deg, rgb(40, 40, 40) 0%, rgb(25, 25, 25) 50%, rgb(15, 15, 15) 100%)",
    color: "#fff",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 3px 10px 0px, rgba(255, 255, 255, 0.1) 0px 0.5px 0.5px 0px inset",
    border: "0.8px solid rgba(255, 255, 255, 0.1)",
  },
};

export interface GameButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: "gold" | "red" | "dark" | "mute";
  buttonType?: "default" | "prompt" | "dialog";
  children: React.ReactNode;
}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant = "gold", buttonType = "default", children, style: userStyle, ...props }, ref) => {
    const getStyle = () => {
      if (buttonType === "prompt") {
        return {
          width: "100%",
          maxWidth: "304px",
          height: "clamp(38px, 12vw, 45px)",
          borderRadius: "clamp(19px, 6vw, 22.5px)",
          fontSize: "clamp(14px, 4.5vw, 16.5px)",
          fontFamily: "Arial-Black, Arial, sans-serif",
          fontWeight: "900",
          letterSpacing: "clamp(1px, 0.4vw, 1.5px)",
          textShadow: variant === "gold" ? "rgba(255, 255, 255, 0.4) 0px 0.5px 1px" : variant === "red" || variant === "dark" || variant === "mute" ? "rgba(0, 0, 0, 0.15) 0px 0.5px 1.5px" : "none",
        };
      } else if (buttonType === "dialog") {
        return {
          width: "100%",
          maxWidth: "clamp(110px, 38vw, 143px)",
          height: "clamp(35px, 11vw, 42px)",
          borderRadius: "clamp(17.5px, 5.5vw, 21px)",
          fontSize: "clamp(12px, 4vw, 15px)",
          fontWeight: "700",
          textShadow: variant === "red" || variant === "dark" || variant === "mute" ? "rgba(0, 0, 0, 0.15) 0px 0.5px 1.5px" : "none",
        };
      } else {
        return {
          width: "auto",
          height: "clamp(32px, 10vw, 40px)",
          borderRadius: "clamp(16px, 5vw, 20px)",
          fontSize: "clamp(11px, 3.5vw, 14px)",
          fontWeight: "700",
          paddingLeft: "clamp(12px, 4vw, 20px)",
          paddingRight: "clamp(12px, 4vw, 20px)",
        };
      }
    };

    const config = buttonVariants[variant];
    const baseStyle = getStyle();

    const mergedStyle = {
      background: config.background,
      color: config.color,
      boxShadow: config.boxShadow,
      border: config.border || "none",
      ...baseStyle,
      ...userStyle,
    };

    return (
      <>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes goldShine {
            0% { left: -100%; }
            50%, 100% { left: 200%; }
          }
          @keyframes redShine {
            0%, 70% { left: -100%; }
            100% { left: 200%; }
          }
        `}} />
        <button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center border-0 outline-none cursor-pointer overflow-hidden transition-transform active:scale-96",
            className
          )}
          style={mergedStyle}
          {...props}
        >
          {/* Glossy reflection overlay */}
          {(variant === "gold" || variant === "red" || variant === "dark" || variant === "mute") && (
            <div
              style={{
                content: "",
                position: "absolute",
                top: 0,
                left: variant === "gold" ? "8%" : "10%",
                width: variant === "gold" ? "84%" : "80%",
                height: "50%",
                background: variant === "gold" 
                  ? "linear-gradient(rgba(255, 255, 255, 0.5), transparent)"
                  : "linear-gradient(rgba(255, 255, 255, 0.3), transparent)",
                borderRadius: buttonType === "prompt" 
                  ? "clamp(19px, 6vw, 22.5px) clamp(19px, 6vw, 22.5px) 50% 50%" 
                  : "clamp(17.5px, 5.5vw, 21px) clamp(17.5px, 5.5vw, 21px) 50% 50%",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Shine sweep */}
          {variant === "gold" && (
            <span
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "50%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
                animation: "goldShine 2.5s ease-in-out infinite",
              }}
            />
          )}
          {(variant === "red" || variant === "dark" || variant === "mute") && (
            <span
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "60%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                animation: "redShine 3s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          )}

          <span className="relative z-10">{children}</span>
        </button>
      </>
    );
  }
);

GameButton.displayName = "GameButton";

export { GameButton };
