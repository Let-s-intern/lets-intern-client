import { fetchReport } from '@/api/report';
import ReportResumePage from '@components/page/ReportResumePage';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.coerce.number(),
});

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = paramsSchema.parse(await params);

  const report = await fetchReport({
    type: 'RESUME',
    id,
  });

  if (!report) {
    notFound();
  }

  return <ReportResumePage report={report} />;
};

export default Page;
