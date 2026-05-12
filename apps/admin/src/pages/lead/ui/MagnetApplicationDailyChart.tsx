import type { MagnetApplicationByMagnet } from '@/api/leadManagement';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';

import { dailyApplicationCount } from '../utils/dailyApplicationCount';

interface MagnetApplicationDailyChartProps {
  applications: MagnetApplicationByMagnet[];
}

/**
 * 마그넷 신청자 응답 데이터를 받아 신청자 수 누적 추이 라인 차트를 렌더한다.
 *
 * - `applications.length === 0`이면 `null`을 반환한다.
 * - 차트는 응답 원본 기준으로 고정되며 DataGrid 필터에 반응하지 않는다.
 * - 시리즈는 일자별 누적 신청자 수(단조 증가)다.
 */
const MagnetApplicationDailyChart = ({
  applications,
}: MagnetApplicationDailyChartProps) => {
  const series = useMemo(
    () => dailyApplicationCount(applications, { cumulative: true }),
    [applications],
  );

  if (applications.length === 0) return null;

  const dates = series.map((point) => point.date);
  const counts = series.map((point) => point.count);

  return (
    <div className="mb-4 rounded border border-gray-200 p-3">
      <p className="mb-2 text-sm text-gray-700">
        {`신청자 수 추이 (총 ${applications.length}건, ${series.length}일)`}
      </p>
      <LineChart
        height={200}
        xAxis={[{ data: dates, scaleType: 'point' }]}
        series={[{ data: counts, label: '신청자 수', showMark: true }]}
      />
    </div>
  );
};

export default MagnetApplicationDailyChart;
