import { useState, useEffect, useCallback } from "react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { GameButton } from "@/components/GameButton";
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
      <DrawerContent className="border-none p-0 overflow-hidden" style={{
        backgroundColor: "#1a030a",
        borderRadius: "22px 22px 0 0",
        zIndex: 10075,
        fontFamily: "Arial, sans-serif",
        paddingBottom: "25px",
        boxSizing: "border-box"
      }}>
        <div style={{
          width: "100%",
          height: "131px",
          backgroundImage: "url(https://www.v3gamef.com/assets/download-title.76bd7f1f.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative"
        }}>
          <DrawerClose style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            width: "22px",
            height: "22px",
            cursor: "pointer"
          }}>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMAXDHvrEHivW6EzVMOlyWO15/13gEtAAACAklEQVRIx7WX2ZalIAxFBRkCynX4/4/t6gsow4nlalbzprglJCchTBMekoLy3pjdqyD09H6sQpmzGkaJ9RWqj/kEYw7yV1Sqkx3qGV/D+Ti2B+N1tdXZ25/hq00Y1neu+CgImVZZpQjFTx1m792qpZ1biknE2jx7QL/II89bnvXsrrTn6GzW9hSMDVuefSWeVSCQ13R6+auI0YfzS/ai5/tN0tXyRvpL/Dbk588LX3Ve+1RR2vOvrQUmFG/3Ml5pYVmYRS1LxbZkufRRxS4qgQB7+koT312vc7WHaFRN01nB0dR5vQKvWh1Qx94KUtejakLsWpo6Welrva/VBkiVOHaaTBKKrGPe0YhNPpZpUkwMDdnkGErS/DBJtuDiI5Mk1eV2ppyhwhXDq6Io/FMxREXPR4Uapiy5x4JpYzZw8OWqXugZNjycfQXTPME7A9NtNrFmW+wwKh1GnMNwqKgOFTGh2pBIMkuE6U8SCZJnoUkH6SxPkBiVniGdE6NPySYXEJ1TsisGXR719F0MmjIE8si1arnLUFMALdCzq4/WogA2pdeiXHAVHBc+QNHXMI9c4Zeq6DfHjVYWnNLCKo2Om7GDbuiITUH/x8N9rK0YamjGWqmxJm6sfRxrXMda5rFm/WeV7fmaENb/dUH54gFfjY53V7OBS1ny3d/r4B6vg8St+Qd3wlpHE7N7LwAAAABJRU5ErkJggg=="
              alt="close"
              style={{ width: "100%", height: "100%" }}
            />
          </DrawerClose>
        </div>

        <div style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
          margin: "15px 0 10px",
          backgroundImage: "linear-gradient(0deg, rgb(255, 200, 50) 0%, rgb(230, 160, 0) 43.7%, rgb(255, 220, 80) 45%, rgb(255, 185, 30) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}>
          Download the app to get ₹50
        </div>

        <div style={{
          textAlign: "center",
          fontSize: "13px",
          color: "#ffffff",
          padding: "0 25px",
          marginBottom: "20px",
          lineHeight: 1.5
        }}>
          Full game content and high-definition graphics are ready for you in the app! Download now, we're waiting to play with you!
        </div>

        <div style={{
          background: "#2a0510",
          margin: "0 25px 20px",
          padding: "12px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center"
        }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "45px", height: "45px", borderRadius: "10px", marginRight: "15px" }}
          />
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>1xKING</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "0 25px" }}>
          <GameButton
            variant="red"
            buttonType="prompt"
            onClick={handleInstall}
            style={{ width: "305px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "10px" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Install APP
          </GameButton>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DownloadDrawer;
