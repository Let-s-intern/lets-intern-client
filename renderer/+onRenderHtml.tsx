// https://vike.dev/onRenderHtml
export { onRenderHtml };

import React from 'react';
import { renderToString } from 'react-dom/server';
import { dangerouslySkipEscape } from 'vike/server';
import { PageContextServer } from 'vike/types';
import getServerHtml from './getServerHtml';

async function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;

  const data = pageContext.data;
  const page = <Page data={data} />;

  const pageHtml = dangerouslySkipEscape(renderToString(page));

  return getServerHtml({
    pageHtml,
  });
}
