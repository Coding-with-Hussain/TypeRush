import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';
export type Difficulty = 'easy' | 'medium' | 'hard';

interface TypingGameState {
  gameState: GameState;
  difficulty: Difficulty;
  score: number;
  wpm: number;
  accuracy: number;
  highScore: number;
  currentWord: string;
  isPaused: boolean;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateScore: (score: number) => void;
  updateWPM: (wpm: number) => void;
  updateAccuracy: (accuracy: number) => void;
  setCurrentWord: (word: string) => void;
}

export const useTypingGame = create<TypingGameState>()(
  subscribeWithSelector((set, get) => ({
    gameState: 'menu',
    difficulty: 'easy',
    score: 0,
    wpm: 0,
    accuracy: 100,
    highScore: parseInt(localStorage.getItem('spaceTyperHighScore') || '0'),
    currentWord: '',
    isPaused: false,

    startGame: () => {
      set({
        gameState: 'playing',
        difficulty: 'easy',
        score: 0,
        wpm: 0,
        accuracy: 100,
        currentWord: '',
        isPaused: false
      });
    },

    pauseGame: () => {
      set({ gameState: 'paused', isPaused: true });
    },

    resumeGame: () => {
      set({ gameState: 'playing', isPaused: false });
    },

    endGame: () => {
      const { score, highScore } = get();
      if (score > highScore) {
        localStorage.setItem('spaceTyperHighScore', score.toString());
        set({ highScore: score });
      }
      set({ gameState: 'gameOver' });
    },

    resetGame: () => {
      set({
        gameState: 'menu',
        score: 0,
        wpm: 0,
        accuracy: 100,
        currentWord: '',
        isPaused: false
      });
    },

    updateScore: (score) => set({ score }),
    updateWPM: (wpm) => set({ wpm }),
    updateAccuracy: (accuracy) => set({ accuracy }),
    setCurrentWord: (word) => set({ currentWord: word })
  }))
);
