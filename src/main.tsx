import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/preloadAssets";

if ("caches" in window) {
  caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
}

createRoot(document.getElementById("root")!).render(<App />);
