import { fetchReport } from '@/api/report';
import ReportResumePage from '@components/page/ReportResumePage';
import { notFound } from 'next/navigation';

const Page = async () => {
  const report = await fetchReport({
    type: 'RESUME',
  });

  if (!report) {
    notFound();
  }

  return <ReportResumePage report={report} />;
};

export default Page;
