import { useState } from "react";
import logo from "@/assets/logo.png";
import downloadBtn from "@/assets/download-btn.gif";
import closeIcon from "@/assets/icons/close-icon.png";

const DownloadBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative z-20 bg-[#1a0a10] border-b border-[#3d1f2a] px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        {/* Logo and Text */}
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

        {/* Download Button and Close */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => window.open('#', '_blank')}
            className="flex-shrink-0"
          >
            <img 
              src={downloadBtn} 
              alt="Download" 
              className="h-8 w-auto"
            />
          </button>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="w-6 h-6 flex-shrink-0"
          >
            <img 
              src={closeIcon} 
              alt="Close" 
              className="w-full h-full object-contain"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadBanner;
