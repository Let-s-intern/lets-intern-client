import { fetchReport } from '@/api/report';
import { personalStatementReportDescription } from '@/data/description';
import ReportPersonalStatementPage from '@/domain/report/ReportPersonalStatementPage';
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
    type: 'PERSONAL_STATEMENT',
    id,
  });

  const url =
    getBaseUrlFromServer() + `/report/landing/personal-statement/${id}`;
  const title = getReportLandingTitle(
    report?.title ?? '자기소개서 피드백 REPORT',
  );

  return {
    title,
    description: personalStatementReportDescription,
    openGraph: {
      title,
      description: personalStatementReportDescription,
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
    type: 'PERSONAL_STATEMENT',
    id,
  });

  return <ReportPersonalStatementPage report={report} />;
};

export default Page;
