import type { MagnetApplicationByMagnet } from '@/api/leadManagement';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';

import { monthlyApplicationCount } from '../utils/monthlyApplicationCount';
import { PIE_COLORS } from '../utils/pieColors';

const LINE_COLOR = PIE_COLORS[1] ?? PIE_COLORS[0];

interface MagnetApplicationMonthlyChartProps {
  applications: MagnetApplicationByMagnet[];
}

/**
 * 마그넷 신청자 응답 데이터를 받아 월 단위 신청자 수 라인 차트를 렌더한다.
 *
 * - `applications.length === 0`이면 `null`을 반환한다.
 * - 차트는 응답 원본 기준으로 고정되며 DataGrid 필터에 반응하지 않는다.
 */
const MagnetApplicationMonthlyChart = ({
  applications,
}: MagnetApplicationMonthlyChartProps) => {
  const series = useMemo(
    () => monthlyApplicationCount(applications),
    [applications],
  );

  if (applications.length === 0 || series.length === 0) return null;

  const months = series.map((point) => point.month);
  const counts = series.map((point) => point.count);

  return (
    <div className="flex h-full flex-col rounded border border-gray-200 p-3">
      <p className="mb-2 text-sm text-gray-700">
        {`월별 신청자 수 (총 ${applications.length}건, ${series.length}개월)`}
      </p>
      <LineChart
        height={200}
        xAxis={[{ data: months, scaleType: 'point' }]}
        series={[
          {
            data: counts,
            label: '신청자 수',
            showMark: false,
            color: LINE_COLOR,
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
      />
      <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-gray-700">
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-sm"
          style={{ backgroundColor: LINE_COLOR }}
        />
        <span>신청자 수</span>
      </div>
    </div>
  );
};

export default MagnetApplicationMonthlyChart;
