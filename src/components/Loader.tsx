import { DotPulse } from "ldrs/react";
import "ldrs/react/DotPulse.css";

interface LoaderProps {
  size?: string;
  speed?: string;
  color?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  label?: string;
}

const Loader = ({ size = "43", speed = "1.3", color = "white", fullScreen = false, overlay = false, label }: LoaderProps) => {
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 bg-[#1a1a2e] rounded-xl px-8 py-6 shadow-2xl">
          <DotPulse size={size} speed={speed} color={color} />
          {label && <span className="text-white/80 text-sm mt-1">{label}</span>}
        </div>
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <DotPulse size={size} speed={speed} color={color} />
          {label && <span className="text-white/60 text-sm">{label}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-2">
        <DotPulse size={size} speed={speed} color={color} />
        {label && <span className="text-white/60 text-sm">{label}</span>}
      </div>
    </div>
  );
};

export default Loader;
