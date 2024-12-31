// import BrowserApp from '../../src/BrowserApp';
import React from 'react';
import { clientOnly } from 'vike-react/clientOnly';

const BrowserApp = clientOnly(() => import('../../src/BrowserApp'));
const Provider = clientOnly(() => import('../../src/Provider'));
const App = clientOnly(async () => {
  try {
    return await import('../../src/App');
  } catch (error) {
    if (error instanceof Error) {
      alert('앱 로드 실패: ' + error.message);
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
});

export function Page() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
