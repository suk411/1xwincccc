import btnClickSound from "@/assets/btn-click.mp3";

let audioInstance: HTMLAudioElement | null = null;

export const playClickSound = () => {
  if (!audioInstance) {
    audioInstance = new Audio(btnClickSound);
  }
  audioInstance.currentTime = 0;
  audioInstance.play().catch(() => {});
};

/**
 * Attaches a global click listener that plays the click sound
 * for all interactive elements (buttons, links, clickable elements).
 */
export const initGlobalClickSound = () => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest("button, a, [role='button'], [onclick]");
    if (interactive) {
      playClickSound();
    }
  };

  document.addEventListener("click", handleClick, true);

  return () => {
    document.removeEventListener("click", handleClick, true);
  };
};
