import { useLocation, Link } from "react-router-dom";

import homeActive from "@/assets/icons/home-active.png";
import homeInactive from "@/assets/icons/home-inactive.png";
import earnActive from "@/assets/icons/earn-active.png";
import earnInactive from "@/assets/icons/earn-inactive.png";
import bankActive from "@/assets/icons/bank-active.png";
import bankInactive from "@/assets/icons/bank-inactive.png";
import eventsActive from "@/assets/icons/events-active.png";
import eventsInactive from "@/assets/icons/events-inactive.png";
import navBg from "@/assets/nav-bg.png";
import navCenterPlatform from "@/assets/nav-center-platform.png";
import giftBox from "@/assets/gift-box.png";

interface NavItem {
  path: string;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", activeIcon: homeActive, inactiveIcon: homeInactive },
  { path: "/earn", label: "Earn", activeIcon: earnActive, inactiveIcon: earnInactive },
  { path: "/bank", label: "Bank", activeIcon: bankActive, inactiveIcon: bankInactive },
  { path: "/events", label: "Events", activeIcon: eventsActive, inactiveIcon: eventsInactive },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      {/* Nav container - constrained width */}
      <div className="relative w-full max-w-screen-lg">
        <img 
          src={navBg} 
          alt="" 
          className="w-full h-auto relative z-20 pointer-events-none"
        />
        
        {/* Nav items overlay */}
        <div className="absolute inset-0 z-30 flex items-center justify-around px-[0.5%]">
          {/* Left nav items */}
          {navItems.slice(0, 2).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-[0.4%] py-[2%] px-[3%] transition-all duration-200"
                style={{ minWidth: '10%' }}
              >
                <img
                  src={isActive ? item.activeIcon : item.inactiveIcon}
                  alt={item.label}
                  className={`object-contain transition-all duration-200 ${
                    isActive ? "nav-glow scale-110" : "opacity-70"
                  }`}
                  style={{ width: 'clamp(1.25rem, 4vw, 2.25rem)', height: 'clamp(1.25rem, 4vw, 2.25rem)' }}
                />
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? "text-primary text-glow" : "text-muted-foreground"
                  }`}
                  style={{ fontSize: 'clamp(0.6rem, 1.8vw, 1rem)' }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Center spacer - just for text, gift is positioned separately */}
          <Link
            to="/promo"
            className="flex flex-col items-center pt-[2%]"
            style={{ minWidth: '12%' }}
          >
            <span className="text-primary text-glow" style={{ fontSize: 'clamp(0.7rem, 2.2vw, 1.2rem)' }}>
              GET ₹200
            </span>
          </Link>

          {/* Right nav items */}
          {navItems.slice(2, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-[0.4%] py-[2%] px-[3%] transition-all duration-200"
                style={{ minWidth: '10%' }}
              >
                <img
                  src={isActive ? item.activeIcon : item.inactiveIcon}
                  alt={item.label}
                  className={`object-contain transition-all duration-200 ${
                    isActive ? "nav-glow scale-110" : "opacity-70"
                  }`}
                  style={{ width: 'clamp(1.25rem, 4vw, 2.25rem)', height: 'clamp(1.25rem, 4vw, 2.25rem)' }}
                />
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? "text-primary text-glow" : "text-muted-foreground"
                  }`}
                  style={{ fontSize: 'clamp(0.6rem, 1.8vw, 1rem)' }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* Center gift + platform - positioned to overlap top edge of nav */}
        <Link
          to="/promo"
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
          style={{ top: '-3%' }}
        >
          {/* Platform background */}
          <img 
            src={navCenterPlatform} 
            alt="" 
            className="absolute left-1/2 -translate-x-1/2 z-0"
            style={{ minWidth: 'clamp(8rem, 25vw, 16rem)', bottom: 'clamp(-1rem, -2vw, -2rem)' }}
          />
          {/* Gift box image */}
          <img 
            src={giftBox} 
            alt="GET ₹200" 
            className="object-contain relative z-10 transition-transform duration-200 hover:scale-110"
            style={{ width: 'clamp(3rem, 9vw, 6rem)', height: 'clamp(3rem, 9vw, 6rem)' }}
          />
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
