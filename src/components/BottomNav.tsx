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
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Nav background image */}
      <div className="relative">
        <img 
          src={navBg} 
          alt="" 
          className="w-full h-auto"
        />
        
        {/* Nav items overlay */}
        <div className="absolute inset-0 flex items-center justify-around px-1 max-w-screen-lg mx-auto">
          {/* Left nav items */}
          {navItems.slice(0, 2).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-[4rem] transition-all duration-200"
              >
                <img
                  src={isActive ? item.activeIcon : item.inactiveIcon}
                  alt={item.label}
                  className={`w-7 h-7 object-contain transition-all duration-200 ${
                    isActive ? "nav-glow scale-110" : "opacity-70"
                  }`}
                />
                <span
                  className={`text-xs transition-colors duration-200 ${
                    isActive ? "text-primary text-glow" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Center promo button with platform */}
          <Link
            to="/promo"
            className="relative flex flex-col items-center -mt-10"
          >
            {/* Gift box image */}
            <img 
              src={giftBox} 
              alt="GET ₹2000" 
              className="w-14 h-14 object-contain relative z-10 transition-transform duration-200 hover:scale-110"
            />
            {/* Platform background */}
            <img 
              src={navCenterPlatform} 
              alt="" 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-20 h-auto -z-10"
            />
            {/* Text below */}
            <span className="text-sm font-bold text-accent text-glow mt-1">GET ₹2000</span>
          </Link>

          {/* Right nav items */}
          {navItems.slice(2, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-[4rem] transition-all duration-200"
              >
                <img
                  src={isActive ? item.activeIcon : item.inactiveIcon}
                  alt={item.label}
                  className={`w-7 h-7 object-contain transition-all duration-200 ${
                    isActive ? "nav-glow scale-110" : "opacity-70"
                  }`}
                />
                <span
                  className={`text-xs transition-colors duration-200 ${
                    isActive ? "text-primary text-glow" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
