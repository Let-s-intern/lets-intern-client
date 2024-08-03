// https://vike.dev/onRenderClient
export { onRenderClient };

import React from 'react';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { PageContextClient } from 'vike/types';

declare global {
  interface Window {
    __root: Root;
    __lastRenderMode: 'blog' | 'catch_all';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const router = createBrowserRouter(routes);
async function onRenderClient(pageContext: PageContextClient) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;
  const data = pageContext.data;

  const page = <Page data={data} />;
  // const page = (
  //   <React.StrictMode>
  //     {/* TODO: 구조 개선하여 제거해야 함 */}
  //     <BlogProvider blog={mockBlog}>
  //       <RouterProvider router={router} />
  //     </BlogProvider>
  //   </React.StrictMode>
  // );
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

  // if (pageContext.isHydration) {
  //   window.__root = hydrateRoot(container, page);
  // } else {
  //   if (!window.__root) {
  //     window.__root = createRoot(container);
  //   } else if (window.__lastRenderMode !== 'catch_all') {
  //     window.__root.unmount();
  //     window.__root = createRoot(container);
  //   }
  //   window.__root.render(page);
  // }
  // window.__lastRenderMode = 'catch_all';

  // console.log('end catch-all csr');
}
