import type { MagnetApplicationByMagnet } from '@/api/leadManagement';
import dayjs from '@/lib/dayjs';
import { useMemo } from 'react';

interface TodayApplicationCountStatProps {
  applications: MagnetApplicationByMagnet[];
}

/**
 * 마그넷 오늘(로컬 자정 기준) 신청자 수 KPI (인라인).
 *
 * - `applications.length === 0`이면 `null`을 반환한다.
 * - 외곽 카드 컨테이너는 페이지의 결합 카드가 제공한다. 본 컴포넌트는 KPI 마크업만 렌더한다.
 * - 통계는 응답 원본 기준으로 고정되며 DataGrid 필터에 반응하지 않는다.
 */
const TodayApplicationCountStat = ({
  applications,
}: TodayApplicationCountStatProps) => {
  const todayCount = useMemo(() => {
    const todayStr = dayjs().format('YYYY-MM-DD');
    return applications.reduce((acc, app) => {
      if (!app.createDate) return acc;
      const d = dayjs(app.createDate);
      if (!d.isValid()) return acc;
      return d.format('YYYY-MM-DD') === todayStr ? acc + 1 : acc;
    }, 0);
  }, [applications]);

  if (applications.length === 0) return null;

  return (
    <div>
      <p className="mb-1 text-sm text-gray-700">오늘 신청자수</p>
      <p className="text-2xl font-bold text-gray-900">{todayCount}명</p>
      <p className="text-xs text-gray-500">누적 {applications.length}명</p>
    </div>
  );
};

export default TodayApplicationCountStat;
