import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1m
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * MSW 부트스트랩 — `VITE_API_MOCKING=enabled` 일 때만 worker 시작.
 * `pnpm dev:mock:mentor` 로 활성화.
 */
async function bootstrap() {
  if (import.meta.env.VITE_API_MOCKING === 'enabled') {
    const { worker } = await import('@letscareer/mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

bootstrap();
