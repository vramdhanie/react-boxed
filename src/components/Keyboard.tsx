import React, { useState } from 'react';
import useStore from '../store/useStore';

const Keyboard: React.FC = () => {
  const usedKeys = useStore((state) => state.usedKeys);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, key: string) => {
    e.dataTransfer.setData('text/plain', key);
    setDraggedKey(key);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>, key: string) => {
    e.preventDefault();
    setDraggedKey(key);
  };

  const handleTouchEnd = () => {
    setDraggedKey(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-100 p-4 rounded-lg shadow-lg">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-2">
          {row.map((key, keyIndex) => {
            const isUsed = usedKeys.includes(key);
            const isDragging = draggedKey === key;
            return (
              <button
                key={keyIndex}
                draggable={!isUsed}
                onDragStart={(e) => handleDragStart(e, key)}
                onTouchStart={(e) => handleTouchStart(e, key)}
                onTouchEnd={handleTouchEnd}
                className={`w-12 h-12 border-2 rounded-lg 
                         font-semibold text-lg shadow-sm
                         transition-colors duration-100
                         ${isUsed 
                           ? 'bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed' 
                           : isDragging
                           ? 'bg-blue-50 border-blue-300'
                           : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 active:bg-gray-100'}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 