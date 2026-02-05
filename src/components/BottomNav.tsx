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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-border">
      <div className="flex items-center justify-around px-1 py-0.5 max-w-screen-lg mx-auto">
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

        {/* Center promo button */}
        <Link
          to="/promo"
          className="relative flex flex-col items-center -mt-6"
        >
          <div className="w-16 h-16 rounded-full promo-gradient flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
               style={{ boxShadow: "var(--glow-orange)" }}>
            <div className="text-center text-white">
              <span className="block text-[0.5rem] font-bold leading-tight">GET</span>
              <span className="block text-xs font-bold leading-tight">₹2000</span>
            </div>
          </div>
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
    </nav>
  );
};

export default BottomNav;
