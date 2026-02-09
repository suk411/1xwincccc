import btnClickSound from "@/assets/btn-click.mp3";

let audioInstance: HTMLAudioElement | null = null;

export const playClickSound = () => {
  if (!audioInstance) {
    audioInstance = new Audio(btnClickSound);
  }
  audioInstance.currentTime = 0;
  audioInstance.play().catch(() => {});
};
