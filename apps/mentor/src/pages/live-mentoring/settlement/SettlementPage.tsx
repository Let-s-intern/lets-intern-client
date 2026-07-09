import { useLiveMentoringSettlementQuery } from '@/api/live-mentoring/liveMentoring';
import type { SettlementRow } from '@/api/live-mentoring/liveMentoringSchema';
import { formatPrice } from '../constants';

const STATUS_LABEL: Record<SettlementRow['status'], string> = {
  PENDING: '정산 예정',
  PAID: '정산 완료',
};

const STATUS_CLASS: Record<SettlementRow['status'], string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PAID: 'bg-primary-10 text-primary',
};

const headerCellClass = 'px-4 py-3 text-left text-xs font-medium text-gray-500';
const bodyCellClass = 'px-4 py-3 text-sm text-gray-700';

const SettlementPage = () => {
  const { data, isLoading } = useLiveMentoringSettlementQuery();

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          정산 현황
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          1대1 라이브 멘토링 완료 건에 대한 정산 내역을 확인하세요.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full min-w-[520px]">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={headerCellClass}>정산 기간</th>
              <th className={headerCellClass}>완료 건수</th>
              <th className={headerCellClass}>정산 금액</th>
              <th className={headerCellClass}>상태</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  정산 내역이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.period}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className={bodyCellClass}>{row.period}</td>
                  <td className={bodyCellClass}>{row.completedCount}건</td>
                  <td className={bodyCellClass}>
                    {formatPrice(row.grossAmount)}
                  </td>
                  <td className={bodyCellClass}>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[row.status]}`}
                    >
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettlementPage;
