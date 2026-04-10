import { useState } from "react";
import { Banknote, CreditCard, User } from "lucide-react";
import {
  GameDialog,
  GameDialogContent,
  GameDialogBody,
  GameDialogFooter,
} from "@/components/GameDialog";
import { GameInput } from "@/components/GameInput";
import { GameButton } from "@/components/GameButton";

export interface BankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
}

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (account: BankAccount) => void;
}

const AddAccountDialog = ({ open, onOpenChange, onConfirm }: AddAccountDialogProps) => {
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [errors, setErrors] = useState<{ holder?: string; bankName?: string; account?: string; bankCode?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!accountHolder.trim()) {
      e.holder = "Account holder name cannot be empty";
    }
    if (!bankName.trim()) {
      e.bankName = "Bank name cannot be empty";
    }
    if (!accountNumber.trim()) {
      e.account = "Account number cannot be empty";
    }
    if (!bankCode || bankCode.length !== 11) {
      e.bankCode = "Please enter the IFSC / bank code format is incorrect";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      onConfirm({
        bankName: bankName.trim(),
        bankCode: bankCode.toUpperCase(),
        accountNumber,
        accountHolder: accountHolder.trim(),
      });
      setAccountHolder("");
      setBankName("");
      setAccountNumber("");
      setBankCode("");
      setErrors({});
    }
  };

  return (
    <GameDialog open={open} onOpenChange={onOpenChange}>
      <GameDialogContent title="Your Account">
        <GameDialogBody>
          <div className="w-full flex flex-col gap-3">
            <GameInput
              icon={<User size={16} />}
              placeholder="Enter account holder name"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value.slice(0, 100))}
              hint={errors.holder}
              error={!!errors.holder}
            />
            <GameInput
              icon={<Banknote size={16} />}
              placeholder="Enter bank name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value.slice(0, 100))}
              hint={errors.bankName}
              error={!!errors.bankName}
            />
            <GameInput
              icon={<CreditCard size={16} />}
              placeholder="Please enter the account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.slice(0, 50))}
              hint={errors.account}
              error={!!errors.account}
            />
            <GameInput
              icon={<CreditCard size={16} />}
              placeholder="Please enter the IFSC / bank code"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11))}
              hint={errors.bankCode || "Please enter 11 characters"}
              error={!!errors.bankCode}
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
