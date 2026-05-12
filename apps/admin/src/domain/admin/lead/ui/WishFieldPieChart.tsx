import type { MagnetApplicationByMagnet } from '@/api/leadManagement';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo } from 'react';

import { categoryCount } from '../utils/categoryCount';

interface WishFieldPieChartProps {
  applications: MagnetApplicationByMagnet[];
}

/**
 * 마그넷 신청자의 희망 직군 분포 파이 차트.
 *
 * - `applications.length === 0`이거나 모든 값이 미입력이면 `null`을 반환한다.
 * - 상위 6개 직군까지만 표시하고 나머지는 `기타` 버킷으로 묶는다 (미입력 제외).
 * - 차트는 응답 원본 기준으로 고정되며 DataGrid 필터에 반응하지 않는다.
 */
const WishFieldPieChart = ({ applications }: WishFieldPieChartProps) => {
  const buckets = useMemo(
    () =>
      categoryCount(applications, (a) => a.wishField, {
        topN: 6,
        excludeEmpty: true,
      }),
    [applications],
  );

  if (applications.length === 0 || buckets.length === 0) return null;

  return (
    <div className="rounded border border-gray-200 p-3">
      <p className="mb-2 text-sm text-gray-700">희망 직군 분포</p>
      <PieChart
        height={180}
        sx={{ '& text': { fontSize: 10 } }}
        series={[
          {
            data: buckets.map((bucket, index) => ({
              id: index,
              value: bucket.count,
              label: bucket.label,
            })),
            innerRadius: 24,
            outerRadius: 60,
            paddingAngle: 1,
          },
        ]}
      />
    </div>
  );
};

export default WishFieldPieChart;
