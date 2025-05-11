import { ReportDetail, useGetActiveReports } from '@/api/report';

/**
 * 주어진 레포트 목록에서 현재 활성화된 레포트가 있는지 확인하는 함수
 *
 * 활성화 조건:
 * 1. isVisible이 true
 * 2. visibleDate가 존재
 * 3. visibleDate가 현재 시간보다 이전
 */
export const hasActiveReport = (list: ReportDetail[]): boolean => {
  return (
    list.filter(
      (item) =>
        item.isVisible === true &&
        item.visibleDate &&
        new Date(item.visibleDate) <= new Date(),
    ).length > 0
  );
};

/**
 * 각종 레포트 프로그램(이력서, 포트폴리오, 자기소개서)의 활성화 상태를 확인하는 커스텀 훅
 */
export default function useActiveReports(): {
  hasActiveResume: boolean;
  hasActivePortfolio: boolean;
  hasActivePersonalStatement: boolean;
} {
  const { data } = useGetActiveReports();

  const hasActiveResume = hasActiveReport(data?.resumeInfoList ?? []);
  const hasActivePortfolio = hasActiveReport(data?.portfolioInfoList ?? []);
  const hasActivePersonalStatement = hasActiveReport(
    data?.personalStatementInfoList ?? [],
  );

  return { hasActiveResume, hasActivePortfolio, hasActivePersonalStatement };
}
