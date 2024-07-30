import { clientOnly } from 'vike-react/clientOnly';

const App = clientOnly(() => import('../../src/App'));

export default App;
