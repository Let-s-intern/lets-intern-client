import { useServerActiveReports } from '@/context/ActiveReports';
import { portfolioReportDescription } from '@/data/description';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useGetActiveReports } from '../../../api/report';
import LexicalContent from '../../../components/common/blog/LexicalContent';
import ReportApplyBottomSheet from '../../../components/common/report/ReportApplyBottomSheet';
import ReportContentContainer from '../../../components/common/report/ReportContentContainer';
import {
  ReportHeader,
  ReportLandingIntroSection,
} from '../../../components/common/report/ReportIntroSection';
import ReportLandingNav from '../../../components/common/report/ReportLandingNav';

const ReportPortfolioPage = () => {
  const title = getReportLandingTitle('포트폴리오');
  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/portfolio`;
  const description = portfolioReportDescription;
  const activeReportsFromServer = useServerActiveReports();
  const { data } = useGetActiveReports();
  const activeReports = data || activeReportsFromServer;
  const report = activeReports?.portfolioInfo;

  const root = JSON.parse(report?.contents || '{"root":{}}').root;
  const [showCtaButton, setShowCtaButton] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>();

  const { initReportApplication } = useReportApplicationStore();
  useEffect(() => {
    initReportApplication();

    if (contentRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setShowCtaButton(entry.isIntersecting);
          });
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
        ref={(element) => {
          contentRef.current = element;
          if (element) {
            const url = new URL(window.location.href);

            const from = url.searchParams.get('from');
            if (!from) {
              return;
            }

            if (from === 'nav') {
              element.scrollIntoView();
            }
          }
        }}
      >
        <ReportLandingNav />

        <ReportContentContainer>
          <LexicalContent node={root} />
        </ReportContentContainer>
      </div>
      {report && showCtaButton ? (
        <ReportApplyBottomSheet report={report} />
      ) : null}
    </>
  );
};

export default ReportPortfolioPage;
