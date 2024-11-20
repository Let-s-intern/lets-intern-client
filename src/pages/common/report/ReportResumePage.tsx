import { resumeReportDescription } from '@/data/description';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetActiveReports } from '../../../api/report';

const ReportResumePage = () => {
  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/resume`;
  const description = resumeReportDescription;
  const { data } = useGetActiveReports();
  const title = getReportLandingTitle(data?.resumeInfo?.title ?? '이력서');

  // 리다이렉트 구현
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://s.tosspayments.com/BkzqF1s4Psc';
    }
  }, []);

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

export default ReportResumePage;
