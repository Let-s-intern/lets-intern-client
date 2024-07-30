// https://vike.dev/onRenderClient
export { onRenderClient };

import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { PageContextClient } from 'vike/types';

let root: Root;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onRenderClient(pageContext: PageContextClient) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;
  const data = pageContext.data;

  const page = <Page data={data} />;
  const container = document.getElementById('root')!;

  if (pageContext.isHydration) {
    root = hydrateRoot(container, page);
  } else {
    if (!root) {
      root = createRoot(container);
    }
    root.render(page);
  }
}
