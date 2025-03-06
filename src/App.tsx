import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Custom provider that uses TouchBackend on touch devices and HTML5Backend otherwise
const CustomDndProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;
  const options = isTouchDevice ? {
    enableMouseEvents: true,
    enableTouchEvents: true,
    delayTouchStart: 0,
    touchSlop: 20,
    ignoreContextMenu: true,
    scrollAngleRanges: [{ start: 30, end: 330 }]
  } : {};

  return (
    <DndProvider backend={backend} options={options}>
      {children}
    </DndProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomDndProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 mt-[4.5rem] mb-[3.5rem]">
            <div className="max-w-2xl mx-auto pt-8">
              <Keyboard />
              <div className="mt-12">
                <Board />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </CustomDndProvider>
    </QueryClientProvider>
  );
}

export default App;
