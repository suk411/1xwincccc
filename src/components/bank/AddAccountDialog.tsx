import { useState } from "react";
import { X, CreditCard, User } from "lucide-react";
import { GameInput } from "@/components/GameInput";
import { GameButton } from "@/components/GameButton";

export interface BankAccount {
  name: string;
  accountNumber: string;
  ifsc: string;
}

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (account: BankAccount) => void;
}

const AddAccountDialog = ({ open, onClose, onConfirm }: AddAccountDialogProps) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ account?: string; ifsc?: string; name?: string }>({});

  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className="w-full max-w-sm rounded-xl p-4 flex flex-col gap-3"
        style={{ backgroundColor: "#3a0a18", border: "1px solid rgba(211, 54, 93, 0.3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-base">Your Account</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgb(177, 44, 73)" }}>
            <X size={16} className="text-primary" />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-2">
          <GameInput
            icon={<CreditCard size={16} />}
            placeholder="Please enter the account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 18))}
            hint={errors.account || "Enter 16 or 18-digit account"}
            error={!!errors.account}
            onClear={() => setAccountNumber("")}
          />
          <GameInput
            icon={<CreditCard size={16} />}
            placeholder="Please enter the IFSC"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11))}
            hint={errors.ifsc || "Please enter 11 digits"}
            error={!!errors.ifsc}
            onClear={() => setIfsc("")}
          />
          <GameInput
            icon={<User size={16} />}
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 100))}
            hint={errors.name}
            error={!!errors.name}
            onClear={() => setName("")}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <GameButton variant="red" className="flex-1" onClick={onClose}>
            Cancel
          </GameButton>
          <GameButton variant="gold" className="flex-1" onClick={handleConfirm}>
            Confirm
          </GameButton>
        </div>
      </div>
    </div>
  );
};

export default AddAccountDialog;
