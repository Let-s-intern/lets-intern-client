import { useServerActiveReports } from '@/context/ActiveReports';
import { resumeReportDescription } from '@/data/description';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useGetActiveReports } from '../../../api/report';
import LexicalContent from '../../../components/common/blog/LexicalContent';
import ReportApplyBottomSheet from '../../../components/common/report/ReportApplyBottomSheet';
import ReportContentContainer from '../../../components/common/report/ReportContentContainer';
import {
  ReportHeader,
  ReportLandingIntroSection,
} from '../../../components/common/report/ReportIntroSection';
import ReportLandingNav from '../../../components/common/report/ReportLandingNav';

const ReportResumePage = () => {
  const location = useLocation();

  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/resume`;
  const description = resumeReportDescription;
  const activeReportsFromServer = useServerActiveReports();
  const { data } = useGetActiveReports();
  const title = getReportLandingTitle(data?.resumeInfo?.title ?? '이력서');
  const activeReports = data || activeReportsFromServer;
  const report = activeReports?.resumeInfo;

  const root = JSON.parse(report?.contents || '{"root":{}}').root;

  const { initReportApplication } = useReportApplicationStore();

  const contentRef = useRef<HTMLDivElement>(null);
  // const bottomSheetRef = useRef<HTMLDivElement | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useEffect(() => {
    initReportApplication();

    if (contentRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          // entries.forEach((entry) => {
          //   if (bottomSheetRef.current) {
          //     bottomSheetRef.current.style.display = entry.isIntersecting
          //       ? 'block'
          //       : 'none';
          //   }
          // });

          const entry = entries[0];
          if (entry) {
            setShowBottomSheet(entry.isIntersecting);
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0,
        },
      );
      observer.observe(contentRef.current);
      return () => {
        observer.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { hash } = location;

    if (hash === '#content') contentRef.current?.scrollIntoView();
  }, [contentRef.current]);

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
      <ReportLandingIntroSection header={<ReportHeader />} />
      <div
        id="content"
        ref={contentRef}
        // ref={(element) => {
        //   contentRef.current = element;
        //   if (element) {
        //     const url = new URL(window.location.href);

        //     const from = url.searchParams.get('from');
        //     if (!from) {
        //       return;
        //     }

        //     if (from === 'nav') {
        //       element.scrollIntoView();
        //     }
        //   }
        // }}
      >
        <ReportLandingNav />

        {Object.keys(root).length !== 0 && (
          <ReportContentContainer>
            <LexicalContent node={root} />
          </ReportContentContainer>
        )}
      </div>

      {report && showBottomSheet ? (
        <ReportApplyBottomSheet report={report} />
      ) : // <ReportApplyBottomSheet report={report} ref={bottomSheetRef} />
      null}
    </>
  );
};

export default ReportResumePage;
