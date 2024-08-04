// import BrowserApp from '../../src/BrowserApp';
import React from 'react';
import { clientOnly } from 'vike-react/clientOnly';

const BrowserApp = clientOnly(() => import('../../src/BrowserApp'));
const Provider = clientOnly(() => import('../../src/Provider'));
const App = clientOnly(() => import('../../src/App'));

export function Page() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
