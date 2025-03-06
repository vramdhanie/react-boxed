import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import useStore from '../store/useStore';
import { constructTrie, generateWords, findOptionalSolutions } from '../utils/wordProcessor';
import { useQuery } from '@tanstack/react-query';
import type { TrieNode } from '../utils/wordProcessor';

const ItemTypes = {
  LETTER: 'letter'
};

const fetchWordList = async () => {
  const response = await fetch('/assets/words_alpha.txt');
  const text = await response.text();
  return text.split('\n').map(word => word.trim().toUpperCase());
};

interface DragItem {
  type: string;
  key: string;
}

const Board: React.FC = () => {
  const placedLetters = useStore((state) => state.placedLetters);
  const setLetter = useStore((state) => state.setLetter);
  const removeLetter = useStore((state) => state.removeLetter);
  const [solutions, setSolutions] = useState<[string, string][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedSolve, setHasAttemptedSolve] = useState(false);

  const getLetterForPosition = (position: number) => {
    return placedLetters.find((letter) => letter.position === position)?.key;
  };

  const handleSolve = async () => {
    if (!trie) return;
    setIsLoading(true);
    setHasAttemptedSolve(true);
    
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

  // Fetch word list and construct trie
  const { data: trie, isLoading: isLoadingWords, error: wordLoadError } = useQuery<TrieNode>({
    queryKey: ['wordList'],
    queryFn: async () => {
      const words = await fetchWordList();
      return constructTrie(words);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

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

  const Cell: React.FC<{ position: number }> = ({ position }) => {
    const letter = getLetterForPosition(position);
    const isEmpty = !letter;
    const cellRef = useRef<HTMLDivElement>(null);

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ItemTypes.LETTER,
      canDrop: () => !getLetterForPosition(position),
      drop: (item: DragItem) => {
        setLetter(item.key, position);
        return { dropped: true };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }), [position, getLetterForPosition, setLetter]);

    useEffect(() => {
      drop(cellRef.current);
    }, [drop]);

    return (
      <div
        ref={cellRef}
        onClick={() => letter && removeLetter(position)}
        className={`w-12 h-12 border-2 rounded-lg 
                   shadow-sm flex items-center justify-center
                   transition-all duration-200
                   touch-none select-none
                   ${isEmpty && isOver && canDrop
                     ? 'border-blue-400 bg-blue-50 scale-110' 
                     : isEmpty && canDrop
                     ? 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                     : 'border-gray-300 bg-white cursor-pointer hover:bg-gray-50 active:bg-gray-100'}`}
      >
        <span className={letter ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
          {letter || position + 1}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="relative w-[240px] h-[240px] mx-auto border-2 border-gray-300 rounded-lg">
        {/* Top row */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map(i => <Cell key={i} position={i} />)}
        </div>

        {/* Right side */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {[3, 4, 5].map(i => <Cell key={i} position={i} />)}
        </div>

        {/* Bottom row */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[6, 7, 8].map(i => <Cell key={i} position={i} />)}
        </div>

        {/* Left side */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {[9, 10, 11].map(i => <Cell key={i} position={i} />)}
        </div>

        {/* Solve button */}
        <button
          onClick={handleSolve}
          disabled={isLoading || placedLetters.length !== 12}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 active:bg-blue-800
                   disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200
                   flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Solving...</span>
            </>
          ) : (
            'Solve'
          )}
        </button>
      </div>

      {/* Solutions display */}
      {hasAttemptedSolve && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Solutions:</h3>
          {solutions.length > 0 ? (
            <div className="space-y-2">
              {solutions.map((solution, index) => (
                <div key={index} className="text-gray-800">
                  {solution[0]} → {solution[1]}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-center py-4">
              No solutions found for the current arrangement.
              <br />
              Try rearranging the letters!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Board; 