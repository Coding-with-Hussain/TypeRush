import { useAudio } from './stores/useAudio';
import { getRandomWord } from './wordDictionary';

interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onWPMUpdate: (wpm: number) => void;
  onAccuracyUpdate: (accuracy: number) => void;
  onGameOver: () => void;
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  word: string;
  typedLength: number;
  speed: number;
  width: number;
  height: number;
}

interface Bullet {
  id: string;
  x: number;
  y: number;
  speed: number;
  targetId: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Star {
  x: number;
  y: number;
  speed: number;
  brightness: number;
}

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameCallbacks;
  private running = false;
  private animationFrame?: number;
  
  // Game objects
  private enemies: Enemy[] = [];
  private bullets: Bullet[] = [];
  private particles: Particle[] = [];
  private stars: Star[] = [];
  
  // Player
  private player = { x: 0, y: 0, width: 60, height: 40 };
  
  // Game state
  private score = 0;
  private totalKeystrokes = 0;
  private correctKeystrokes = 0;
  private gameStartTime = 0;
  private lastEnemySpawn = 0;
  private waveNumber = 1;
  private difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  
  // Current typing target
  private currentTarget: Enemy | null = null;
  
  constructor(ctx: CanvasRenderingContext2D, callbacks: GameCallbacks) {
    this.ctx = ctx;
    this.callbacks = callbacks;
    this.initializeStars();
  }

