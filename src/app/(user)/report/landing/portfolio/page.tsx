import { fetchReport } from '@/api/report';
import ReportPortfolioPage from '@components/page/ReportPortfolioPage';

const Page = async () => {
  const report = await fetchReport({
    type: 'PORTFOLIO',
  });

  return <ReportPortfolioPage report={report} />;
};

export default Page;
