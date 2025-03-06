import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 text-center z-50">
      <p className="text-sm text-gray-600 m-0">
        &copy; {new Date().getFullYear()} Vincent Ramdhanie. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer; 