  private initializeStars() {
    this.stars = [];
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * this.ctx.canvas.width,
        y: Math.random() * this.ctx.canvas.height,
        speed: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.8 + 0.2
      });
    }
  }

  start() {
    this.running = true;
    this.gameStartTime = Date.now();
    this.player.x = this.ctx.canvas.width / 2 - this.player.width / 2;
    this.player.y = this.ctx.canvas.height - 100;
    this.gameLoop();
  }

  stop() {
    this.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private gameLoop = () => {
    if (!this.running) return;
    
    this.update();
    this.render();
    
    this.animationFrame = requestAnimationFrame(this.gameLoop);
  };

  private update() {
    const now = Date.now();
    
    // Spawn enemies
    this.spawnEnemies(now);
    
    // Update enemies
    this.updateEnemies();
    
    // Update bullets
    this.updateBullets();
    
    // Update particles
    this.updateParticles();
    
    // Update stars
    this.updateStars();
    
    // Check collisions
    this.checkCollisions();
    
    // Update stats
    this.updateStats();
    
    // Check game over conditions
    this.checkGameOver();
  }

  private spawnEnemies(now: number) {
    const spawnInterval = this.getSpawnInterval();
    
    if (now - this.lastEnemySpawn > spawnInterval) {
      const enemy: Enemy = {
        id: Math.random().toString(36),
        x: Math.random() * (this.ctx.canvas.width - 100) + 50,
        y: -50,
        word: getRandomWord(this.difficulty),
        typedLength: 0,
        speed: this.getEnemySpeed(),
        width: 80,
        height: 40
      };
      
      this.enemies.push(enemy);
      this.lastEnemySpawn = now;
    }
  }

  private getSpawnInterval(): number {
    const baseInterval = { easy: 3000, medium: 2000, hard: 1500 }[this.difficulty];
    return Math.max(baseInterval - (this.waveNumber * 100), 800);
  }

  private getEnemySpeed(): number {
    const baseSpeed = { easy: 1, medium: 1.5, hard: 2 }[this.difficulty];
    return baseSpeed + (this.waveNumber * 0.1);
  }

  private updateEnemies() {
    this.enemies.forEach(enemy => {
      enemy.y += enemy.speed;
    });
    
    // Remove enemies that are off screen
    this.enemies = this.enemies.filter(enemy => enemy.y < this.ctx.canvas.height + 50);
  }

  private updateBullets() {
    this.bullets.forEach(bullet => {
      bullet.y -= bullet.speed;
    });
    
    // Remove bullets that are off screen
    this.bullets = this.bullets.filter(bullet => bullet.y > -10);
  }

  private updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // gravity
      particle.life--;
    });
    
    this.particles = this.particles.filter(particle => particle.life > 0);
  }

  private updateStars() {
    this.stars.forEach(star => {
      star.y += star.speed;
      if (star.y > this.ctx.canvas.height) {
        star.y = -5;
        star.x = Math.random() * this.ctx.canvas.width;
      }
    });
  }

  private checkCollisions() {
    // Check bullet-enemy collisions
    this.bullets.forEach(bullet => {
      const enemy = this.enemies.find(e => e.id === bullet.targetId);
      if (enemy && this.isColliding(bullet, enemy)) {
        this.destroyEnemy(enemy);
        this.bullets = this.bullets.filter(b => b.id !== bullet.id);
        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
      }
    });
    
    // Check enemy-player collisions (game over)
    this.enemies.forEach(enemy => {
      if (enemy.y + enemy.height > this.player.y) {
        this.callbacks.onGameOver();
      }
    });
  }

  private isColliding(a: any, b: any): boolean {
    return a.x < b.x + b.width &&
           a.x + (a.width || 5) > b.x &&
           a.y < b.y + b.height &&
           a.y + (a.height || 5) > b.y;
  }

  private destroyEnemy(enemy: Enemy) {
    this.enemies = this.enemies.filter(e => e.id !== enemy.id);
    this.score += enemy.word.length * 10 * this.waveNumber;
    
    if (this.currentTarget?.id === enemy.id) {
      this.currentTarget = null;
      this.callbacks.setCurrentWord('');
    }
    
    // Play success sound
    const audio = useAudio.getState();
    audio.playSuccess();
  }

  private createExplosion(x: number, y: number) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        id: Math.random().toString(36),
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 30,
        maxLife: 30,
        color: `hsl(${Math.random() * 60 + 15}, 100%, 50%)`
      });
    }
  }

  private updateStats() {
    const timeElapsed = (Date.now() - this.gameStartTime) / 1000 / 60; // minutes
    const wpm = timeElapsed > 0 ? Math.round((this.correctKeystrokes / 5) / timeElapsed) : 0;
    const accuracy = this.totalKeystrokes > 0 ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100) : 100;
    
    this.callbacks.onScoreUpdate(this.score);
    this.callbacks.onWPMUpdate(wpm);
    this.callbacks.onAccuracyUpdate(accuracy);
  }

  private checkGameOver() {
    // Check if any enemy reached the bottom
    if (this.enemies.some(enemy => enemy.y + enemy.height > this.ctx.canvas.height - 50)) {
      this.callbacks.onGameOver();
    }
  }

  handleInput(key: string) {
    if (!this.running) return;
    
    this.totalKeystrokes++;
    
    // Find target enemy if none selected
    if (!this.currentTarget) {
      const availableEnemies = this.enemies.filter(e => e.typedLength === 0);
      this.currentTarget = availableEnemies.find(e => e.word[0].toLowerCase() === key.toLowerCase()) || null;
      
      if (this.currentTarget) {
        this.callbacks.setCurrentWord(this.currentTarget.word);
      }
    }
    
    // Handle typing for current target
    if (this.currentTarget) {
      const expectedChar = this.currentTarget.word[this.currentTarget.typedLength];
      
      if (expectedChar.toLowerCase() === key.toLowerCase()) {
        this.correctKeystrokes++;
        this.currentTarget.typedLength++;
        
        // Fire bullet
        this.fireBullet(this.currentTarget);
        
        // Play hit sound
        const audio = useAudio.getState();
        audio.playHit();
        
        // Check if word is complete
        if (this.currentTarget.typedLength >= this.currentTarget.word.length) {
          this.destroyEnemy(this.currentTarget);
        }
      } else {
        // Wrong key - reset target
        this.currentTarget.typedLength = 0;
        this.currentTarget = null;
        this.callbacks.setCurrentWord('');
      }
    }
  }

  private fireBullet(target: Enemy) {
    const bullet: Bullet = {
      id: Math.random().toString(36),
      x: this.player.x + this.player.width / 2,
      y: this.player.y,
      speed: 8,
      targetId: target.id
    };
    
    this.bullets.push(bullet);
  }

  private render() {
    const { ctx } = this;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 10, 35, 1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw stars
    this.renderStars();
    
    // Draw enemies
    this.renderEnemies();
    
    // Draw bullets
    this.renderBullets();
    
    // Draw player
    this.renderPlayer();
    
    // Draw particles
    this.renderParticles();
  }

  private renderStars() {
    const { ctx } = this;
    
    this.stars.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fillRect(star.x, star.y, 1, 1);
    });
  }

  private renderEnemies() {
    const { ctx } = this;
    
    this.enemies.forEach(enemy => {
      // Draw enemy ship
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      
      // Draw enemy ship details
      ctx.fillStyle = '#cc2222';
      ctx.fillRect(enemy.x + 10, enemy.y + 10, enemy.width - 20, enemy.height - 20);
      
      // Draw word
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      
      const wordY = enemy.y + enemy.height + 25;
      
      // Draw typed portion in green
      if (enemy.typedLength > 0) {
        const typedPortion = enemy.word.substring(0, enemy.typedLength);
        ctx.fillStyle = '#44ff44';
        ctx.fillText(typedPortion, enemy.x + enemy.width / 2, wordY);
      }
      
      // Draw remaining portion in white
      const remainingPortion = enemy.word.substring(enemy.typedLength);
      ctx.fillStyle = 'white';
      const typedWidth = ctx.measureText(enemy.word.substring(0, enemy.typedLength)).width;
      ctx.fillText(remainingPortion, enemy.x + enemy.width / 2 + typedWidth / 2, wordY);
      
      // Highlight current target
      if (this.currentTarget?.id === enemy.id) {
        ctx.strokeStyle = '#ffff44';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.x - 5, enemy.y - 5, enemy.width + 10, enemy.height + 10);
      }
    });
  }

  private renderBullets() {
    const { ctx } = this;
    
    this.bullets.forEach(bullet => {
      ctx.fillStyle = '#44ff44';
      ctx.fillRect(bullet.x - 2, bullet.y, 4, 8);
      
      // Add bullet glow effect
      ctx.shadowColor = '#44ff44';
      ctx.shadowBlur = 5;
      ctx.fillRect(bullet.x - 1, bullet.y, 2, 8);
      ctx.shadowBlur = 0;
    });
  }

  private renderPlayer() {
    const { ctx } = this;
    
    // Draw player ship
    ctx.fillStyle = '#4444ff';
    ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Draw player ship details
    ctx.fillStyle = '#2222cc';
    ctx.fillRect(this.player.x + 5, this.player.y + 5, this.player.width - 10, this.player.height - 10);
    
    // Draw engine glow
    ctx.fillStyle = '#ff8844';
    ctx.fillRect(this.player.x + 15, this.player.y + this.player.height, 10, 8);
    ctx.fillRect(this.player.x + 35, this.player.y + this.player.height, 10, 8);
  }

  private renderParticles() {
    const { ctx } = this;
    
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
      ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
    });
  }
}
