// https://vike.dev/onRenderClient
export { onRenderClient };

import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { PageLayout } from './PageLayout';

let root: Root;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onRenderClient(pageContext: any) {
  const { Page } = pageContext;

  const page = (
    <PageLayout>
      <Page />
    </PageLayout>
  );
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
