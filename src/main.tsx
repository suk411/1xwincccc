import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/preloadAssets";

const p = window.location.pathname.replace(/\/+$/, "") || "/";
const h = window.location.hash;
if (p !== "/" && (!h || h === "#" || h === "#/")) {
  window.history.replaceState(null, "", `/#${p}`);
}

if ("caches" in window) {
  caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
}

createRoot(document.getElementById("root")!).render(<App />);
