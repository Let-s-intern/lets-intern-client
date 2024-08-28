import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reportApplicationsForAdminInfoType } from '../../../api/report';

const ReportFeedbackApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [modal, setModal] = useState<{
    application: reportApplicationsForAdminInfoType;
    type: 'PAYMENT_INFO' | 'SCHEDULE';
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return <div>ReportFeedbackApplicationsPage</div>;
};

export default ReportFeedbackApplicationsPage;
