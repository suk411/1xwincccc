import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initGlobalClickSound } from "./hooks/useClickSound";

// Play click sound on every interactive element tap
initGlobalClickSound();

createRoot(document.getElementById("root")!).render(<App />);
