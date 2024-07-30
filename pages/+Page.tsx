import { clientOnly } from 'vike-react/clientOnly';

const App = clientOnly(() => import('../src/App'));

export function Page() {
  return <App />;
}
