import logo from "@/assets/logo.png";
import headerGlow from "@/assets/header-glow.png";
import supportIcon from "@/assets/icons/support.png";
import mailIcon from "@/assets/icons/mail.png";
import menuBg from "@/assets/icons/menu-bg.png";


const Header = () => {
  return (
    <header className="relative z-10">
      {/* Main header content */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-2 translate-y-full pointer-events-none">
        <img 
          src={headerGlow} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-7 w-auto" />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Support icon */}
          <button className="relative w-6 h-6 flex items-center justify-center">
         
            <img 
              src={supportIcon} 
              alt="Support" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </button>

          {/* Mail icon */}
          <button className="relative w-6 h-6 flex items-center justify-center">
          
            <img 
              src={mailIcon} 
              alt="Mail" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </button>

          {/* Menu icon */}
          <button className="relative w-6 h-6 flex items-center justify-center">
            <img 
              src={menuBg} 
              alt="" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          
          </button>
        </div>
      </div>

      
    </header>
  );
};

export default Header;
