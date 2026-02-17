import { useState } from "react";
import { Phone,  Lock } from "lucide-react";
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

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

const LoginDialog = ({ open, onOpenChange, onSwitchToRegister, onLoginSuccess }: LoginDialogProps) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const isPhoneValid = /^\d{10}$/.test(phone);
    const isPasswordValid = password.length >= 6;
    setPhoneError(!isPhoneValid);
    setPasswordError(!isPasswordValid);
    if (!isPhoneValid || !isPasswordValid) return;

    setLoading(true);
    try {
      await authService.login(phone, password);
      toast({ title: "Login successful" });
      onOpenChange(false);
      onLoginSuccess();
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    onOpenChange(false);
    onSwitchToRegister();
  };

  return (
    <GameDialog open={open} onOpenChange={onOpenChange}>
      <GameDialogContent title="Login">
        <GameDialogBody>
          <div className="w-full flex flex-col gap-3">
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
              hint={passwordError ? "Password must be at least 6 characters" : ""}
              error={passwordError}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              
              type="password"
            />
          </div>
          <button
            className="mt-3 text-xs underline"
            style={{ color: "#e37681" }}
            onClick={handleSwitchToRegister}
          >
            Don't have an account? Register
          </button>
        </GameDialogBody>
        <GameDialogFooter>
          <GameButton variant="red" size="lg" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </GameButton>
          <GameButton variant="gold" size="lg" onClick={handleLogin} className="flex-1" disabled={loading}>
            {loading ? "..." : "Login"}
          </GameButton>
        </GameDialogFooter>
      </GameDialogContent>
    </GameDialog>
  );
};

export default LoginDialog;
