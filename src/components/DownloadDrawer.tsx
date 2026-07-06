import { useState, useEffect, useCallback } from "react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import logo from "@/assets/pwalogo.png";

interface DownloadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DownloadDrawer = ({ open, onOpenChange }: DownloadDrawerProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem("pwa_installed", "true");
      }
      setDeferredPrompt(null);
    }
    onOpenChange(false);
  }, [deferredPrompt, onOpenChange]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-none p-0 overflow-hidden" style={{ backgroundColor: "#fff", borderRadius: "22px 22px 0 0" }}>
        <div className="relative w-full h-[131px]" style={{
          background: "linear-gradient(135deg, #5a0005 0%, #8a0010 40%, #b8001a 70%, #d40020 100%)"
        }}>
          <DrawerClose className="absolute top-3 right-3 w-6 h-6 z-10">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMAXDHvrEHivW6EzVMOlyWO15/13gEtAAACAklEQVRIx7WX2ZalIAxFBRkCynX4/4/t6gsow4lbpezmvGl4JCchTBMekoLy3pjdqyD09H6sQpmzGkaJ9RWqj/kEYw7yV1Sqkx3qGV/D+Ti2B+N1tdXZ25/hq00Y1neu+CgImVZZpQjFTx1m792qpZ1biknE2jx7QL/II89bnvXsrrTn6GzW9hSMDVuefSWeVSCQ13R6+auI0YfzS/ai5/tN0tXyRvpL/Dbk588LX3Ve+1RR2vOvrQUmFG/3Ml5pYVmYRS1LxbZkufRRxS4qgQB7+koT312vc7WHaFRN01nB0dR5vQKvWh1Qx94KUtejakLsWpo6Welrva/VBkiVOHaaTBKKrGPe0YhNPpZpUkwMDdnkGErS/DBJtuDiI5Mk1eV2ppyhwhXDq6Io/FMxREXPR4Uapiy5x4JpYzZw8OWqXugZNjycfQXTPME7A9NtNrFmW+wwKh1GnMNwqKgOFTGh2pBIMkuE6U8SCZJnoUkH6SxPkBiVniGdE6NPySYXEJ1TsisGXR719F0MmjIE8si1arnLUFMALdCzq4/WogA2pdeiXHAVHBc+QNHXMI9c4Zeq6DfHjVYWnNLCKo2Om7GDbuiITUH/x8N9rK0YamjGWqmxJm6sfRxrXMda5rFm/WeV7fmaENb/dUH54gFfjY53V7OBS1ny3d/r4B6vg8St+Qd3wlpHE7N7LwAAAABJRU5ErkJggg=="
              alt="Close"
              className="w-full h-full object-contain"
            />
          </DrawerClose>
        </div>

        <div className="px-6 pb-8">
          <h2 className="text-center text-xl font-bold text-black mt-4 mb-2">
            Download the app to get ₹13
          </h2>
          <p className="text-center text-sm text-[#4b4b4b] px-2 mb-5 leading-relaxed">
            Full game content and high-definition graphics are ready for you in the app! Download now, we're waiting to play with you!
          </p>

          <div className="flex items-center bg-[#f5f5f5] rounded-xl px-3 py-3 mx-0 mb-5">
            <img src={logo} alt="1xKING" className="w-[45px] h-[45px] rounded-xl mr-4" />
            <span className="text-base font-bold text-black">1xKING</span>
          </div>

          <button
            onClick={handleInstall}
            className="block mx-auto w-[305px] h-[50px] text-center leading-[50px] font-bold text-base rounded-lg cursor-pointer outline-none border-none"
            style={{
              color: "#76000a",
              background: "linear-gradient(180deg, #ffe066 0%, #f5c842 40%, #e6a800 70%, #d49400 100%)",
              boxShadow: "0 2px 8px rgba(200,150,0,0.3)"
            }}
          >
            Install APP
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DownloadDrawer;
