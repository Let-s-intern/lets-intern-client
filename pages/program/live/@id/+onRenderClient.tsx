// https://vike.dev/onRenderClient
export { onRenderClient };

import { ServerLiveProvider } from '@/context/ServerLive';
import Provider from '@/Provider';
import Router from '@/Router';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { PageContextClient } from 'vike/types';
import { Data } from './+data';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.tz.setDefault('Asia/Seoul');
async function onRenderClient(pageContext: PageContextClient) {
  const data = pageContext.data as Data;

  const page = (
    <React.StrictMode>
      <ServerLiveProvider live={data}>
        <Provider>
          <Router />
        </Provider>
      </ServerLiveProvider>
    </React.StrictMode>
  );
  const container = document.getElementById('root')!;

  if (pageContext.isHydration) {
    window.__root = hydrateRoot(container, page);
  } else {
    if (!window.__root) {
      window.__root = createRoot(container);
    }
    window.__root.render(page);
  }
}
