import { useTypingGame } from '../../lib/stores/useTypingGame';
import { useAudio } from '../../lib/stores/useAudio';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const GameUI = () => {
  const { score, wpm, accuracy, currentWord, pauseGame, resumeGame, isPaused } = useTypingGame();
  const { toggleMute, isMuted } = useAudio();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <Card className="bg-black/80 border-gray-600 p-4">
          <div className="flex space-x-6 text-white">
            <div className="text-center">
              <div className="text-sm text-gray-300">Score</div>
              <div className="text-xl font-bold">{score.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300">WPM</div>
              <div className="text-xl font-bold">{wpm}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300">Accuracy</div>
              <div className="text-xl font-bold">{accuracy}%</div>
            </div>
          </div>
        </Card>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="bg-black/80 border-gray-600 text-white hover:bg-gray-800"
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={isPaused ? resumeGame : pauseGame}
            className="bg-black/80 border-gray-600 text-white hover:bg-gray-800"
          >
            {isPaused ? '▶️' : '⏸️'}
          </Button>
        </div>
      </div>

      {/* Current word display */}
      {currentWord && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <Card className="bg-black/95 border-purple-500/50 p-4 shadow-lg shadow-purple-500/20">
            <div className="text-center">
              <div className="text-sm text-purple-300 mb-2">🎯 Target Word:</div>
              <div className="text-2xl font-mono text-white tracking-wider bg-purple-900/30 px-4 py-2 rounded border border-purple-500/30">
                {currentWord}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto">
          <Card className="bg-black/90 border-gray-600 p-8">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Game Paused</h2>
              <Button
                onClick={resumeGame}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Resume Game
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameUI;
