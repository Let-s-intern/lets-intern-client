'use client';

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { ZodError } from 'zod';

const MentorProviders: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default MentorProviders;
