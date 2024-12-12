import { useServerActiveReports } from '@/context/ActiveReports';
import { personalStatementReportDescription } from '@/data/description';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import Header from '@components/common/program/program-detail/header/Header';
import ReportBasicInfo from '@components/common/report/ReportBasicInfo';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetActiveReports } from '../../../api/report';
import ReportApplyBottomSheet from '../../../components/common/report/ReportApplyBottomSheet';
import ReportNavigation from './ReportNavigation';

const ReportPersonalStatementPage = () => {
  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/personal-statement`;
  const description = personalStatementReportDescription;
  const activeReportsFromServer = useServerActiveReports();
  const { data, isLoading } = useGetActiveReports();
  const title = getReportLandingTitle(
    data?.personalStatementInfo?.title ?? '자기소개서',
  );
  const activeReports = data || activeReportsFromServer;
  const report = activeReports?.personalStatementInfo;

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
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <div className="flex w-full flex-col items-center gap-y-12 md:gap-y-6">
          <div className="flex w-full max-w-[1000px] flex-col px-5 lg:px-0">
            <Header programTitle={title} />
            <ReportBasicInfo reportBasic={data?.personalStatementInfo} />
          </div>
          <ReportNavigation />
          {/* {Object.keys(root).length !== 0 && (
            <ReportContentContainer>
              <LexicalContent node={root} />
            </ReportContentContainer>
          )} */}
        </div>
      )}
      {report && <ReportApplyBottomSheet report={report} />}
    </>
  );
};

export default ReportPersonalStatementPage;
