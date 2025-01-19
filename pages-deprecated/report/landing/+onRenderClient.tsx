// https://vike.dev/onRenderClient
export { onRenderClient };

import Provider from '@/Provider';
import Router from '@/Router';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { PageContextClient } from 'vike/types';

async function onRenderClient(pageContext: PageContextClient) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;

  // const page = <Page data={data} />;
  const page = (
    <React.StrictMode>
      <Provider>
        <Router />
      </Provider>
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
