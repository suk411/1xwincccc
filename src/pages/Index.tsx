import PageLayout from "@/components/PageLayout";
import bannerVideo from "@/assets/banner-video.mp4";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const winMessages = [
  "User d****z successfully withdrew 20000!",
  "User q*******i won 3000 in mahjongS!",
  "User v****k successfully withdrew 10000!",
  "User a****m won 5000 in Roulette!",
  "User s****p successfully withdrew 8000!",
  "User r****j won 15000 in Teen Patti!",
  "User m****n successfully withdrew 25000!",
  "User k****l won 7500 in Slots!",
  "User b****t successfully withdrew 12000!",
  "User h****e won 9000 in Crash!",
];

const Index = () => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerText, setTickerText] = useState("");

  useEffect(() => {
    // Build a long repeating string for seamless scroll
    const repeated = [...winMessages, ...winMessages, ...winMessages].join("   🎰   ");
    setTickerText(repeated);
  }, []);

  return (
    <PageLayout>
      <div className="flex-1 flex flex-col gap-0 -mt-4">
        {/* Video Banner */}
        <div className="relative w-full rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={bannerVideo}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="w-full h-auto block"
          />
          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
          >
            {muted ? (
              <VolumeX size={16} className="text-white" />
            ) : (
              <Volume2 size={16} className="text-white" />
            )}
          </button>
        </div>

        {/* Scrolling Notice Ticker */}
        <div className="w-full bg-[#1a1028] border-y border-[#2a1a3a] py-1.5 overflow-hidden flex items-center gap-2 px-2">
          <span className="text-xs flex-shrink-0">🔊</span>
          <div className="overflow-hidden flex-1 relative">
            <div
              ref={tickerRef}
              className="whitespace-nowrap animate-ticker text-xs text-muted-foreground"
            >
              {tickerText}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
