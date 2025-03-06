import React from 'react';
import Keyboard from './Keyboard';
import Board from './Board';

const Box: React.FC = () => {
  return (
    <div className="w-full">
      <Keyboard />
      <Board />
    </div>
  );
};

export default Box; 