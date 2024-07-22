import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ZodError } from 'zod';
import Router from './Router';

dayjs.locale('ko');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0 },
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
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
