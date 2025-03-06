import React from 'react';
import Box from './components/Box';
import Header from './components/Header';
import Footer from './components/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 mt-[4.5rem] mb-[3.5rem] p-4 pt-8">
          <Box />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
