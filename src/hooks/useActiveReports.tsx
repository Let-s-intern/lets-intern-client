import { ReportDetail, useGetActiveReports } from '@/api/report';

export const hasActiveReport = (list: ReportDetail[]) => {
  return (
    list.filter(
      (item) =>
        item.isVisible === true &&
        item.visibleDate &&
        new Date(item.visibleDate) <= new Date(),
    ).length > 0
  );
};

/** 활성화된 레포트 프로그램이 있는지 boolean 반환 */
export default function useActiveReports() {
  const { data } = useGetActiveReports();

  const hasActiveResume = hasActiveReport(data?.resumeInfoList ?? []);
  const hasActivePortfolio = hasActiveReport(data?.portfolioInfoList ?? []);
  const hasActivePersonalStatement = hasActiveReport(
    data?.personalStatementInfoList ?? [],
  );

  return { hasActiveResume, hasActivePortfolio, hasActivePersonalStatement };
}
