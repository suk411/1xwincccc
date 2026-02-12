import { useState } from "react";
import { Phone, Lock, Gift } from "lucide-react";
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
      toast({ title: "Registration successful" });
      onOpenChange(false);
      onRegisterSuccess();
    } catch (err: any) {
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
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
              icon={<><Phone size={18} /><span className="text-[#e37681] text-xs font-bold ml-1">+91</span></>}
              placeholder="Enter phone number"
              hint={phoneError ? "Enter valid 10-digit number" : "10-digit phone number"}
              error={phoneError}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                setPhoneError(false);
              }}
              onClear={() => setPhone("")}
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
              onClear={() => setPassword("")}
              type="password"
            />
            <GameInput
              icon={<Gift size={18} />}
              placeholder="Invite code (optional)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              onClear={() => setInviteCode("")}
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
          <GameButton variant="red" size="lg" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </GameButton>
          <GameButton variant="gold" size="lg" onClick={handleRegister} className="flex-1" disabled={loading}>
            {loading ? "..." : "Register"}
          </GameButton>
        </GameDialogFooter>
      </GameDialogContent>
    </GameDialog>
  );
};

export default RegisterDialog;
