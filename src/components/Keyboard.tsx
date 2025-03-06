import React, { useEffect, useRef } from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import useStore from '../store/useStore';

const ItemTypes = {
  LETTER: 'letter'
};

interface DragItem {
  type: string;
  key: string;
}

const Keyboard: React.FC = () => {
  const usedKeys = useStore((state) => state.usedKeys);
  
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const KeyButton: React.FC<{ letter: string }> = ({ letter }) => {
    const isUsed = usedKeys.includes(letter);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [{ isDragging }, drag, preview] = useDrag({
      type: ItemTypes.LETTER,
      item: { type: ItemTypes.LETTER, key: letter },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      canDrag: !isUsed,
      options: {
        dropEffect: 'move'
      }
    });

    // Create a preview image for touch devices
    const previewImg = new Image();
    previewImg.src = `data:image/svg+xml;utf8,
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
        <rect width="48" height="48" rx="8" fill="rgb(59, 130, 246)" fillOpacity="0.1"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
              font-family="Arial" font-size="24" font-weight="bold" 
              fill="rgb(59, 130, 246)">${letter}</text>
      </svg>`;

    useEffect(() => {
      drag(buttonRef.current);
    }, [drag]);

    return (
      <>
        <DragPreviewImage connect={preview} src={previewImg.src} />
        <button
          ref={buttonRef}
          className={`w-12 h-12 border-2 rounded-lg 
                     font-semibold text-lg shadow-sm
                     transition-colors duration-100
                     touch-none
                     ${isUsed 
                       ? 'bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed' 
                       : isDragging
                       ? 'bg-blue-50 border-blue-300 opacity-50'
                       : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                     } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {letter}
        </button>
      </>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-100 p-4 rounded-lg shadow-lg">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-2 last:mb-0">
          {row.map((key) => (
            <KeyButton key={key} letter={key} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 