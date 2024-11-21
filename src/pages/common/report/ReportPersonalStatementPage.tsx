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
      <meta
        name="keywords"
        content="렛츠커리어, 렛츠인턴, 챌린지, 인턴, 신입, 취업, 취업준비, 취뽀, 인턴합격, 신입합격, 서류합격, 면접합격, 서류 첨삭, 서류 피드백, 이력서, 자기소개서, 포트폴리오, 이력서 첨삭, 자기소개서 첨삭, 포트폴리오 첨삭, 이력서 피드백, 자기소개서 피드백, 포트폴리오 피드백"
      />
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
