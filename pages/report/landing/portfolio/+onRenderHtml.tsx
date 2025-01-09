// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { renderToString } from 'react-dom/server';
// import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import { ActiveReportsProvider } from '@/context/ActiveReports';
import { portfolioReportDescription } from '@/data/description';
import Provider from '@/Provider';
import { routes } from '@/routes';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
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
import { Data } from './+data';

const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;
  const data = pageContext.data as Data;

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
        <ActiveReportsProvider activeReports={data}>
          <Provider>
            <StaticRouterProvider
              router={router}
              hydrate={true}
              context={context}
            />
          </Provider>
        </ActiveReportsProvider>
      </React.StrictMode>,
    ),
  );

  return getServerHtml({
    pageHtml,
    title: getReportLandingTitle(data.portfolioInfo?.title || '포트폴리오'),
    description: portfolioReportDescription,
    image: `${getBaseUrlFromServer()}/images/report/open-graph-portfolio.png`,
    url: `${getBaseUrlFromServer()}/report/landing/portfolio`,
  });
};
