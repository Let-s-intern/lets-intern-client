'use client';

// TODO: 제거
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/navigation';

import { reportDescription } from '@/data/description';
import { getBaseUrlFromServer } from '@/utils/url';

const ReportPage = () => {
  const router = useRouter();

  const title = '서류 진단 - 렛츠커리어';
  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing`;
  const description = reportDescription;

  useEffect(() => {
    // TODO: Routes 컴포넌트가 매번 새롭게 리렌더링되어 너무 빠르게 이동하면 주소가 잘못 잡히는 문제가 있음.
    // Router 를 제대로 구성하면 setTimeout 안해도 될 듯.
    setTimeout(() => {
      router.push('/report/landing/resume');
    }, 50);
  }, [router]);

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:url" content={url} />

      {description ? (
        <meta property="og:description" content={description} />
      ) : null}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:url" content={url} />
      {description ? (
        <meta name="twitter:description" content={description} />
      ) : null}
    </Helmet>
  );
};

export default ReportPage;