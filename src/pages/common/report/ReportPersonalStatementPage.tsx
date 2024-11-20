import { personalStatementReportDescription } from '@/data/description';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetActiveReports } from '../../../api/report';

const ReportPersonalStatementPage = () => {
  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/personal-statement`;
  const description = personalStatementReportDescription;
  const { data } = useGetActiveReports();
  const title = getReportLandingTitle(
    data?.personalStatementInfo?.title ?? '자기소개서',
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://s.tosspayments.com/Bk0m4yZg56F';
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

export default ReportPersonalStatementPage;
