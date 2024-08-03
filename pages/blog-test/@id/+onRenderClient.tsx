// https://vike.dev/onRenderClient
export { onRenderClient };

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { clientOnly } from 'vike-react/clientOnly';
import { PageContextClient } from 'vike/types';
import { BlogProvider } from '../../../src/context/Post';
import { routes } from '../../../src/routes';
import { Data } from './+data';
const BrowserApp = clientOnly(() => import('../../../src/BrowserApp'));
const Provider = clientOnly(() => import('../../../src/Provider'));
const router = createBrowserRouter(routes);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onRenderClient(pageContext: PageContextClient) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;
  const data = pageContext.data as Data;

  // const page = <Page data={data} />;
  const page = (
    <BlogProvider blog={data}>
      <Provider>
        <BrowserApp />
      </Provider>
    </BlogProvider>
  );
  const container = document.getElementById('root')!;

  if (!window.__root) {
    window.__root = createRoot(container);
  }
  window.__root.render(page);
}
