import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "@/components/Loader";
import backBtn from "@/assets/icons/back-btn.png";

const GamePlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const gameUrl = (location.state as any)?.gameUrl || "";

  if (!gameUrl) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <main className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "#000" }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 left-3 z-20 w-9 h-9 flex items-center justify-center"
      >
        <img src={backBtn} alt="Back" className="w-full h-full object-contain" />
      </button>

      {loading && <Loader label="Loading game..." />}

      <iframe
        src={gameUrl}
        className="flex-1 w-full border-0"
        style={{ display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />
    </main>
  );
};

export default GamePlay;
