import { fetchReport } from '@/api/report';
import ReportPersonalStatementPage from '@components/page/ReportPersonalStatementPage';

const Page = async () => {
  const report = await fetchReport({
    type: 'PERSONAL_STATEMENT',
  });

  return <ReportPersonalStatementPage report={report} />;
};

export default Page;
