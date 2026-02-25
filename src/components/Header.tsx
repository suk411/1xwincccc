import { useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import supportIcon from "@/assets/icons/support.png";
import mailIcon from "@/assets/icons/mail.png";
import menuBg from "@/assets/icons/menu.png";
import ProfileDrawer from "./ProfileDrawer";
import { GameButton } from "./GameButton";
import { authService } from "@/services/authService";

const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isLoggedIn = useSyncExternalStore(
    authService.subscribe,
    () => authService.isLoggedIn()
  );

  return (
    <header className="relative z-10">
      <div className="flex items-center justify-between bg-[#141011] px-4 py-2">
        <div className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <>
              <button className="relative w-7 h-7 flex items-center justify-center">
                <img src={supportIcon} alt="Support" className="absolute inset-0 w-full h-full object-contain" />
              </button>
              <button className="relative w-7 h-7 flex items-center justify-center">
                <img src={mailIcon} alt="Mail" className="absolute inset-0 w-full h-full object-contain" />
              </button>
            </>
          )}
          <button className="relative w-7 h-7 flex items-center justify-center" onClick={() => setIsProfileOpen(true)}>
            <img src={menuBg} alt="Menu" className="absolute inset-0 w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <ProfileDrawer open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </header>
  );
};

export default Header;
