import { fetchReport } from '@/api/report';
import { notFound, redirect } from 'next/navigation';

const Page = async () => {
  const report = await fetchReport({
    type: 'RESUME',
  });

  if (!report) {
    notFound();
  }

  redirect(`/report/landing/resume/${report.reportId}`);
};

export default Page;
