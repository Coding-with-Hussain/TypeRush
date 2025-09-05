import { useState, useEffect } from 'react';
import { useTypingGame } from '../../lib/stores/useTypingGame';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MainMenu = () => {
  const { startGame, highScore } = useTypingGame();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
  }, []);

  const handleStart = () => {
    startGame();
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

  {/* Responsive fixed height for MainMenu card, centered with top and bottom space */}
  <Card className={`w-full max-w-lg h-[600px] max-h-full my-8 mx-4 bg-black/95 border-purple-500/50 shadow-2xl shadow-purple-500/20 backdrop-blur-sm flex flex-col justify-center ${animationClass}`}>
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
          {/* removed mode description as requested */}

          {highScore > 0 && (
            <div className="text-center p-4 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-lg border border-yellow-500/30 shadow-lg">
              <div className="text-sm text-gray-300 mb-1">🏆 World Record</div>
              <div className="text-2xl font-bold text-yellow-400 animate-pulse">
                {highScore.toLocaleString()}
              </div>
              <div className="text-xs text-yellow-300/70 mt-1">Can you beat the world record?</div>
            </div>
          )}

          <Button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            🚀 Launch Mission
          </Button>

        </CardContent>
      </Card>
    </div>
  );
};

export default MainMenu;
