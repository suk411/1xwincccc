import { useState } from "react";
import logo from "@/assets/logo.png";
import supportIcon from "@/assets/icons/support.png";
import mailIcon from "@/assets/icons/mail.png";
import menuBg from "@/assets/icons/menu.png";
import ProfileDrawer from "./ProfileDrawer";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import { GameButton } from "./GameButton";
import { authService } from "@/services/authService";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <header className="relative z-10">
      <div className="flex items-center justify-between bg-[#141011] px-4 py-2">
        <div className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button className="relative w-7 h-7 flex items-center justify-center">
                <img src={supportIcon} alt="Support" className="absolute inset-0 w-full h-full object-contain" />
              </button>
              <button className="relative w-7 h-7 flex items-center justify-center">
                <img src={mailIcon} alt="Mail" className="absolute inset-0 w-full h-full object-contain" />
              </button>
              <button className="relative w-7 h-7 flex items-center justify-center" onClick={() => setIsProfileOpen(true)}>
                <img src={menuBg} alt="Menu" className="absolute inset-0 w-full h-full object-contain" />
              </button>
            </>
          ) : (
            <>
              <GameButton variant="red" size="sm" onClick={() => setLoginOpen(true)}>
                Login
              </GameButton>
              <GameButton variant="gold" size="sm" onClick={() => setRegisterOpen(true)}>
                Register
              </GameButton>
            </>
          )}
        </div>
      </div>

      <ProfileDrawer open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => setRegisterOpen(true)}
        onLoginSuccess={handleAuthSuccess}
      />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
        onRegisterSuccess={handleAuthSuccess}
      />
    </header>
  );
};

export default Header;
