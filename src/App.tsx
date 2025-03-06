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

function App() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={{
        enableMouseEvents: true,
        delayTouchStart: 50,
        enableHoverOutsideTarget: true,
        ignoreContextMenu: true,
      }}>
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
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;
