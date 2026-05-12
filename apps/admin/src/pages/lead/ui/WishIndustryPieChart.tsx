import type { MagnetApplicationByMagnet } from '@/api/leadManagement';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo } from 'react';

import { categoryCount } from '../utils/categoryCount';
import { PIE_COLORS } from '../utils/pieColors';

interface WishIndustryPieChartProps {
  applications: MagnetApplicationByMagnet[];
}

/**
 * 마그넷 신청자의 희망 산업 분포 파이 차트.
 *
 * - `applications.length === 0`이거나 모든 값이 미입력이면 `null`을 반환한다.
 * - 상위 6개 산업까지만 표시하고 나머지는 `기타` 버킷으로 묶는다 (미입력 제외).
 * - 차트 내부 범례는 숨기고 카드 하단에 자체 범례를 렌더한다.
 * - 차트는 응답 원본 기준으로 고정되며 DataGrid 필터에 반응하지 않는다.
 */
const WishIndustryPieChart = ({ applications }: WishIndustryPieChartProps) => {
  const buckets = useMemo(
    () =>
      categoryCount(applications, (a) => a.wishIndustry, {
        excludeEmpty: true,
        splitDelimiter: /\s*,\s*/,
      }),
    [applications],
  );

  const pieData = useMemo(
    () =>
      buckets.map((bucket, index) => ({
        id: index,
        value: bucket.count,
        label: bucket.label,
        color: PIE_COLORS[index % PIE_COLORS.length],
      })),
    [buckets],
  );

  if (applications.length === 0 || buckets.length === 0) return null;

  return (
    <div className="flex h-full flex-col rounded border border-gray-200 p-3">
      <p className="mb-2 text-sm text-gray-700">희망 산업 분포</p>
      <PieChart
        height={150}
        slotProps={{ legend: { hidden: true } }}
        series={[
          {
            data: pieData,
            innerRadius: 24,
            outerRadius: 60,
            paddingAngle: 1,
          },
        ]}
      />
      <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-gray-700">
        {buckets.map((bucket, index) => (
          <li key={bucket.label} className="flex items-center gap-1 truncate">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-sm"
              style={{
                backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
              }}
            />
            <span className="truncate">{bucket.label}</span>
            <span className="text-gray-400">({bucket.count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WishIndustryPieChart;
