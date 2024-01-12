import { QueryClient, QueryClientProvider } from 'react-query';
import {
  QueryClient as QueryClient2,
  QueryClientProvider as QueryClientProvider2,
} from '@tanstack/react-query';
import Router from './Router';

const App = () => {
  const queryClient = new QueryClient();
  const queryClient2 = new QueryClient2();

  return (
    <QueryClientProvider2 client={queryClient2}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </QueryClientProvider2>
  );
};

export default App;
