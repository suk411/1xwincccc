import { useState, useEffect, useCallback } from "react";
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

  if (!open) return null;

  return (
    <>
      <div
        onClick={() => onOpenChange(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1000
        }}
      />
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#1a030a",
        borderRadius: "22px 22px 0 0",
        zIndex: 10075,
        fontFamily: "Arial, sans-serif",
        paddingBottom: "25px",
        boxSizing: "border-box",
        overflow: "hidden"
      }}>
        <div style={{
          width: "100%",
          height: "131px",
          background: "linear-gradient(135deg, #2a0008 0%, #4a0012 40%, #6d001a 70%, #8a0022 100%)",
          position: "relative"
        }}>
          <img
            onClick={() => onOpenChange(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "15px",
              width: "22px",
              height: "22px",
              cursor: "pointer"
            }}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMAXDHvrEHivW6EzVMOlyWO15/13gEtAAACAklEQVRIx7WX2ZalIAxFBRkCynX4/4/t6gsow4nlalbzprglJCchTBMekoLy3pjdqyD09H6sQpmzGkaJ9RWqj/kEYw7yV1Sqkx3qGV/D+Ti2B+N1tdXZ25/hq00Y1neu+CgImVZZpQjFTx1m792qpZ1biknE2jx7QL/II89bnvXsrrTn6GzW9hSMDVuefSWeVSCQ13R6+auI0YfzS/ai5/tN0tXyRvpL/Dbk588LX3Ve+1RR2vOvrQUmFG/3Ml5pYVmYRS1LxbZkufRRxS4qgQB7+koT312vc7WHaFRN01nB0dR5vQKvWh1Qx94KUtejakLsWpo6Welrva/VBkiVOHaaTBKKrGPe0YhNPpZpUkwMDdnkGErS/DBJtuDiI5Mk1eV2ppyhwhXDq6Io/FMxREXPR4Uapiy5x4JpYzZw8OWqXugZNjycfQXTPME7A9NtNrFmW+wwKh1GnMNwqKgOFTGh2pBIMkuE6U8SCZJnoUkH6SxPkBiVniGdE6NPySYXEJ1TsisGXR719F0MmjIE8si1arnLUFMALdCzq4/WogA2pdeiXHAVHBc+QNHXMI9c4Zeq6DfHjVYWnNLCKo2Om7GDbuiITUH/x8N9rK0YamjGWqmxJm6sfRxrXMda5rFm/WeV7fmaENb/dUH54gFfjY53V7OBS1ny3d/r4B6vg8St+Qd3wlpHE7N7LwAAAABJRU5ErkJggg=="
            alt="close"
          />
        </div>

        <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", color: "#fff", margin: "15px 0 10px" }}>
          Download the app to get ₹50
        </div>

        <div style={{
          textAlign: "center",
          fontSize: "13px",
          color: "#c4889a",
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
          <button
            onClick={handleInstall}
            style={{
              width: "305px",
              height: "50px",
              background: "linear-gradient(180deg, #ffe066 0%, #f5c842 40%, #e6a800 70%, #d49400 100%)",
              border: "none",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              outline: "none",
              boxShadow: "0 2px 8px rgba(200,150,0,0.3)"
            }}
          >
            <span style={{
              color: "#5a0005",
              fontSize: "16px",
              fontWeight: "bold"
            }}>Install APP</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DownloadDrawer;
