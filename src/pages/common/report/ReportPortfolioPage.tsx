import useReportApplicationStore from '@/store/useReportApplicationStore';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetActiveReports } from '../../../api/report';
import LexicalContent from '../../../components/common/blog/LexicalContent';
import ReportApplyBottomSheet from '../../../components/common/report/ReportApplyBottomSheet';
import ReportContentContainer from '../../../components/common/report/ReportContentContainer';
import {
  ReportHeader,
  ReportLandingIntroSection,
} from '../../../components/common/report/ReportIntroSection';
import ReportLandingHeader from '../../../components/common/report/ReportLandingHeader';

const ReportPortfolioPage = () => {
  const title = `포트폴리오 | 서류 진단 - 렛츠커리어`;
  const url = `${window.location.origin}/report/landing/portfolio`;
  // TODO: 설명 추가
  const description = '서류 진단 프로그램입니다. ...';

  const { data } = useGetActiveReports();

  const report = data?.portfolioInfo;

  const root = JSON.parse(report?.contents || '{"root":{}}').root;

  const { initReportApplication } = useReportApplicationStore();
  useEffect(() => {
    initReportApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
      <ReportLandingIntroSection header={<ReportHeader />} />
      <div id="content">
        <ReportLandingHeader />

        <ReportContentContainer>
          <LexicalContent node={root} />
        </ReportContentContainer>
      </div>
      {report ? <ReportApplyBottomSheet report={report} /> : null}
    </>
  );
};

export default ReportPortfolioPage;
