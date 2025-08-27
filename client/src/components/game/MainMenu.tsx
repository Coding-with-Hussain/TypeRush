import { useState } from 'react';
import { useTypingGame } from '../../lib/stores/useTypingGame';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MainMenu = () => {
  const { startGame, highScore } = useTypingGame();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const difficultyInfo = {
    easy: { name: 'Easy', target: '26+ WPM', description: 'Slow enemies, simple words' },
    medium: { name: 'Medium', target: '46+ WPM', description: 'Moderate speed, mixed words' },
    hard: { name: 'Hard', target: '81+ WPM', description: 'Fast enemies, complex words' }
  };

  const handleStart = () => {
    startGame(difficulty);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-purple-900/30 to-blue-900/30">
      <Card className="w-full max-w-md mx-4 bg-black/90 border-gray-600">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-white mb-2">
            Space Typer
          </CardTitle>
          <p className="text-gray-300">
            Destroy enemy ships by typing words
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty Level
            </label>
            <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {Object.entries(difficultyInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key} className="text-white focus:bg-gray-700">
                    <div>
                      <div className="font-medium">{info.name}</div>
                      <div className="text-xs text-gray-400">{info.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-2 p-3 bg-gray-800/50 rounded-md">
              <div className="text-sm text-gray-300">
                Target: <span className="text-yellow-400 font-medium">
                  {difficultyInfo[difficulty].target}
                </span>
              </div>
            </div>
          </div>

          {highScore > 0 && (
            <div className="text-center p-3 bg-yellow-900/30 rounded-md border border-yellow-600">
              <div className="text-sm text-gray-300">High Score</div>
              <div className="text-xl font-bold text-yellow-400">
                {highScore.toLocaleString()}
              </div>
            </div>
          )}

          <Button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            size="lg"
          >
            Start Game
          </Button>

          <div className="text-center space-y-2 text-sm text-gray-400">
            <p>Use your keyboard to type words and destroy enemies</p>
            <p>Type accurately and quickly to achieve high scores!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainMenu;
