// Word dictionary for different difficulty levels
const easyWords = [
  'cat', 'dog', 'run', 'jump', 'play', 'book', 'car', 'sun', 'moon', 'star',
  'fish', 'bird', 'tree', 'home', 'love', 'good', 'help', 'kind', 'fast', 'slow',
  'big', 'small', 'red', 'blue', 'green', 'happy', 'sad', 'eat', 'drink', 'sleep'
];

const mediumWords = [
  'computer', 'keyboard', 'monitor', 'spaceship', 'asteroid', 'galaxy', 'planet',
  'universe', 'rocket', 'engine', 'laser', 'shield', 'weapon', 'battle', 'victory',
  'challenge', 'adventure', 'explore', 'discover', 'research', 'science', 'technology',
  'mission', 'journey', 'destination', 'navigation', 'communication', 'satellite'
];

const hardWords = [
  'extraordinary', 'incomprehensible', 'electromagnetic', 'quantum', 'phenomenon',
  'acceleration', 'gravitational', 'atmospheric', 'astronomical', 'interstellar',
  'extraterrestrial', 'technological', 'revolutionary', 'sophisticated', 'magnificent',
  'unprecedented', 'extraordinary', 'multidimensional', 'incomprehensible', 'transcendental',
  'reconnaissance', 'metamorphosis', 'crystallography', 'supernova', 'constellation'
];

export function getRandomWord(difficulty: 'easy' | 'medium' | 'hard'): string {
  let wordList: string[];
  
  switch (difficulty) {
    case 'easy':
      wordList = easyWords;
      break;
    case 'medium':
      wordList = mediumWords;
      break;
    case 'hard':
      wordList = hardWords;
      break;
    default:
      wordList = easyWords;
  }
  
  return wordList[Math.floor(Math.random() * wordList.length)];
}

export { easyWords, mediumWords, hardWords };
