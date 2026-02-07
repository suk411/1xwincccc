import { useState } from "react";
import logo from "@/assets/logo.png";
import supportIcon from "@/assets/icons/support.png";
import mailIcon from "@/assets/icons/mail.png";
import menuBg from "@/assets/icons/menu.png";
import ProfileDrawer from "./ProfileDrawer";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="relative z-10">
      {/* Main header content */}
      <div className="flex items-center justify-between bg-[#141011] px-4 py-2 ">
       
       
        

        {/* Logo */}
        <div className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Support icon */}
          <button className="relative w-7 h-7 flex items-center justify-center">
         
            <img 
              src={supportIcon} 
              alt="Support" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </button>

          {/* Mail icon */}
          <button className="relative w-7 h-7 flex items-center justify-center">
          
            <img 
              src={mailIcon} 
              alt="Mail" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </button>

          {/* Menu icon */}
          <button 
            className="relative w-7 h-7 flex items-center justify-center"
            onClick={() => setIsProfileOpen(true)}
          >
            <img 
              src={menuBg} 
              alt="Menu" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </button>
        </div>
      </div>

      <ProfileDrawer open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </header>
  );
};

export default Header;
