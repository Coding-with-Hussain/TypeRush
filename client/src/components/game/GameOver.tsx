import { useTypingGame } from '../../lib/stores/useTypingGame';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const GameOver = () => {
  const { score, wpm, accuracy, highScore, resetGame } = useTypingGame();

  const getRank = (wpm: number) => {
    if (wpm >= 80) return { rank: 'Master Typist', color: 'text-yellow-400', medals: '🥇🥇🥇' };
    if (wpm >= 61) return { rank: 'Expert Typist', color: 'text-yellow-400', medals: '🥇🥇' };
    if (wpm >= 46) return { rank: 'Skilled Typist', color: 'text-yellow-400', medals: '🥇' };
    if (wpm >= 26) return { rank: 'Novice Typist', color: 'text-gray-400', medals: '🥉' };
    return { rank: 'Practice More', color: 'text-red-400', medals: '' };
  };

  const rankInfo = getRank(wpm);
  const isNewHighScore = score > highScore;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
      <Card className="w-full max-w-lg mx-4 bg-black/95 border-gray-600">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Game Over
          </CardTitle>
          {isNewHighScore && (
            <div className="text-yellow-400 font-semibold animate-pulse">
              🎉 New High Score! 🎉
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-300">Final Score</div>
              <div className="text-2xl font-bold text-white">
                {score.toLocaleString()}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-300">Words Per Minute</div>
              <div className="text-2xl font-bold text-white">{wpm}</div>
            </div>
            
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-300">Accuracy</div>
              <div className="text-2xl font-bold text-white">{accuracy}%</div>
            </div>
            
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-300">High Score</div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.max(score, highScore).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Rank Display */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-gray-600">
            <div className="text-3xl mb-2">{rankInfo.medals}</div>
            <div className={`text-xl font-bold ${rankInfo.color}`}>
              {rankInfo.rank}
            </div>
          </div>

          {/* Performance Tips */}
          <div className="bg-gray-800/30 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Performance Tips:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              {wpm < 26 && <li>• Focus on accuracy before speed</li>}
              {accuracy < 90 && <li>• Take your time to avoid errors</li>}
              {wpm >= 26 && wpm < 46 && <li>• Practice touch typing regularly</li>}
              {wpm >= 46 && <li>• Excellent typing! Try harder difficulty</li>}
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={resetGame}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Play Again
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              Main Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOver;
