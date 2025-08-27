export interface GameStats {
  score: number;
  wpm: number;
  accuracy: number;
  wordsTyped: number;
  timeElapsed: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  word: string;
  typedLength: number;
  speed: number;
  width: number;
  height: number;
  color?: string;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  speed: number;
  targetId: string;
  damage?: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  health?: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size?: number;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface DifficultySettings {
  name: string;
  targetWPM: number;
  enemySpeed: number;
  spawnRate: number;
  wordComplexity: 'easy' | 'medium' | 'hard';
}
