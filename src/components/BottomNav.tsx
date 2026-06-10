import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useTransitionNavigate } from "@/providers/NavigationProvider";

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

const activeBgSrc =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAFVBMVEXrNzTZOznyOTbvQ0H0SEZMaXH1SklhcyT4AAAAB3RSTlNAQERUZQAojIJSAAAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAx9JREFUeJztmYuO4yAMRf1I8v+fPAIbYxuoNAkdKdK4nZbn4XKh2lUMZ4jr4uNmEFyRBaFyPAxaoAcwx0Kq5uIAN/Rlo++Gzr8yWiSzBem7vGq1fFH4bmUZ0eEU0brlGsSkweWtNbYGbbSyDpOoHI82MD0JY3NHVzei4JuhbKG2E3wquUb1pZ1lQY9kqC8rrF+90ELZgqZABptXYk7Ut/61tsCGivYnCDa3TrOFPDHtxXcoW2SDinZGgH0HUYaf9Ko5EGTDTDQ1UnUlWeNAbkEd6dgnlOvRwJBUKUiiWyogOxAly5odfUG50yoamsXKclC/Qi/089Dxxq5o7mSyuTY/BC3b3QiTzR4N/XwcJ+DmbN/sDtKs7swW/oKHxnz5zMoJmtUOCtfB4Rw2S3fm209noRqc/C6nd+fbHjrFblPtrS6RfRllx568p5nqwWqvLHasCnpJVqrHGJcNtdQ8oMMcWtJnjuSWD+j5/mdbmm6z3b4lehYLQ3pVfvl30MuI12krGj6hYV9QOsZ3oOHLhvA/+uVoeOVPBt7oNS5V49dV46dFFj2os+Zo7NMwtpTPXOq4oGSCRq9YAK7JgUcdfcBUtYM5SmnB3OvXHBeYGoJuQFvD1jLsCJVy2+1MNXYnDOutDKpNBgLWTvuYG1KjEbw7pWJbaDDnlNsFerT9g451UkGYBq13knyUAR6sc2txUF3HotDaPGlA/9H3o8NskK08QaP/61+RrY6FXZkgKWU0zgPGRUJhHB3RRJQGQ57taisVpiOqbkczj099ecTkJ4O7AvBraExew040RK83ktGjt/qB+YZsRONXVdO3VOMrvUZnyF7V+Eeq+TVe0yvRGP/rvhNM/jnfVjTKBaHyTHWzIySqsaG3OsIFfelD5o1o0jzHCSfulk0VTfZAfxua25Pxgt58/0hFt+TJLjZ10ZbykWdb+DBYNVvKRy15zBawZmVaeq1UJWtHt/H66LCiclJQM4LIjL9+cZnEgRxTmVyjsn8HVrpL2w0JWH4UkukdErCnpNmOkgm+jz0OXCS7FX4/HDihz/NCupujpyul6H8Acp8s5PVq+5kAAAAASUVORK5CYII=";

