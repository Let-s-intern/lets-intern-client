import type { MagnetApplicationByMagnet } from '@/api/leadManagement';
import dayjs from '@/lib/dayjs';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';

import { dailyApplicationCount } from '../utils/dailyApplicationCount';
import { PIE_COLORS } from '../utils/pieColors';

const LINE_COLOR = PIE_COLORS[0];
const RECENT_WINDOW_DAYS = 30;

interface MagnetApplicationDailyChartProps {
  applications: MagnetApplicationByMagnet[];
}

/**
 * 마그넷 신청자 응답 데이터를 받아 최근 한 달(30일)의 일자별 신청자 수 라인 차트를 렌더한다.
 *
 * - `applications`가 비어 있거나 최근 한 달 내 신청 데이터가 없으면 `null`을 반환한다.
 * - 차트는 응답 원본 기준으로 고정되며 DataGrid 필터에 반응하지 않는다.
 */
const MagnetApplicationDailyChart = ({
  applications,
}: MagnetApplicationDailyChartProps) => {
  const recentApplications = useMemo(() => {
    const threshold = dayjs().subtract(RECENT_WINDOW_DAYS - 1, 'day').startOf('day');
    return applications.filter((app) => {
      if (!app.createDate) return false;
      const d = dayjs(app.createDate);
      return d.isValid() && !d.isBefore(threshold);
    });
  }, [applications]);

  const series = useMemo(
    () => dailyApplicationCount(recentApplications),
    [recentApplications],
  );

  if (recentApplications.length === 0) return null;

  const dates = series.map((point) => point.date);
  const counts = series.map((point) => point.count);

  return (
    <div className="flex h-full flex-col rounded border border-gray-200 p-3">
      <p className="mb-2 text-sm text-gray-700">
        {`일자별 신청자 수 (최근 한 달 총 ${recentApplications.length}건, ${series.length}일)`}
      </p>
      <LineChart
        height={200}
        xAxis={[{ data: dates, scaleType: 'point' }]}
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

export default MagnetApplicationDailyChart;
