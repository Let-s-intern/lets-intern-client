// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { renderToString } from 'react-dom/server';
// import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import { dangerouslySkipEscape } from 'vike/server';
import { PageContextServer } from 'vike/types';
import getServerHtml from './getServerHtml';

async function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;
  const data = pageContext.data;

  const pageHtml = dangerouslySkipEscape(renderToString(<Page data={data} />));

  return getServerHtml({
    pageHtml,
  });
}
