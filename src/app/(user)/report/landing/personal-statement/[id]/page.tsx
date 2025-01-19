import { fetchReport } from '@/api/report';
import ReportPersonalStatementPage from '@components/page/ReportPersonalStatementPage';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.coerce.number(),
});

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = paramsSchema.parse(await params);

  const report = await fetchReport({
    type: 'PERSONAL_STATEMENT',
    id,
  });

  return <ReportPersonalStatementPage report={report} />;
};

export default Page;
