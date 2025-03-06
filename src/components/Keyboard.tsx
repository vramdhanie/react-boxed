import React, { useEffect, useRef } from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import useStore from '../store/useStore';

const ItemTypes = {
  LETTER: 'letter'
};

const createDragPreview = (letter: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;  // Slightly larger to accommodate shadow
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Draw background
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.roundRect(8, 8, 48, 48, 8);
  ctx.fill();

  // Reset shadow for border
  ctx.shadowColor = 'transparent';

  // Draw border
  ctx.strokeStyle = 'rgb(59, 130, 246)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(8, 8, 48, 48, 8);
  ctx.stroke();

  // Draw letter
  ctx.fillStyle = 'rgb(59, 130, 246)';
  ctx.font = 'bold 24px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 32, 32);

  return canvas.toDataURL();
};

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
    const previewUrl = useRef(createDragPreview(letter));

    const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: ItemTypes.LETTER,
      item: { type: ItemTypes.LETTER, key: letter },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      canDrag: !isUsed
    }), [letter, isUsed]);

    useEffect(() => {
      drag(buttonRef.current);
    }, [drag]);

    return (
      <>
        <DragPreviewImage connect={preview} src={previewUrl.current} />
        <button
          ref={buttonRef}
          className={`w-12 h-12 border-2 rounded-lg 
                     font-semibold text-lg shadow-sm
                     transition-colors duration-100
                     touch-none select-none
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