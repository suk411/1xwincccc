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
          className="w-full h-auto relative z-20 pointer-events-none"
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
                  className={`w-[1.75rem] h-[1.75rem] object-contain transition-all duration-200 ${
                    isActive ? "nav-glow scale-110" : "opacity-70"
                  }`}
                />
                <span
                  className={`text-[0.75rem] transition-colors duration-200 ${
                    isActive ? "text-primary text-glow" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Center spacer - just for text, gift is positioned separately */}
          <Link
            to="/promo"
            className="flex flex-col items-center min-w-[5rem] pt-[1rem]"
          >
            <span 
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Segoe UI", Arial, Roboto, "PingFang SC", MIUI, "Hiragino Sans GB", "Microsoft Yahei", sans-serif',
                fontSize: '0.9rem',
                fontWeight: 700,
                lineHeight: '1.35rem',
                color: 'rgb(255, 111, 111)',
                textShadow: '0 0 0.625rem rgba(255, 111, 111, 0.5)'
              }}
            >
              GET ₹2000
            </span>
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
                  className={`w-[1.75rem] h-[1.75rem] object-contain transition-all duration-200 ${
                    isActive ? "nav-glow scale-110" : "opacity-70"
                  }`}
                />
                <span
                  className={`text-[0.75rem] transition-colors duration-200 ${
                    isActive ? "text-primary text-glow" : "text-muted-foreground"
                  }`}
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
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
          style={{ top: "-1.75rem" }}
        >
          {/* Platform background - bottom half hidden behind nav bar top edge */}
          <img 
            src={navCenterPlatform} 
            alt="" 
            className="absolute left-1/2 -translate-x-1/2 w-[7rem] h-auto z-0"
            style={{ bottom: "-2rem" }}
          />
          {/* Gift box image - larger, sits on top */}
          <img 
            src={giftBox} 
            alt="GET ₹2000" 
            className="w-[4.5rem] h-[4.5rem] object-contain relative z-10 transition-transform duration-200 hover:scale-110"
          />
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
