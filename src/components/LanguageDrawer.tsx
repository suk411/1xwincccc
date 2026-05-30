import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { GameButton } from "@/components/GameButton";
import { Check } from "lucide-react";
import flagIcon from "@/assets/auth/flag-icon.png";

interface LanguageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languages = ["English"];

const LanguageDrawer = ({ open, onOpenChange }: LanguageDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-none" style={{ backgroundColor: "#1a030a" }}>
        <div className="p-6 pb-8">
          <h2 className="text-white text-lg font-medium text-center mb-6">Select Language</h2>
          <div className="space-y-3">
            {languages.map((lang) => (
              <div
                key={lang}
                className="flex items-center justify-between rounded-lg px-4 py-3.5"
                style={{ backgroundColor: "#2a0510", border: "1px solid rgba(255,180,50,0.2)" }}
              >
                <div className="flex items-center gap-3">
                  <img src={flagIcon} alt="" className="w-6 h-6" />
                  <span className="text-white text-base">{lang}</span>
                </div>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500">
                  <Check size={14} className="text-white" />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <DrawerClose asChild>
              <GameButton variant="red" buttonType="prompt">Confirm</GameButton>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LanguageDrawer;