const BottomNav = () => {
  const location = useLocation();
  const { navigateWithTransition } = useTransitionNavigate();

  const handlePromoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      description: " Event Undergoing Updates",
      variant: "destructive"
    });
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[var(--app-max-width)] z-50 flex justify-center" style={{ containerType: "inline-size" }}>
      {/* Nav container - constrained width */}
      <div className="relative w-full">
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
            const isCenterAdjacent = item.path === "/earn";
            return (
              <button
                key={item.path}
                onClick={() => navigateWithTransition(item.path)}
                className="relative flex flex-col items-center gap-0 py-[2%] px-[3%] transition-all duration-200 overflow-hidden"
                style={{
                  minWidth: "10%",
                  marginRight: isCenterAdjacent ? "clamp(1rem, 5cqw, 3rem)" : undefined,
                  transform: isCenterAdjacent ? "translateX(clamp(-0.75rem, -3cqw, -2rem))" : undefined,
                }}
              >
                <div
                  className="relative flex flex-col items-center"
                  style={{ transform: "translateY(clamp(-0.26rem, -0.8cqw, -0.45rem))" }}
                >
                  {isActive ? (
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 z-[1] flex items-center justify-center pointer-events-none"
                      style={{
                        top: "58%",
                        transform: "translate(-50%, -50%) scale(0.77)",
                        width: "clamp(4.07rem, 11.55cqw, 4.51rem)",
                        height: "clamp(4.07rem, 11.55cqw, 4.51rem)",
                      }}
                    >
                      <img src={activeBgSrc} alt="" className="w-full h-full" />
                    </div>
                  ) : null}
                  <div
                    className="relative z-10 flex flex-col items-center"
                    style={{ transform: "translateY(clamp(-0.38rem, -1.1cqw, -0.6rem))" }}
                  >
                    <div
                      className="flex items-end justify-center"
                      style={{ width: "clamp(2.64rem, 7.92cqw, 3.96rem)", height: "clamp(2.64rem, 7.92cqw, 3.96rem)" }}
                    >
                      <img
                        src={isActive ? item.activeIcon : item.inactiveIcon}
                        alt={item.label}
                        className={`relative z-10 object-contain transition-all duration-200 ${
                          isActive ? "scale-110" : "opacity-70"
                        }`}
                        style={{
                          width: "clamp(1.604rem, 5.132cqw, 2.887rem)",
                          height: "clamp(1.604rem, 5.132cqw, 2.887rem)",
                          filter: isActive
                            ? "drop-shadow(0 0 0.45rem hsl(var(--nav-glow) / 0.6))"
                            : undefined,
                        }}
                      />
                    </div>
                    <span
                      className={`font-bold leading-none transition-colors duration-200 ${
                        isActive ? "text-[#ffff8d]" : "text-muted-foreground"
                      }`}
                      style={{
                        fontSize: "clamp(0.499rem, 1.499cqw, 0.831rem)",
                        position: "relative",
                        zIndex: 10,
                        marginTop: "clamp(0.08rem, 0.25cqw, 0.14rem)",
                        textShadow: isActive ? "0 0 0.5625rem hsl(var(--primary) / 0.5)" : undefined,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Center spacer - just for text, gift is positioned separately */}
          <div
            onClick={handlePromoClick}
            className="flex flex-col items-center pt-[2%] cursor-pointer"
            style={{ minWidth: '12%' }}
          >
            <span className="text-primary text-glow" style={{ fontSize: 'clamp(0.7rem, 2.2cqw, 1.2rem)' }}>
              GET ₹200
            </span>
          </div>

          {/* Right nav items */}
          {navItems.slice(2, 4).map((item) => {
            const isActive = location.pathname === item.path;
            const isCenterAdjacent = item.path === "/bank";
            return (
              <button
                key={item.path}
                onClick={() => navigateWithTransition(item.path)}
                className="relative flex flex-col items-center gap-0 py-[2%] px-[3%] transition-all duration-200 overflow-hidden"
                style={{
                  minWidth: "10%",
                  marginLeft: isCenterAdjacent ? "clamp(1rem, 5cqw, 3rem)" : undefined,
                  transform: isCenterAdjacent ? "translateX(clamp(0.75rem, 3cqw, 2rem))" : undefined,
                }}
              >
                <div
                  className="relative flex flex-col items-center"
                  style={{ transform: "translateY(clamp(-0.26rem, -0.8cqw, -0.45rem))" }}
                >
                  {isActive ? (
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 z-[1] flex items-center justify-center pointer-events-none"
                      style={{
                        top: "58%",
                        transform: "translate(-50%, -50%) scale(0.77)",
                        width: "clamp(4.07rem, 11.55cqw, 4.51rem)",
                        height: "clamp(4.07rem, 11.55cqw, 4.51rem)",
                      }}
                    >
                      <img src={activeBgSrc} alt="" className="w-full h-full" />
                    </div>
                  ) : null}
                  <div
                    className="relative z-10 flex flex-col items-center"
                    style={{ transform: "translateY(clamp(-0.38rem, -1.1cqw, -0.6rem))" }}
                  >
                    <div
                      className="flex items-end justify-center"
                      style={{ width: "clamp(2.64rem, 7.92cqw, 3.96rem)", height: "clamp(2.64rem, 7.92cqw, 3.96rem)" }}
                    >
                      <img
                        src={isActive ? item.activeIcon : item.inactiveIcon}
                        alt={item.label}
                        className={`relative z-10 object-contain transition-all duration-200 ${
                          isActive ? "scale-110" : "opacity-70"
                        }`}
                        style={{
                          width: "clamp(1.604rem, 5.132cqw, 2.887rem)",
                          height: "clamp(1.604rem, 5.132cqw, 2.887rem)",
                          filter: isActive
                            ? "drop-shadow(0 0 0.45rem hsl(var(--nav-glow) / 0.6))"
                            : undefined,
                        }}
                      />
                    </div>
                    <span
                      className={`font-bold leading-none transition-colors duration-200 ${
                        isActive ? "text-[#ffff8d]" : "text-muted-foreground"
                      }`}
                      style={{
                        fontSize: "clamp(0.499rem, 1.499cqw, 0.831rem)",
                        position: "relative",
                        zIndex: 10,
                        marginTop: "clamp(0.08rem, 0.25cqw, 0.14rem)",
                        textShadow: isActive ? "0 0 0.5625rem hsl(var(--primary) / 0.5)" : undefined,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Center gift + platform - positioned to overlap top edge of nav */}
        <div
          onClick={handlePromoClick}
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10 cursor-pointer"
          style={{ top: '-3%' }}
        >
          {/* Platform background */}
          <img 
            src={navCenterPlatform} 
            alt="" 
            className="absolute left-1/2 -translate-x-1/2 z-0"
            style={{ minWidth: 'clamp(8rem, 25cqw, 16rem)', bottom: 'clamp(-1rem, -2cqw, -2rem)' }}
          />
          {/* Gift box image */}
          <img 
            src={giftBox} 
            alt="GET ₹200" 
            className="object-contain relative z-10 transition-transform duration-200 hover:scale-110"
            style={{ width: 'clamp(3rem, 9cqw, 6rem)', height: 'clamp(3rem, 9cqw, 6rem)' }}
          />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
