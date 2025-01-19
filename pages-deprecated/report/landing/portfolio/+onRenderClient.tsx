// https://vike.dev/onRenderClient
export { onRenderClient };

import { ActiveReportsProvider } from '@/context/ActiveReports';
import Provider from '@/Provider';
import Router from '@/Router';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { PageContextClient } from 'vike/types';
import { Data } from './+data';
async function onRenderClient(pageContext: PageContextClient) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;
  const data = pageContext.data as Data;

  // const page = <Page data={data} />;
  const page = (
    <React.StrictMode>
      <ActiveReportsProvider activeReports={data}>
        <Provider>
          <Router />
        </Provider>
      </ActiveReportsProvider>
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
