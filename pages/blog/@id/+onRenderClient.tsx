// https://vike.dev/onRenderClient
export { onRenderClient };

  import React from 'react';
  import { createRoot, hydrateRoot } from 'react-dom/client';
  import { PageContextClient } from 'vike/types';
// import { BrowserApp } from '../../../src/BrowserApp';
import { BlogProvider } from '../../../src/context/Post';
import Provider from '../../../src/Provider';
import Router from '../../../src/Router';
import { Data } from './+data';
// const BrowserApp = clientOnly(() => import('../../../src/BrowserApp'));
// const Provider = clientOnly(() => import('../../../src/Provider'));
// const router = createBrowserRouter(routes);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const router = createBrowserRouter(routes);

async function onRenderClient(pageContext: PageContextClient) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;
  const data = pageContext.data as Data;

  // const page = <Page data={data} />;
  const page = (
    <React.StrictMode>
      <BlogProvider blog={data}>
        <Provider>
          <Router />
        </Provider>
      </BlogProvider>
    </React.StrictMode>
  );
  const container = document.getElementById('root')!;

  // console.log('renderer pageContext', {
  //   isHydration: pageContext.isHydration,
  //   window__root: window.__root,
  //   window__lastRenderMode: window.__lastRenderMode,
  //   stack: new Error().stack,
  // });

  if (pageContext.isHydration) {
    window.__root = hydrateRoot(container, page);
  } else {
    if (!window.__root) {
      window.__root = createRoot(container);
    }
    window.__root.render(page);
  }
}
