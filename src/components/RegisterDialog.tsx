import { useState } from "react";
import phoneIcon from "@/assets/auth/icon-phone-complete.svg";
import lockIcon from "@/assets/auth/password-icon.svg";
import inviteIcon from "@/assets/auth/icon-invitation.svg";
import {
  GameDialog,
  GameDialogContent,
  GameDialogBody,
  GameDialogFooter,
} from "./GameDialog";
import { GameInput } from "./GameInput";
import { GameButton } from "./GameButton";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

const RegisterDialog = ({ open, onOpenChange, onSwitchToLogin, onRegisterSuccess }: RegisterDialogProps) => {
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
      toast({ description: "Registration successful" });
      onOpenChange(false);
      onRegisterSuccess();
    } catch (err: any) {
      toast({ description: err.message || "Registration failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    onOpenChange(false);
    onSwitchToLogin();
  };

  return (
    <GameDialog open={open} onOpenChange={onOpenChange}>
      <GameDialogContent title="Register">
        <GameDialogBody>
          <div className="w-full flex flex-col gap-3">
            <GameInput
              icon={<span className="flex items-center gap-1"><img src={phoneIcon} className="w-[18px] h-[18px]" alt="" /><span className="text-[#e37681] text-sm">+91</span></span>}
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
              icon={<img src={lockIcon} className="w-[18px] h-[18px]" alt="" />}
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
              icon={<img src={inviteIcon} className="w-[18px] h-[18px]" alt="" />}
              placeholder="Invitation code (optional)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              
            />
          </div>
          <button
            className="mt-3 text-xs underline"
            style={{ color: "#e37681" }}
            onClick={handleSwitchToLogin}
          >
            Already have an account? Login
          </button>
        </GameDialogBody>
        <GameDialogFooter>
          <GameButton variant="dark" buttonType="dialog" onClick={() => onOpenChange(false)} className="flex-1">
            cancel
          </GameButton>
          <GameButton variant="red" buttonType="dialog" onClick={handleRegister} className="flex-1" disabled={loading}>
            confirm
          </GameButton>
        </GameDialogFooter>
      </GameDialogContent>
    </GameDialog>
  );
};

export default RegisterDialog;
