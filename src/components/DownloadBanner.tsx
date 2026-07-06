import { useState, useEffect } from "react";
import logo from "@/assets/pwalogo.png";
import downloadBtn from "@/assets/download-btn.gif";
import closeIcon from "@/assets/icons/close-icon.png";

const LS_DISMISSED = "download_banner_dismissed_until";

function isStandalone(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches
    || (window.navigator as any).standalone
    || document.referrer.includes("android-app://");
}

interface DownloadBannerProps {
  onDownloadClick: () => void;
}

const DownloadBanner = ({ onDownloadClick }: DownloadBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setIsVisible(false);
      return;
    }

    const dismissedUntil = localStorage.getItem(LS_DISMISSED);
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(LS_DISMISSED, (Date.now() + 2 * 60 * 60 * 1000).toString());
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-[10100] bg-[#1a0a10] border-b border-[#3d1f2a] px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={logo}
            alt="1xKING"
            className="w-10 h-10 flex-shrink-0 rounded-lg"
          />
          <p className="text-white text-sm font-medium truncate">
            Download to get ₹50. Login in app to claim.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onDownloadClick} className="flex-shrink-0">
            <img src={downloadBtn} alt="Download" className="h-8 w-auto" />
          </button>
          <button onClick={handleClose} className="w-6 h-6 flex-shrink-0">
            <img src={closeIcon} alt="Close" className="w-full h-full object-contain" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadBanner;
