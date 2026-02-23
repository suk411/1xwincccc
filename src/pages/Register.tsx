import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Lock, Gift } from "lucide-react";
import authBg from "@/assets/auth/auth-bg.png";
import rewardBanner from "@/assets/auth/reward-banner.png";
import forgotIcon from "@/assets/auth/forgot-icon.png";
import quickLoginIcon from "@/assets/auth/quick-login-icon.png";
import supportIcon from "@/assets/auth/support-icon.png";
import flagIcon from "@/assets/auth/flag-icon.png";
import logo from "@/assets/logo.png";
import { GameInput } from "@/components/GameInput";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const isPhoneValid = /^\d{10}$/.test(phone);
    const isPasswordValid = password.length >= 6;
    setPhoneError(!isPhoneValid);
    setPasswordError(!isPasswordValid);
    if (!isPhoneValid || !isPasswordValid) return;

    setLoading(true);
    try {
      await authService.register(phone, password, inviteCode || undefined);
      toast({ title: "Registration successful" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90" />

      <div className="relative z-10 flex flex-col flex-1 px-5 pt-6">
        {/* Logo & Domain */}
        <div className="flex flex-col items-center mb-2">
          <img src={logo} alt="1xKING" className="h-12 w-auto mb-1" />
          <p className="text-[#e3a44e] text-xs font-semibold tracking-wider">1xking.com</p>
          <p className="text-[#ffd700] text-sm italic mt-1">SPIN TO WIN, FORTUNE BEGINS HERE!</p>
        </div>

        {/* Reward Banner */}
        <div className="relative w-full my-4">
          <img src={rewardBanner} alt="" className="w-full h-auto" />
          <span className="absolute inset-0 flex items-center justify-center text-[#ffd700] font-bold text-sm pl-8">
            Get rewards upto ₹1000
          </span>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3 mt-2">
          <GameInput
            icon={<Phone size={18} />}
            placeholder="Enter phone number"
            hint={phoneError ? "Enter valid 10-digit number" : "10-digit phone number"}
            error={phoneError}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
              setPhoneError(false);
            }}
            type="tel"
            inputMode="numeric"
          />
          <GameInput
            icon={<Lock size={18} />}
            placeholder="Enter password"
            hint={passwordError ? "Password must be at least 6 characters" : "Min 6 characters"}
            error={passwordError}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
            type="password"
          />
          <GameInput
            icon={<Gift size={18} />}
            placeholder="Invite code (optional)"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full h-12 rounded-full mt-6 font-bold text-lg text-[#5a2d0a] active:scale-95 transition-transform disabled:opacity-60"
          style={{
            backgroundImage: "linear-gradient(rgb(255, 246, 230) 1%, rgb(238, 210, 110) 44%, rgb(195, 132, 45) 75%, rgb(195, 132, 45) 86%, rgb(255, 205, 78) 100%)",
          }}
        >
          {loading ? "..." : "Register"}
        </button>

        {/* Quick Login link */}
        <div className="flex items-center justify-between mt-4 px-2">
          <button className="flex items-center gap-1.5 text-[#c4889a] text-sm">
            <img src={forgotIcon} alt="" className="w-5 h-5" />
            Forgot Password
          </button>
          <button
            className="flex items-center gap-1.5 text-[#c4889a] text-sm"
            onClick={() => navigate("/login")}
          >
            <img src={quickLoginIcon} alt="" className="w-5 h-5" />
            Quick to Login
          </button>
        </div>

        {/* Support & Language */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="flex items-center gap-1.5 text-[#c4889a] text-xs border border-[#5a2030] rounded-full px-4 py-1.5">
            <img src={supportIcon} alt="" className="w-4 h-4" />
            Contact Support
          </button>
          <button className="flex items-center gap-1.5 text-[#c4889a] text-xs border border-[#5a2030] rounded-full px-4 py-1.5">
            <img src={flagIcon} alt="" className="w-4 h-4" />
            English
            <span className="text-[#c4889a]">›</span>
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-[#964850] text-[10px] mt-6 mb-2">
          By registering, you agree to our{" "}
          <span className="text-[#e37681] underline">Terms of Service</span> and{" "}
          <span className="text-[#e37681] underline">Privacy Policy</span>
        </p>
        <p className="text-center text-[#964850] text-[10px] mb-4">v1.0.25</p>
      </div>
    </div>
  );
};

export default Register;
