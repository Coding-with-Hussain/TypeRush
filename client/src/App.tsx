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
        background: 'linear-gradient(180deg, #0a0a23 0%, #1a1a3e 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Game Container */}
      <div 
        style={{
          width: '50vw',
          height: '100vh',
          position: 'relative',
          background: 'linear-gradient(180deg, #0a0a23 0%, #1a1a3e 100%)',
          border: '2px solid rgba(128, 90, 213, 0.3)',
          boxShadow: '0 0 50px rgba(128, 90, 213, 0.2)'
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
      
      {/* Ad Spaces */}
      <div style={{
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'calc(25vw - 20px)',
        height: '80vh',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px dashed rgba(128, 90, 213, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '14px'
      }}>
        Ad Space
      </div>
      
      <div style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'calc(25vw - 20px)',
        height: '80vh',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px dashed rgba(128, 90, 213, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '14px'
      }}>
        Ad Space
      </div>
    </div>
  );
}

export default App;
