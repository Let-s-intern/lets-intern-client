// https://vike.dev/onRenderHtml
export { onRenderHtml };

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { dangerouslySkipEscape } from 'vike/server';
import { PageContextServer } from 'vike/types';
import getServerHtml from './getServerHtml';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.tz.setDefault('Asia/Seoul');

async function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as React.ComponentType<{ data: unknown }>;

  const data = pageContext.data;
  const page = <Page data={data} />;

  const pageHtml = dangerouslySkipEscape(renderToString(page));

  return getServerHtml({
    pageHtml,
  });
}
