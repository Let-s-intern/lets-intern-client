'use client';

import MswProvider from '@/context/MswProvider';
import PostHogProvider from '@/context/PostHogProvider';
import SentryUserSync from '@/context/SentryUserSync';
import { ConfirmProvider, Toaster } from '@letscareer/ui';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { ZodError } from 'zod';

const Providers: React.FC<{
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
      <SentryUserSync />
      <MswProvider>
        <ConfirmProvider>
          <PostHogProvider>
            <Toaster>{children}</Toaster>
          </PostHogProvider>
        </ConfirmProvider>
      </MswProvider>
    </QueryClientProvider>
  );
};

export default Providers;
