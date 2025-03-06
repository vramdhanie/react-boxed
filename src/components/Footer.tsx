import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 text-center z-50">
      <div className="flex justify-center space-x-4 mb-2">
                    <a href="https://github.com/vramdhanie" className="hover:text-slate-800 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://twitter.com/vramdhanie" className="hover:text-slate-800 transition-colors" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://linkedin.com/in/vramdhanie" className="hover:text-slate-800 transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
      <p className="text-sm text-gray-600 m-0">
        &copy; {new Date().getFullYear()} Vincent Ramdhanie. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer; 