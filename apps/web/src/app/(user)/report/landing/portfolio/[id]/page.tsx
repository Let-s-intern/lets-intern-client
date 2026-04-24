import { fetchReport } from '@/api/report';
import { portfolioReportDescription } from '@/data/description';
import ReportPortfolioPage from '@/domain/report/ReportPortfolioPage';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import { Metadata } from 'next';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.coerce.number(),
});

// SSR 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = paramsSchema.parse(await params);
  const report = await fetchReport({
    type: 'PORTFOLIO',
    id,
  });

  const url = getBaseUrlFromServer() + `/report/landing/portfolio/${id}`;
  const title = getReportLandingTitle(
    report?.title ?? '포트폴리오 피드백 REPORT',
  );

  return {
    title,
    description: portfolioReportDescription,
    openGraph: {
      title,
      description: portfolioReportDescription,
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

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = paramsSchema.parse(await params);

  const report = await fetchReport({
    type: 'PORTFOLIO',
    id,
  });

  return <ReportPortfolioPage report={report} />;
};

export default Page;
