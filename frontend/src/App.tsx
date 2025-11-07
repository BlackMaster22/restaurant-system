import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { router } from './router';

const queryClient = new QueryClient();

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  );
}

export default App;