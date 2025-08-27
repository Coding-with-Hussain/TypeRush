import { useEffect } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { useTypingGame } from "./lib/stores/useTypingGame";
import MainMenu from "./components/game/MainMenu";
import GameCanvas from "./components/game/GameCanvas";
import GameUI from "./components/game/GameUI";
import GameOver from "./components/game/GameOver";
import "@fontsource/inter";

function App() {
  const { gameState } = useTypingGame();
  const { setBackgroundMusic, setHitSound, setSuccessSound, startBackgroundMusic } = useAudio();

  // Initialize audio on component mount
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    const hitAudio = new Audio("/sounds/hit.mp3");
    const successAudio = new Audio("/sounds/success.mp3");

    bgMusic.loop = true;
    bgMusic.volume = 0.2;
    hitAudio.volume = 0.5;
    successAudio.volume = 0.6;

    setBackgroundMusic(bgMusic);
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Start background music when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      startBackgroundMusic();
    }
  }, [gameState, startBackgroundMusic]);

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0a0a23 0%, #1a1a3e 100%)'
      }}
    >
      {gameState === 'menu' && <MainMenu />}
      
      {gameState === 'playing' && (
        <>
          <GameCanvas />
          <GameUI />
        </>
      )}
      
      {gameState === 'gameOver' && <GameOver />}
    </div>
  );
}

export default App;
