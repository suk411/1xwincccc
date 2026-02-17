import { useState } from "react";
import { CreditCard, User } from "lucide-react";
import {
  GameDialog,
  GameDialogContent,
  GameDialogBody,
  GameDialogFooter,
} from "@/components/GameDialog";
import { GameInput } from "@/components/GameInput";
import { GameButton } from "@/components/GameButton";

export interface BankAccount {
  name: string;
  accountNumber: string;
  ifsc: string;
}

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (account: BankAccount) => void;
}

const AddAccountDialog = ({ open, onOpenChange, onConfirm }: AddAccountDialogProps) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ account?: string; ifsc?: string; name?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!accountNumber || accountNumber.length < 16 || accountNumber.length > 18) {
      e.account = "Please enter the account number format is incorrect";
    }
    if (!ifsc || ifsc.length !== 11) {
      e.ifsc = "Please enter the IFSC format is incorrect";
    }
    if (!name.trim()) {
      e.name = "Enter name cannot be empty";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      onConfirm({ name: name.trim(), accountNumber, ifsc: ifsc.toUpperCase() });
      setAccountNumber("");
      setIfsc("");
      setName("");
      setErrors({});
    }
  };

  return (
    <GameDialog open={open} onOpenChange={onOpenChange}>
      <GameDialogContent title="Your Account">
        <GameDialogBody>
          <div className="w-full flex flex-col gap-3">
            <GameInput
              icon={<CreditCard size={16} />}
              placeholder="Please enter the account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 18))}
              hint={errors.account || "Enter 16 or 18-digit account"}
              error={!!errors.account}
              
            />
            <GameInput
              icon={<CreditCard size={16} />}
              placeholder="Please enter the IFSC"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11))}
              hint={errors.ifsc || "Please enter 11 digits"}
              error={!!errors.ifsc}
              
            />
            <GameInput
              icon={<User size={16} />}
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 100))}
              hint={errors.name}
              error={!!errors.name}
              
            />
          </div>
        </GameDialogBody>
        <GameDialogFooter>
          <GameButton variant="red" size="lg" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </GameButton>
          <GameButton variant="gold" size="lg" onClick={handleConfirm} className="flex-1">
            Confirm
          </GameButton>
        </GameDialogFooter>
      </GameDialogContent>
    </GameDialog>
  );
};

export default AddAccountDialog;
