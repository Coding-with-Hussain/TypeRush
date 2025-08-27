import { useTypingGame } from '../../lib/stores/useTypingGame';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useState, useEffect } from 'react';

const GameOver = () => {
  const { score, wpm, accuracy, highScore, resetGame } = useTypingGame();
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getRank = (wpm: number) => {
    if (wpm >= 80) return { rank: 'Galactic Hero', color: 'text-yellow-400', medals: '🥇🥇🥇', emoji: '👑' };
    if (wpm >= 61) return { rank: 'Space Commander', color: 'text-yellow-400', medals: '🥇🥇', emoji: '⭐' };
    if (wpm >= 46) return { rank: 'Elite Pilot', color: 'text-blue-400', medals: '🥇', emoji: '🛸' };
    if (wpm >= 26) return { rank: 'Cadet', color: 'text-green-400', medals: '🥉', emoji: '🚀' };
    return { rank: 'Recruit', color: 'text-gray-400', medals: '', emoji: '👶' };
  };

  const rankInfo = getRank(wpm);
  const isNewHighScore = score > highScore;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-purple-900/40 to-blue-900/40" />
      
      {/* Falling debris animation */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-2 bg-orange-400 opacity-70 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>
      
      <Card className="w-full max-w-2xl mx-4 bg-black/95 border-red-500/50 shadow-2xl shadow-red-500/20 backdrop-blur-sm animate-slide-up">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mb-4">
            {isNewHighScore ? '🏆 VICTORY!' : '💥 Mission Complete'}
          </CardTitle>
          {isNewHighScore && (
            <div className="text-yellow-400 font-bold animate-pulse text-xl">
              🎉 NEW GALACTIC RECORD! 🎉
            </div>
          )}
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto mt-4 rounded-full" />
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Stats Grid */}
          <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center p-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-lg border border-blue-500/30 hover:scale-105 transition-transform">
              <div className="text-sm text-blue-300 mb-2">💀 Enemies Destroyed</div>
              <div className="text-3xl font-bold text-white">
                {score.toLocaleString()}
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-900/40 to-blue-900/40 rounded-lg border border-green-500/30 hover:scale-105 transition-transform">
              <div className="text-sm text-green-300 mb-2">⚡ Typing Speed</div>
              <div className="text-3xl font-bold text-white">{wpm} <span className="text-sm text-gray-400">WPM</span></div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-lg border border-yellow-500/30 hover:scale-105 transition-transform">
              <div className="text-sm text-yellow-300 mb-2">🎯 Accuracy</div>
              <div className="text-3xl font-bold text-white">{accuracy}<span className="text-sm text-gray-400">%</span></div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-lg border border-purple-500/30 hover:scale-105 transition-transform">
              <div className="text-sm text-purple-300 mb-2">👑 Best Score</div>
              <div className="text-3xl font-bold text-yellow-400">
                {Math.max(score, highScore).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Rank Display */}
          <div className="text-center p-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border-2 border-purple-500/30 shadow-lg hover:shadow-purple-500/20 transition-all">
            <div className="text-6xl mb-4">{rankInfo.emoji}</div>
            <div className="text-4xl mb-3">{rankInfo.medals}</div>
            <div className={`text-2xl font-bold ${rankInfo.color} mb-2`}>
              {rankInfo.rank}
            </div>
            <div className="text-gray-400 text-sm">
              {wpm >= 80 ? 'Earth\'s Greatest Defender!' : 
               wpm >= 61 ? 'Outstanding Performance!' :
               wpm >= 46 ? 'Solid Defense!' :
               wpm >= 26 ? 'Good Effort!' : 'Keep Training!'}
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

          <div className="flex space-x-4">
            <Button
              onClick={resetGame}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              🔄 Restart Mission
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex-1 bg-gray-900/80 border-purple-500/30 text-purple-300 hover:bg-purple-900/30 hover:border-purple-400/50 font-bold py-3 transition-all duration-300 transform hover:scale-105"
            >
              🏠 Return to Base
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOver;
