import { useAudio } from './stores/useAudio';
import { getRandomWord } from './wordDictionary';

interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onWPMUpdate: (wpm: number) => void;
  onAccuracyUpdate: (accuracy: number) => void;
  onGameOver: () => void;
  setCurrentWord: (word: string) => void;
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
  vx: number;
  vy: number;
  speed: number;
  targetId: string;
  targetX: number;
  targetY: number;
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
  
  // Sprites
  private playerSprite: HTMLImageElement;
  private enemySprite: HTMLImageElement;
  private bulletSprite: HTMLImageElement;
  
  // Player
  private player = { x: 0, y: 0, width: 90, height: 60 };
  
  // Game state
  private score = 0;
  private totalKeystrokes = 0;
  private correctKeystrokes = 0;
  private gameStartTime = 0;
  private lastEnemySpawn = 0;
  // Single mode: time-based difficulty scaling
  private baseDifficulty: 'easy' = 'easy';
  
  // Current typing target
  private currentTarget: Enemy | null = null;
  
  constructor(ctx: CanvasRenderingContext2D, callbacks: GameCallbacks, difficulty: 'easy' | 'medium' | 'hard' = 'easy') {
    this.ctx = ctx;
    this.callbacks = callbacks;
    this.baseDifficulty = 'easy';
    
    // Load sprites
    this.playerSprite = new Image();
    this.playerSprite.src = '/sprites/player-ship.svg';
    
    this.enemySprite = new Image();
    this.enemySprite.src = '/sprites/enemy-ship.svg';
    
    this.bulletSprite = new Image();
    this.bulletSprite.src = '/sprites/bullet.svg';
    
    this.initializeStars();
  }

  private initializeStars() {
    this.stars = [];
    for (let i = 0; i < 150; i++) {
      this.stars.push({
        x: Math.random() * this.ctx.canvas.width,
        y: Math.random() * this.ctx.canvas.height,
        speed: Math.random() * 3 + 0.5,
        brightness: Math.random() * 0.9 + 0.1
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
      const secondsElapsed = (now - this.gameStartTime) / 1000;
      const enemy: Enemy = {
        id: Math.random().toString(36),
        x: Math.random() * (this.ctx.canvas.width - 100) + 50,
        y: -50,
        word: getRandomWord(secondsElapsed),
  typedLength: 0,
  speed: this.getEnemySpeed(),
  width: 120,
  height: 70
      };
      
      this.enemies.push(enemy);
      this.lastEnemySpawn = now;
    }
  }

  private getSpawnInterval(): number {
    // Decrease interval slowly over time to increase difficulty
    const seconds = (Date.now() - this.gameStartTime) / 1000;
    const baseInterval = 3000; // start with one enemy every 3s
    // shrink interval by up to 70% over 3 minutes
    const reduction = Math.min(seconds / 180, 0.7);
    const interval = baseInterval * (1 - reduction);
    return Math.max(interval, 800);
  }

  private getEnemySpeed(): number {
    // Increase speed slowly over time
    const seconds = (Date.now() - this.gameStartTime) / 1000;
    const baseSpeed = 1; // normal word speed
    // increase up to +2.5 over 3 minutes
    const increase = Math.min((seconds / 180) * 2.5, 2.5);
    return baseSpeed + increase;
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
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;
    });
    
    // Remove bullets that are off screen
    this.bullets = this.bullets.filter(bullet => 
      bullet.x > -10 && bullet.x < this.ctx.canvas.width + 10 &&
      bullet.y > -10 && bullet.y < this.ctx.canvas.height + 10
    );
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
        // Remove the bullet when it hits
        this.bullets = this.bullets.filter(b => b.id !== bullet.id);
        // Create explosion effect
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
  this.score += enemy.word.length * 10;
    
    if (this.currentTarget?.id === enemy.id) {
      this.currentTarget = null;
      this.callbacks.setCurrentWord('');
    }
    
    // Play success sound
    const audio = useAudio.getState();
    audio.playSuccess();
  }

  private createErrorEffect(x: number, y: number) {
    // Create red particles for error feedback
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        id: Math.random().toString(36),
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 20,
        maxLife: 20,
        color: '#ff4444'
      });
    }
  }

  private createExplosion(x: number, y: number) {
    // Create more particles for better explosion effect
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        id: Math.random().toString(36),
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 40 + Math.random() * 20,
        maxLife: 40 + Math.random() * 20,
        color: `hsl(${Math.random() * 80 + 10}, 100%, ${50 + Math.random() * 30}%)`
      });
    }
    
    // Add some sparks
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        id: Math.random().toString(36),
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 60,
        maxLife: 60,
        color: '#ffffff'
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
          // Destroy enemy immediately when word is complete
          this.destroyEnemy(this.currentTarget);
        }
      } else {
        // Wrong key - just provide visual feedback, don't reset progress
        this.createErrorEffect(this.player.x + this.player.width / 2, this.player.y);
      }
    }
  }

  private fireBullet(target: Enemy) {
    const startX = this.player.x + this.player.width / 2;
    const startY = this.player.y;
    const targetX = target.x + target.width / 2;
    const targetY = target.y + target.height / 2;
    
    // Calculate direction vector
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize and apply speed
    const speed = 12;
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    
    const bullet: Bullet = {
      id: Math.random().toString(36),
      x: startX,
      y: startY,
      vx: vx,
      vy: vy,
      speed: speed,
      targetId: target.id,
      targetX: targetX,
      targetY: targetY
    };
    
    this.bullets.push(bullet);
  }

  private render() {
    const { ctx } = this;
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, 'rgba(10, 10, 35, 1)');
    gradient.addColorStop(0.5, 'rgba(15, 15, 50, 1)');
    gradient.addColorStop(1, 'rgba(20, 20, 60, 1)');
    ctx.fillStyle = gradient;
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
      const size = star.brightness > 0.7 ? 2 : 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      
      // Add glow effect for brighter stars
      if (star.brightness > 0.6) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 3;
      }
      
      ctx.fillRect(star.x, star.y, size, size);
      ctx.shadowBlur = 0;
    });
  }

  private renderEnemies() {
    const { ctx } = this;
    
    this.enemies.forEach(enemy => {
      // Draw a subtle light backdrop behind the ship to increase contrast
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(enemy.x - 4, enemy.y - 4, enemy.width + 8, enemy.height + 8);
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(enemy.x - 4, enemy.y - 4, enemy.width + 8, enemy.height + 8);
      ctx.restore();

      // Draw enemy ship using sprite
      if (this.enemySprite.complete) {
        ctx.drawImage(this.enemySprite, enemy.x, enemy.y, enemy.width, enemy.height);
      } else {
        // Fallback rectangle (high contrast)
        ctx.fillStyle = '#ff6666';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
      
  // Draw word with better visibility and bounds checking
  ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      
      const wordY = enemy.y + enemy.height + 22;
      let centerX = enemy.x + enemy.width / 2;
      
      // Ensure word stays within canvas bounds
      const textWidth = ctx.measureText(enemy.word).width;
      const padding = 12;
      
      if (centerX - textWidth/2 < padding) {
        centerX = textWidth/2 + padding;
      } else if (centerX + textWidth/2 > ctx.canvas.width - padding) {
        centerX = ctx.canvas.width - textWidth/2 - padding;
      }
      
      // Draw background for better readability (larger and slightly translucent)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      const boxX = centerX - textWidth/2 - 8;
      const boxY = wordY - 22;
      const boxW = textWidth + 16;
      const boxH = 28;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      
      // Draw typed portion in bright green with glow and dark stroke for contrast
      if (enemy.typedLength > 0) {
        const typedPortion = enemy.word.substring(0, enemy.typedLength);
        const fullTextMetrics = ctx.measureText(enemy.word);
        const typedMetrics = ctx.measureText(typedPortion);
        const startX = centerX - fullTextMetrics.width / 2;

        ctx.save();
        // Dark stroke for contrast
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0,0,0,0.95)';
        ctx.strokeText(typedPortion, startX + typedMetrics.width / 2, wordY);

        // Glow fill
        ctx.fillStyle = '#00ff00';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 6;
        ctx.fillText(typedPortion, startX + typedMetrics.width / 2, wordY);
        ctx.restore();
      }

      // Draw remaining portion in bright white with dark stroke
      const remainingPortion = enemy.word.substring(enemy.typedLength);
      if (remainingPortion.length > 0) {
        const fullTextMetrics = ctx.measureText(enemy.word);
        const typedMetrics = ctx.measureText(enemy.word.substring(0, enemy.typedLength));
        const remainingMetrics = ctx.measureText(remainingPortion);
        const startX = centerX - fullTextMetrics.width / 2;

        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,0,0,0.9)';
        ctx.strokeText(remainingPortion, startX + typedMetrics.width + remainingMetrics.width / 2, wordY);

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 2;
        ctx.fillText(remainingPortion, startX + typedMetrics.width + remainingMetrics.width / 2, wordY);
        ctx.restore();
      }
      
      // Highlight current target with pulsing effect
      if (this.currentTarget?.id === enemy.id) {
        const pulseIntensity = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 255, 68, ${0.5 + pulseIntensity * 0.5})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ffff44';
        ctx.shadowBlur = 10;
        ctx.strokeRect(enemy.x - 8, enemy.y - 8, enemy.width + 16, enemy.height + 16);
        ctx.shadowBlur = 0;
      }
    });
  }

  private renderBullets() {
    const { ctx } = this;
    
    this.bullets.forEach(bullet => {
      // Calculate rotation angle based on velocity
      const angle = Math.atan2(bullet.vy, bullet.vx);
      
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(angle + Math.PI / 2); // Add 90 degrees since sprite points up
      
      if (this.bulletSprite.complete) {
        // Draw bullet sprite with glow
        ctx.shadowColor = '#44ff44';
        ctx.shadowBlur = 8;
        ctx.drawImage(this.bulletSprite, -2, -4, 4, 8);
        ctx.shadowBlur = 0;
      } else {
        // Fallback with enhanced effects
        ctx.fillStyle = '#44ff44';
        ctx.shadowColor = '#44ff44';
        ctx.shadowBlur = 8;
        ctx.fillRect(-2, -4, 4, 8);
        ctx.shadowBlur = 0;
      }
      
      ctx.restore();
      
      // Add energy trail behind bullet
      const trailLength = 15;
      const trailX = bullet.x - (bullet.vx / bullet.speed) * trailLength;
      const trailY = bullet.y - (bullet.vy / bullet.speed) * trailLength;
      
      ctx.strokeStyle = 'rgba(68, 255, 68, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(trailX, trailY);
      ctx.lineTo(bullet.x, bullet.y);
      ctx.stroke();
      
      // Add small glow particles along trail
      ctx.fillStyle = 'rgba(68, 255, 68, 0.3)';
      ctx.fillRect(trailX - 1, trailY - 1, 2, 2);
    });
  }

  private renderPlayer() {
    const { ctx } = this;
    
    // Draw player ship using sprite
    if (this.playerSprite.complete) {
      ctx.drawImage(this.playerSprite, this.player.x, this.player.y, this.player.width, this.player.height);
      
  // Enhanced engine glow animation (centered under ship)
  const glowIntensity = Math.sin(Date.now() * 0.02) * 0.3 + 0.7;
  const lightW = 12;
  const lightH = 14;
  const leftX = this.player.x + this.player.width * 0.28 - lightW / 2;
  const rightX = this.player.x + this.player.width * 0.72 - lightW / 2;
  const lightY = this.player.y + this.player.height - 2;
  // blue glow to match ship
  ctx.fillStyle = `rgba(68, 136, 255, ${glowIntensity})`;
  ctx.shadowColor = '#44a0ff';
  ctx.shadowBlur = 18;
  ctx.fillRect(leftX, lightY, lightW, lightH);
  ctx.fillRect(rightX, lightY, lightW, lightH);
  ctx.shadowBlur = 0;
    } else {
      // Fallback rectangle with enhanced effects
      ctx.fillStyle = '#4444ff';
      ctx.shadowColor = '#4444ff';
      ctx.shadowBlur = 5;
      ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
      ctx.shadowBlur = 0;
      
  // Enhanced engine glow (centered under ship)
  const glowIntensity = Math.sin(Date.now() * 0.02) * 0.3 + 0.7;
  const lightW_f = 12;
  const lightH_f = 14;
  const leftX_f = this.player.x + this.player.width * 0.28 - lightW_f / 2;
  const rightX_f = this.player.x + this.player.width * 0.72 - lightW_f / 2;
  const lightY_f = this.player.y + this.player.height - 2;
  ctx.fillStyle = `rgba(68, 136, 255, ${glowIntensity})`;
  ctx.shadowColor = '#44a0ff';
  ctx.shadowBlur = 18;
  ctx.fillRect(leftX_f, lightY_f, lightW_f, lightH_f);
  ctx.fillRect(rightX_f, lightY_f, lightW_f, lightH_f);
  ctx.shadowBlur = 0;
    }
  }

  private renderParticles() {
    const { ctx } = this;
    
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      const size = alpha * 3 + 1;
      
      ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
      
      // Add glow effect for particles
      if (alpha > 0.5) {
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 8;
      }
      
      ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
      ctx.shadowBlur = 0;
    });
  }
}
