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
    <div className="w-screen h-screen relative overflow-hidden bg-gradient-to-b from-[#0a0a23] to-[#1a1a3e] flex">
      {/* Left Ad Space - hidden on small screens */}
      <aside className="hidden md:flex items-center justify-center bg-[rgba(20,20,40,0.85)] text-white font-bold z-20 md:w-48 lg:w-72 p-2">
        <div className="text-center">Ad Space</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex items-center justify-center min-h-0">
        {gameState === 'menu' && <MainMenu />}
        {gameState === 'playing' && (
          <>
            <GameCanvas />
            <GameUI />
          </>
        )}
        {gameState === 'gameOver' && <GameOver />}
      </main>

      {/* Right Ad Space - hidden on small screens */}
      <aside className="hidden md:flex items-center justify-center bg-[rgba(20,20,40,0.85)] text-white font-bold z-20 md:w-48 lg:w-72 p-2">
        <div className="text-center">Ad Space</div>
      </aside>
    </div>
  );
}

export default App;
