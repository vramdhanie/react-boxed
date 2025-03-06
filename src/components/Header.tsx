import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 md:p-6 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center text-xl font-bold rounded-lg">
          B
        </div>
        <span className="text-xl font-semibold text-gray-800">
          Boxed
        </span>
      </div>
    </header>
  );
};

export default Header; 