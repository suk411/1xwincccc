import { useState } from "react";
import { DotPulse } from "ldrs/react";
import "ldrs/react/DotPulse.css";
import { useTransitionNavigate } from "@/providers/NavigationProvider";
import phoneIcon from "@/assets/auth/icon-phone-complete.svg";
import lockIcon from "@/assets/auth/password-icon.svg";
import authBg from "@/assets/auth/auth-bg.png";
import rewardBanner from "@/assets/auth/reward-banner.png";
import forgotIcon from "@/assets/auth/forgot-icon.png";
import quickLoginIcon from "@/assets/auth/quick-login-icon.png";
import supportIcon from "@/assets/auth/support-icon.png";
import flagIcon from "@/assets/auth/flag-icon.png";
import logo from "@/assets/logo.png";
import { GameInput } from "@/components/GameInput";
import { GameButton } from "@/components/GameButton";
import LanguageDrawer from "@/components/LanguageDrawer";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { navigateWithTransition } = useTransitionNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogin = async () => {
    const isPhoneValid = /^\d{10}$/.test(phone);
    const isPasswordValid = password.length >= 6;
    setPhoneError(!isPhoneValid);
    setPasswordError(!isPasswordValid);
    if (!isPhoneValid || !isPasswordValid) return;

    setLoading(true);
    try {
      await authService.login(phone, password);
      toast({ description: "Login successful" });
      navigateWithTransition("/");
    } catch (err: any) {
      toast({ description: err.message || "Login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover object-top " />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 " />

      <div className="relative z-10 flex flex-col flex-1 px-5  pt-6">
        {/* Logo & Domain */}
        <div className="flex flex-col items-center mb-2">
          <img src={logo} alt="1xKING" className="h-16 w-auto mb-1" />
        
          <p className="font-bold text-sm italic mt-1" style={{
            backgroundImage: "linear-gradient(0deg, rgb(227, 118, 129) 0%, rgb(200, 80, 95) 43.7%, rgb(240, 140, 150) 45%, rgb(220, 100, 115) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}>SPIN TO WIN,<br className="hidden" /> FORTUNE BEGINS HERE!</p>
        </div>

        {/* Reward Banner */}
        <div className="relative w-full my-4">
          <img src={rewardBanner} alt="" className="w-full h-auto" />
          <span className="absolute inset-0 flex items-center justify-center font-bold pt-2 text-sm pl-8" style={{
            backgroundImage: "linear-gradient(0deg, rgb(227, 118, 129) 0%, rgb(200, 80, 95) 43.7%, rgb(240, 140, 150) 45%, rgb(220, 100, 115) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}>
            Get invitation rewards upto ₹1000
          </span>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3 mt-2">
          <GameInput
            icon={<span className="flex items-center gap-1"><img src={phoneIcon} className="w-[18px] h-[18px]" alt="" /><span className="text-[#e37681] text-sm">+91</span></span>}
            placeholder="Enter phone number"
            hint={phoneError ? "Enter valid 10-digit number" : "Enter 10-digit phone number"}
            error={phoneError}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
              setPhoneError(false);
            }}
            type="tel"
            inputMode="numeric"
            style={{
              backgroundImage: "linear-gradient(0deg, rgb(227, 118, 129) 0%, rgb(200, 80, 95) 43.7%, rgb(240, 140, 150) 45%, rgb(220, 100, 115) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              caretColor: "white",
            }}
          />
          <GameInput
            icon={<img src={lockIcon} className="w-[18px] h-[18px]" alt="" />}
            placeholder="Enter Password"
            hint={passwordError ? "Password must be at least 6 characters" : "Enter Password"}
            error={passwordError}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
            type="password"
            style={{
              backgroundImage: "linear-gradient(0deg, rgb(227, 118, 129) 0%, rgb(200, 80, 95) 43.7%, rgb(240, 140, 150) 45%, rgb(220, 100, 115) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              caretColor: "white",
            }}
          />
        </div>

        {/* Login Button */}
        <div className="flex justify-center mt-6">
          <GameButton
            variant="gold"
            buttonType="prompt"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <span className="flex justify-center"><DotPulse size="30" speed="1.3" color="#5a2d0a" /></span> : "Login"}
          </GameButton>
        </div>

        {/* Forgot & Quick Register */}
        <div className="flex items-center justify-between mt-4 px-2">
          <button className="flex items-center gap-1.5 text-[#c4889a] text-sm">
            <img src={forgotIcon} alt="" className="w-5 h-5" />
            Forgot Password
          </button>
          <button
            className="flex items-center gap-1.5 text-[#c4889a] text-sm"
            onClick={() => navigateWithTransition("/register")}
          >
            <img src={quickLoginIcon} alt="" className="w-5 h-5" />
            Quick to Register
          </button>
        </div>

        {/* Support & Language */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="flex items-center gap-1.5 text-[#c4889a] text-xs border border-[#5a2030] rounded-full px-4 py-1.5" onClick={() => window.open("https://t.me/", "_blank")}>
            <img src={supportIcon} alt="" className="w-4 h-4" />
            Contact Support
          </button>
          <button className="flex items-center gap-1.5 text-[#c4889a] text-xs border border-[#5a2030] rounded-full px-4 py-1.5" onClick={() => setLangOpen(true)}>
            <img src={flagIcon} alt="" className="w-4 h-4" />
            English
            <span className="text-[#c4889a]">›</span>
          </button>
        </div>
        <LanguageDrawer open={langOpen} onOpenChange={setLangOpen} />

        {/* Terms */}
        <p className="text-center text-[#964850] text-[10px] mt-6 mb-2">
          By logging in, you agree to our{" "}
           <span className="text-[#e37681] underline cursor-pointer" onClick={() => navigateWithTransition("/terms")}>Terms of Service</span> and{" "}
           <span className="text-[#e37681] underline cursor-pointer" onClick={() => navigateWithTransition("/privacy")}>Privacy Policy</span>
        </p>
        <p className="text-center text-[#964850] text-[10px] mb-4">v1.0.25</p>
      </div>
    </div>
  );
};

export default Login;
