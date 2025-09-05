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
        flexDirection: 'row',
        alignItems: 'stretch',
      }}
    >
      {/* Left Ad Space */}
      <div
        style={{
          width: '300px',
          background: 'rgba(20,20,40,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          zIndex: 2,
        }}
      >
        {/* Replace with ad content */}
        Ad Space
      </div>
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
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
      {/* Right Ad Space */}
      <div
        style={{
          width: '300px',
          background: 'rgba(20,20,40,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          zIndex: 2,
        }}
      >
        {/* Replace with ad content */}
        Ad Space
      </div>
    </div>
  );
}

export default App;
