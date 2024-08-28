import {
  useGetMyReportFeedbacks,
  useGetMyReports,
  useGetReportApplicationOptionsForAdmin,
  useGetReportApplicationsForAdmin,
  useGetReportDetail,
  useGetReportDetailForAdmin,
  useGetReportPriceDetail,
  useGetReportsForAdmin,
} from '../../../api/report';

const AdminReportPage = () => {
  const { data: getMyReports } = useGetMyReports();
  const { data: getMyReportFeedbacks } = useGetMyReportFeedbacks();
  const { data: getReportApplicationOptionsForAdmin } =
    useGetReportApplicationOptionsForAdmin();
  const { data: getReportApplicationsForAdmin } =
    useGetReportApplicationsForAdmin({ pageable: { page: 1, size: 10 } });
  const { data: getReportDetail } = useGetReportDetail(12);
  const { data: getReportDetailForAdmin } = useGetReportDetailForAdmin(12);
  const { data: getReportPriceDetail } = useGetReportPriceDetail(12);
  const { data: getReportsForAdmin } = useGetReportsForAdmin();

  return (
    <div>
      <h1>ReportPage</h1>
      <h2>GetMyReports</h2>
      <pre>{JSON.stringify(getMyReports, null, 2)}</pre>

      <h2>GetMyReportFeedbacks</h2>
      <pre>{JSON.stringify(getMyReportFeedbacks, null, 2)}</pre>

      <h2>GetReportApplicationOptionsForAdmin</h2>
      <pre>{JSON.stringify(getReportApplicationOptionsForAdmin, null, 2)}</pre>

      <h2>GetReportApplicationsForAdmin</h2>
      <pre>{JSON.stringify(getReportApplicationsForAdmin, null, 2)}</pre>

      <h2>GetReportDetail</h2>
      <pre>{JSON.stringify(getReportDetail, null, 2)}</pre>

      <h2>GetReportDetailForAdmin</h2>
      <pre>{JSON.stringify(getReportDetailForAdmin, null, 2)}</pre>

      <h2>GetReportPriceDetail</h2>
      <pre>{JSON.stringify(getReportPriceDetail, null, 2)}</pre>

      <h2>GetReportsForAdmin</h2>
      <pre>{JSON.stringify(getReportsForAdmin, null, 2)}</pre>
    </div>
  );
};

export default AdminReportPage;
