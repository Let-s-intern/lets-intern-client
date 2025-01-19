import { fetchReport } from '@/api/report';
import ReportPortfolioPage from '@components/page/ReportPortfolioPage';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.coerce.number(),
});

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = paramsSchema.parse(await params);

  const report = await fetchReport({
    type: 'PORTFOLIO',
    id,
  });

  return <ReportPortfolioPage report={report} />;
};

export default Page;
