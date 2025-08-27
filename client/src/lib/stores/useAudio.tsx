import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  isBackgroundPlaying: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false, // Start unmuted by default
  isBackgroundPlaying: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    // Update the muted state
    set({ isMuted: newMutedState });
    
    // Control background music based on mute state
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
        set({ isBackgroundPlaying: false });
      } else {
        backgroundMusic.play().catch(e => console.log('Background music play error:', e));
        set({ isBackgroundPlaying: true });
      }
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      const soundClone = successSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  startBackgroundMusic: () => {
    const { backgroundMusic, isMuted } = get();
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(e => {
        console.log('Background music play error:', e);
      });
      set({ isBackgroundPlaying: true });
    }
  },
  
  stopBackgroundMusic: () => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.pause();
      set({ isBackgroundPlaying: false });
    }
  }
}));
