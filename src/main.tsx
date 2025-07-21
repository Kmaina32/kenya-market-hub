import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient(); // Create a QueryClient instance

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}> {/* Wrap App with QueryClientProvider */}
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
