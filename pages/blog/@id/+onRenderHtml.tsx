// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { renderToString } from 'react-dom/server';
// import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import React from 'react';
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { dangerouslySkipEscape } from 'vike/server';
import { OnRenderHtmlAsync } from 'vike/types';
import getServerHtml from '../../../renderer/getServerHtml';
import { BlogProvider } from '../../../src/context/Post';
import Provider from '../../../src/Provider';
import { routes } from '../../../src/routes';
import { blogCategory } from '../../../src/utils/convert';
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
      <BlogProvider blog={data}>
        <Provider>
          <StaticRouterProvider
            router={router}
            hydrate={true}
            context={context}
          />
        </Provider>
      </BlogProvider>,
    ),
  );

  return getServerHtml({
    pageHtml,
    title: `${data.blogDetailInfo.title} | ${blogCategory[data.blogDetailInfo.category || '']} - 렛츠커리어`,
    description: data.blogDetailInfo.description || undefined,
    image: data.blogDetailInfo.thumbnail || undefined,
  });
};
