import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LicenseInfo } from '@mui/x-license';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { router } from './router';
import { AdminSnackbarProvider } from './hooks/useAdminSnackbar';
import './lib/dayjs';
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

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <AdminSnackbarProvider>
            <RouterProvider router={router} />
          </AdminSnackbarProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

// MSW 게이트: VITE_ENABLE_MSW === 'true' 일 때만 worker 를 동적 import 후 시작.
// 동적 import + env 게이트로 프로덕션 번들에는 포함되지 않는다.
// worker.start() 완료 후 렌더해야 초기 요청이 핸들러에 의해 가로채진다.
async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
  renderApp();
}

bootstrap();
