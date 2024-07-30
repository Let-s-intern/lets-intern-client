import { clientOnly } from 'vike-react/clientOnly';

const Page = clientOnly(() => import('../src/App'));

export { Page };
