import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LicenseInfo } from '@mui/x-license';

import { router } from './router';
import './index.css';

// MUI X Pro 라이선스 (필요 시 env로 주입)
const MUI_X_KEY = import.meta.env.VITE_MUI_X_LICENSE_KEY;
if (MUI_X_KEY) {
  LicenseInfo.setLicenseKey(MUI_X_KEY);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
