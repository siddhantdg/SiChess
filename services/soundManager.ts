
const soundFiles = {
  gameStart: '/assets/sounds/game-start.ogg',
  move: '/assets/sounds/move.ogg',
  capture: '/assets/sounds/capture.ogg',
  castle: '/assets/sounds/castle.ogg',
  check: '/assets/sounds/check.ogg',
  gameEnd: '/assets/sounds/game-end.ogg',
  promote: '/assets/sounds/promote.ogg',
};

const sounds: Partial<Record<keyof typeof soundFiles, HTMLAudioElement>> = {};

if (typeof window !== 'undefined') {
  Object.entries(soundFiles).forEach(([key, path]) => {
    const audio = new Audio(path);
    audio.volume = 1.0; 
    sounds[key as keyof typeof soundFiles] = audio;
  });
}

export type SoundType = keyof typeof soundFiles;

export const playSound = (type: SoundType) => {
  const audio = sounds[type];
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch((error) => {
      // Browsers often block autoplay until user interaction. 
      // We silence this error as it's expected behavior on page load.
      console.warn('Sound playback failed:', error);
    });
  }
};
