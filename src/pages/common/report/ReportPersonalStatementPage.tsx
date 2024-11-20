import { useServerActiveReports } from '@/context/ActiveReports';
import { personalStatementReportDescription } from '@/data/description';
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

const ReportPersonalStatementPage = () => {
  const location = useLocation();

  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/personal-statement`;
  const description = personalStatementReportDescription;
  const activeReportsFromServer = useServerActiveReports();
  const { data } = useGetActiveReports();
  const title = getReportLandingTitle(
    data?.personalStatementInfo?.title ?? '자기소개서',
  );
  const activeReports = data || activeReportsFromServer;
  const report = activeReports?.personalStatementInfo;

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

export default ReportPersonalStatementPage;
