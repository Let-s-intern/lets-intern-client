import type { MagnetApplicationByMagnet } from '@/api/leadManagement';
import { useMemo } from 'react';

import { marketingAgreeStat } from '../utils/marketingAgreeStat';

interface MarketingAgreeStatProps {
  applications: MagnetApplicationByMagnet[];
}

/**
 * 마그넷 신청자의 마케팅 동의율 KPI.
 *
 * - `applications.length === 0`이면 `null`을 반환한다.
 * - 통계는 응답 원본 기준으로 고정되며 DataGrid 필터에 반응하지 않는다.
 */
const MarketingAgreeStat = ({ applications }: MarketingAgreeStatProps) => {
  // strictNullChecks 미활성 환경에서 z.infer가 모든 필드를 optional로 추론하므로,
  // marketingAgreeStat 시그니처에 맞게 boolean 필드만 추려 넘긴다.
  const stat = useMemo(
    () =>
      marketingAgreeStat(
        applications.map((a) => ({ marketingAgree: a.marketingAgree ?? false })),
      ),
    [applications],
  );

  if (applications.length === 0) return null;

  return (
    <div className="rounded border border-gray-200 p-3">
      <p className="mb-1 text-sm text-gray-700">마케팅 동의율</p>
      <p className="text-2xl font-bold">{stat.percent}%</p>
      <p className="text-xs text-gray-500">
        {stat.agreed} / {stat.total}명
      </p>
    </div>
  );
};

export default MarketingAgreeStat;
