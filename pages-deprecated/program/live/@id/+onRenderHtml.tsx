// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { renderToString } from 'react-dom/server';
// import { dangerouslySkipEscape, escapeInject } from 'vike/server';
// import { ServerLiveProvider } from '@/context/ServerLive';
import Provider from '@/Provider';
import { routes } from '@/routes';
import {
  getBaseUrlFromServer,
  getLiveTitle,
  getProgramPathname,
} from '@/utils/url';
import getServerHtml from '@renderer/getServerHtml';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
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

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.tz.setDefault('Asia/Seoul');

const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
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
        {/* <ServerLiveProvider live={data}> */}
        <Provider>
          <StaticRouterProvider
            router={router}
            hydrate={true}
            context={context}
          />
        </Provider>
        {/* </ServerLiveProvider> */}
      </React.StrictMode>,
    ),
  );

  return getServerHtml({
    pageHtml,
    title: getLiveTitle(data),
    description: data.shortDesc || undefined,
    image: data.thumbnail || undefined,
    url: `${getBaseUrlFromServer()}${getProgramPathname({
      title: data.title,
      programType: 'live',
      id: data.id,
    })}`,
  });
};
