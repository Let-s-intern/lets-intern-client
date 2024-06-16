import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Router from './Router';
import { ZodError } from 'zod';

dayjs.locale('ko');

const App = () => {
  // TODO: 밖으로 빼야 함
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.error(error);
        if (error instanceof ZodError) {
          console.log(error.issues);
        }
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
