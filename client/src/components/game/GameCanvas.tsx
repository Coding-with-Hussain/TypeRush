import { useEffect, useRef } from 'react';
import { useTypingGame } from '../../lib/stores/useTypingGame';
import { GameEngine } from '../../lib/gameEngine';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { updateScore, updateWPM, updateAccuracy, endGame, setCurrentWord, difficulty } = useTypingGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to half width
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.5;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game engine
    gameEngineRef.current = new GameEngine(ctx, {
      onScoreUpdate: updateScore,
      onWPMUpdate: updateWPM,
      onAccuracyUpdate: updateAccuracy,
      onGameOver: endGame,
      setCurrentWord: setCurrentWord
    }, difficulty);

    gameEngineRef.current.start();

    // Handle keyboard input
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      gameEngineRef.current?.handleInput(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      gameEngineRef.current?.stop();
    };
  }, [updateScore, updateWPM, updateAccuracy, endGame, setCurrentWord, difficulty]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        touchAction: 'none'
      }}
    />
  );
};

export default GameCanvas;
