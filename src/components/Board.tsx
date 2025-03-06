import React, { useState } from 'react';
import useStore from '../store/useStore';
import { constructTrie, generateWords, findOptionalSolutions } from '../utils/wordProcessor';
import { useQuery } from '@tanstack/react-query';
import type { TrieNode } from '../utils/wordProcessor';

const fetchWordList = async () => {
  const response = await fetch('/assets/words_alpha.txt');
  const text = await response.text();
  return text.split('\n').map(word => word.trim().toUpperCase());
};

const Board: React.FC = () => {
  const placedLetters = useStore((state) => state.placedLetters);
  const setLetter = useStore((state) => state.setLetter);
  const removeLetter = useStore((state) => state.removeLetter);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<[string, string][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch word list and construct trie
  const { data: trie, isLoading: isLoadingWords, error: wordLoadError } = useQuery<TrieNode>({
    queryKey: ['wordList'],
    queryFn: async () => {
      const words = await fetchWordList();
      return constructTrie(words);
    },
    staleTime: Infinity, // Never mark the data as stale since word list won't change
    gcTime: Infinity, // Keep in cache forever
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target instanceof HTMLElement && target.dataset.key) {
      setDraggedKey(target.dataset.key);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    const key = e.dataTransfer.getData('text/plain');
    setLetter(key, position);
    setDraggedKey(null);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target instanceof HTMLElement && target.dataset.key) {
      setLetter(target.dataset.key, position);
    }
    setDraggedKey(null);
  };

  const handleClick = (position: number) => {
    const letter = getLetterForPosition(position);
    if (letter) {
      removeLetter(position);
    }
  };

  const getLetterForPosition = (position: number) => {
    return placedLetters.find((letter) => letter.position === position)?.key;
  };

  const handleSolve = async () => {
    if (!trie) return;
    setIsLoading(true);
    
    // Get the four strings from the board
    const strings = [
      [0, 1, 2].map(i => getLetterForPosition(i) || '').join(''),
      [3, 4, 5].map(i => getLetterForPosition(i) || '').join(''),
      [6, 7, 8].map(i => getLetterForPosition(i) || '').join(''),
      [9, 10, 11].map(i => getLetterForPosition(i) || '').join('')
    ];

    // Check if all positions are filled
    if (strings.some(str => str.length !== 3)) {
      alert('Please fill all positions before solving');
      setIsLoading(false);
      return;
    }

    // Generate all characters
    const allChars = strings.join('').split('');

    // Find solutions
    const validWords = generateWords(strings, trie);
    const solutions = findOptionalSolutions(validWords, allChars);
    setSolutions(solutions);
    setIsLoading(false);
  };

  // Show loading state while word list is being fetched
  if (isLoadingWords) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading word list...</p>
        </div>
      </div>
    );
  }

  // Show error state if word list failed to load
  if (wordLoadError) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-center">
          Error loading word list. Please refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="relative w-[240px] h-[240px] mx-auto border-2 border-gray-300 rounded-lg">
        {/* Top row */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={`top-${i}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, i)}
              onClick={() => handleClick(i)}
              data-key={getLetterForPosition(i)}
              className={`w-12 h-12 border-2 border-gray-300 rounded-lg 
                       shadow-sm flex items-center justify-center
                       ${getLetterForPosition(i) 
                         ? draggedKey === getLetterForPosition(i)
                           ? 'bg-blue-50 border-blue-300'
                           : 'bg-white cursor-pointer hover:bg-gray-50 active:bg-gray-100' 
                         : 'bg-gray-50'}`}
            >
              <span className={getLetterForPosition(i) ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                {getLetterForPosition(i) || i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {[3, 4, 5].map((i) => (
            <div
              key={`right-${i}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, i)}
              onClick={() => handleClick(i)}
              data-key={getLetterForPosition(i)}
              className={`w-12 h-12 border-2 border-gray-300 rounded-lg 
                       shadow-sm flex items-center justify-center
                       ${getLetterForPosition(i) 
                         ? draggedKey === getLetterForPosition(i)
                           ? 'bg-blue-50 border-blue-300'
                           : 'bg-white cursor-pointer hover:bg-gray-50 active:bg-gray-100' 
                         : 'bg-gray-50'}`}
            >
              <span className={getLetterForPosition(i) ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                {getLetterForPosition(i) || i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[6, 7, 8].map((i) => (
            <div
              key={`bottom-${i}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, i)}
              onClick={() => handleClick(i)}
              data-key={getLetterForPosition(i)}
              className={`w-12 h-12 border-2 border-gray-300 rounded-lg 
                       shadow-sm flex items-center justify-center
                       ${getLetterForPosition(i) 
                         ? draggedKey === getLetterForPosition(i)
                           ? 'bg-blue-50 border-blue-300'
                           : 'bg-white cursor-pointer hover:bg-gray-50 active:bg-gray-100' 
                         : 'bg-gray-50'}`}
            >
              <span className={getLetterForPosition(i) ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                {getLetterForPosition(i) || i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Left side */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {[9, 10, 11].map((i) => (
            <div
              key={`left-${i}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, i)}
              onClick={() => handleClick(i)}
              data-key={getLetterForPosition(i)}
              className={`w-12 h-12 border-2 border-gray-300 rounded-lg 
                       shadow-sm flex items-center justify-center
                       ${getLetterForPosition(i) 
                         ? draggedKey === getLetterForPosition(i)
                           ? 'bg-blue-50 border-blue-300'
                           : 'bg-white cursor-pointer hover:bg-gray-50 active:bg-gray-100' 
                         : 'bg-gray-50'}`}
            >
              <span className={getLetterForPosition(i) ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                {getLetterForPosition(i) || i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Solve button */}
        <button
          onClick={handleSolve}
          disabled={isLoading || placedLetters.length !== 12}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 active:bg-blue-800
                   disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          {isLoading ? 'Solving...' : 'Solve'}
        </button>
      </div>

      {/* Solutions display */}
      {solutions.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Solutions:</h3>
          <div className="space-y-2">
            {solutions.map((solution, index) => (
              <div key={index} className="text-gray-800">
                {solution[0]} → {solution[1]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Board; 