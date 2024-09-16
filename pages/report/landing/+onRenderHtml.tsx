// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { renderToString } from 'react-dom/server';
// import { dangerouslySkipEscape, escapeInject } from 'vike/server';

import { reportDescription } from '@/data/description';
import Provider from '@/Provider';
import { routes } from '@/routes';
import { getBaseUrlFromServer } from '@/utils/url';
import getServerHtml from '@renderer/getServerHtml';
import React from 'react';
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { dangerouslySkipEscape } from 'vike/server';
import { OnRenderHtmlAsync } from 'vike/types';

const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;

  const { query, dataRoutes } = createStaticHandler(routes);
  // TODO: 임시로 처리
  const mockRequest = new Request(
    `https://localhost:3000${pageContext.urlOriginal}`,
  );
  const context = (await query(mockRequest)) as StaticHandlerContext;
  const router = createStaticRouter(dataRoutes, context);
  const pageHtml = dangerouslySkipEscape(
    renderToString(
      <React.StrictMode>
        <Provider>
          <StaticRouterProvider
            router={router}
            hydrate={true}
            context={context}
          />
        </Provider>
      </React.StrictMode>,
    ),
  );

  return getServerHtml({
    pageHtml,
    title: '서류 진단 - 렛츠커리어',
    description: reportDescription,
    image: `${getBaseUrlFromServer()}/images/report-banner.jpg`,
    url: `${getBaseUrlFromServer()}/report/landing`,
  });
};
