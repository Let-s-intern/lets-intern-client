'use client';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { ZodError } from 'zod';

const AdminProviders: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Instead do this, which ensures each request has its own cache:
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },

        queryCache: new QueryCache({
          onError: (error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            if (error instanceof ZodError) {
              // eslint-disable-next-line no-console
              console.log(error.issues);
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <AdminSnackbarProvider>{children}</AdminSnackbarProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default AdminProviders;
