import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import Loader from "@/components/Loader";

const GamePlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameUrl = (location.state as any)?.gameUrl || "";

  const enterFullscreen = useCallback(async () => {
    try {
      const el = containerRef.current;
      if (el && !document.fullscreenElement) {
        await el.requestFullscreen();
      }
    } catch {
      // Fullscreen not supported or denied — still works inline
    }
  }, []);

  const handleExit = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {}
    navigate(-1);
  }, [navigate]);

  // Enter fullscreen once iframe loads
  useEffect(() => {
    if (!loading) {
      enterFullscreen();
    }
  }, [loading, enterFullscreen]);

  // Prevent body scroll while game is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Listen for fullscreen exit via Escape key
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        // User pressed Escape — stay on page but don't force re-enter
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  if (!gameUrl) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-black w-screen h-screen"
    >
      {/* Floating exit button */}
      <button
        onClick={handleExit}
        className="fixed z-[9999] flex items-center justify-center rounded-full border-2 border-yellow-400"
        style={{ top: '2%', left: '2%', width: '8vw', height: '8vw', minWidth: 36, minHeight: 36, maxWidth: 56, maxHeight: 56 }}
        aria-label="Exit game"
      >
        <img src="https://utprqkqiqjtjtzksjrng.supabase.co/storage/v1/object/public/buttonIcon/backBtn.png" alt="Back" className="w-full h-full object-contain rounded-full" />
      </button>

      {loading && <Loader label="Loading game..." />}

      <iframe
        src={gameUrl}
        className="w-full h-full border-0 flex-1"
        style={{ display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
        allow="autoplay; fullscreen"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />
    </div>
  );
};

export default GamePlay;
