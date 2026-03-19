import { useState, useEffect } from "react";
import logo from "@/assets/pwalogo.png";
import downloadBtn from "@/assets/download-btn.gif";
import closeIcon from "@/assets/icons/close-icon.png";

const DownloadBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    // 2. Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Fallback: Show if not installed and not dismissed in this session
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (!isDismissed && !isStandalone) {
      // We might want to show it even without the event as a generic prompt
      // but usually we wait for the event for the best UX
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownloadClick = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or if prompt isn't available
      alert("To install: Tap the share button and select 'Add to Home Screen'");
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-[60] bg-[#1a0a10] border-b border-[#3d1f2a] px-3 py-2">
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
            onClick={handleDownloadClick}
            className="flex-shrink-0"
          >
            <img 
              src={downloadBtn} 
              alt="Download" 
              className="h-8 w-auto"
            />
          </button>
          
          <button 
            onClick={handleClose}
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
