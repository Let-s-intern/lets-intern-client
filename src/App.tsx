import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Router from './Router';

dayjs.locale('ko');

const App = () => {
  // TODO: 밖으로 빼야 함
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
