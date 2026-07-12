import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
            <Toaster
              position="top-right"
              gutter={8}
              toastOptions={{
                duration: 3500,
                style: { borderRadius: '12px', fontSize: '14px', fontWeight: '500', maxWidth: '380px' },
                success: { style: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }, iconTheme: { primary: '#16a34a', secondary: '#fff' } },
                error: { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }, iconTheme: { primary: '#dc2626', secondary: '#fff' } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
