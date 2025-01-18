import { fetchReport } from '@/api/report';
import ReportResumePage from '@components/page/ReportResumePage';

const Page = async () => {
  const report = await fetchReport({
    type: 'RESUME',
  });

  return <ReportResumePage report={report} />;
};

export default Page;
