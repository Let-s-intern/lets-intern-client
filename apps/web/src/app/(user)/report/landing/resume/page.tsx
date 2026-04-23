import { fetchReport } from '@/api/report';
import { resumeReportDescription } from '@/data/description';
import ReportResumePage from '@/domain/report/ReportResumePage';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import { Metadata } from 'next';

// SSR 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  const report = await fetchReport({
    type: 'RESUME',
  });

  const url = getBaseUrlFromServer() + `/report/landing/resume`;
  const title = getReportLandingTitle(report?.title ?? '이력서 피드백 REPORT');

  return {
    title,
    description: resumeReportDescription,
    openGraph: {
      title,
      description: resumeReportDescription,
      url,
      images: [
        {
          url: 'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/banner/popup/%E1%84%85%E1%85%A6%E1%86%BA%E1%84%8E%E1%85%B3%E1%84%8F%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A5%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%20og_image%201200_630.png',
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const dynamic = 'force-dynamic';

const Page = async () => {
  const report = await fetchReport({
    type: 'RESUME',
  });

  return <ReportResumePage report={report} />;
};

export default Page;
