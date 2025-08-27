import { useState, useEffect } from 'react';
import { useTypingGame } from '../../lib/stores/useTypingGame';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MainMenu = () => {
  const { startGame, highScore } = useTypingGame();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
  }, []);

  const difficultyInfo = {
    easy: { name: 'Easy', target: '26+ WPM', description: 'Slow enemies, simple words' },
    medium: { name: 'Medium', target: '46+ WPM', description: 'Moderate speed, mixed words' },
    hard: { name: 'Hard', target: '81+ WPM', description: 'Fast enemies, complex words' }
  };

  const handleStart = () => {
    startGame(difficulty);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-indigo-900/40 animate-pulse" />
      
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <Card className={`w-full max-w-lg mx-4 bg-black/95 border-purple-500/50 shadow-2xl shadow-purple-500/20 backdrop-blur-sm ${animationClass}`}>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 animate-gradient">
            🚀 Space Typer
          </CardTitle>
          <p className="text-gray-300 text-lg">
            Defend Earth by typing words to destroy alien invaders!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-3">
              🎯 Choose Your Challenge
            </label>
            <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
              <SelectTrigger className="bg-gray-900/80 border-purple-500/30 text-white hover:border-purple-400/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-purple-500/30 backdrop-blur-sm">
                {Object.entries(difficultyInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key} className="text-white focus:bg-purple-700/30 hover:bg-purple-700/20">
                    <div>
                      <div className="font-medium">{info.name}</div>
                      <div className="text-xs text-gray-400">{info.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-3 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/20">
              <div className="text-sm text-gray-300">
                🏁 Target Speed: <span className="text-yellow-400 font-bold">
                  {difficultyInfo[difficulty].target}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {difficultyInfo[difficulty].description}
              </div>
            </div>
          </div>

          {highScore > 0 && (
            <div className="text-center p-4 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-lg border border-yellow-500/30 shadow-lg">
              <div className="text-sm text-gray-300 mb-1">🏆 Personal Best</div>
              <div className="text-2xl font-bold text-yellow-400 animate-pulse">
                {highScore.toLocaleString()}
              </div>
              <div className="text-xs text-yellow-300/70 mt-1">Can you beat your record?</div>
            </div>
          )}

          <Button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            🚀 Launch Mission
          </Button>

          <div className="text-center space-y-3 text-sm text-gray-400 bg-gray-900/30 p-4 rounded-lg border border-gray-700/30">
            <div className="text-purple-300 font-medium">💡 Mission Briefing:</div>
            <p>⌨️ Type the words above enemy ships to target them</p>
            <p>🎯 Complete words to fire and destroy enemies</p>
            <p>⚡ Type fast and accurately to save Earth!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainMenu;
