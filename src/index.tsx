import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/apply.scss';
import './styles/card.scss';
import './styles/github-markdown-light.css';
import './styles/modal.scss';
import './styles/mypage.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
