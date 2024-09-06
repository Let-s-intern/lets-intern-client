import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useGetActiveReports } from '../../../api/report';
import LexicalContent from '../../../components/common/blog/LexicalContent';
import ReportApplyBottomSheet from '../../../components/common/report/ReportApplyBottomSheet';
import {
  ReportHeader,
  ReportLandingIntroSection,
} from '../../../components/common/report/ReportIntroSection';
import ReportLandingHeader from '../../../components/common/report/ReportLandingHeader';

type SectionId =
  | 'section_resume'
  | 'section_personal_statement'
  | 'section_portfolio';

const sections: { id: SectionId; title: string }[] = [
  { id: 'section_resume', title: '이력서' },
  { id: 'section_personal_statement', title: '자기소개서' },
  { id: 'section_portfolio', title: '포트폴리오' },
];

const ReportResumePage = () => {
  const title = `이력서 프로그램 | 서류 진단 - 렛츠커리어`;
  const url = `${window.location.origin}/report/resume`;
  // TODO: 설명 추가
  const description = '서류 진단 프로그램입니다. ...';

  const observerRefs = useRef<(HTMLElement | null)[]>([]);

  const { data } = useGetActiveReports();

  const report = data?.resumeInfo;

  const root = JSON.parse(report?.contents || '{"root":{}}').root;

  useEffect(() => {
    console.log('data', data);
  }, [data]);

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
      <div>
        <ReportLandingHeader />

        <div className="mx-auto max-w-5xl px-5">
          <LexicalContent node={root} />
        </div>
      </div>
      {report ? <ReportApplyBottomSheet report={report} /> : null}
    </>
  );
};

export default ReportResumePage;
