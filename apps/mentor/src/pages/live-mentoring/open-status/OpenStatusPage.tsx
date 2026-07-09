import { useLiveMentoringOpenStatusQuery } from '@/api/live-mentoring/liveMentoring';
import type { OpenStatusRow } from '@/api/live-mentoring/liveMentoringSchema';
import { CATEGORY_LABELS, durationLabel, formatPrice } from '../constants';

const STATUS_LABEL: Record<OpenStatusRow['status'], string> = {
  OPEN: '오픈중',
  CLOSED: '마감',
};

const STATUS_CLASS: Record<OpenStatusRow['status'], string> = {
  OPEN: 'bg-primary-10 text-primary',
  CLOSED: 'bg-gray-100 text-gray-500',
};

const headerCellClass = 'px-4 py-3 text-left text-xs font-medium text-gray-500';
const bodyCellClass = 'px-4 py-3 text-sm text-gray-700';

const OpenStatusPage = () => {
  const { data, isLoading } = useLiveMentoringOpenStatusQuery();

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          오픈 현황
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          내가 오픈한 1대1 라이브 멘토링의 상태와 예약 수를 확인하세요.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full min-w-[560px]">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={headerCellClass}>카테고리</th>
              <th className={headerCellClass}>진행시간</th>
              <th className={headerCellClass}>피드백 기간</th>
              <th className={headerCellClass}>가격</th>
              <th className={headerCellClass}>상태</th>
              <th className={headerCellClass}>예약 수</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  오픈한 멘토링이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={`${row.categories.join()}-${index}`}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className={bodyCellClass}>
                    {row.categories.map((c) => CATEGORY_LABELS[c]).join(' · ')}
                  </td>
                  <td className={bodyCellClass}>
                    {row.durations.map(durationLabel).join('·')}
                  </td>
                  <td className={bodyCellClass}>
                    {row.feedbackStartDate.slice(5)} ~{' '}
                    {row.feedbackEndDate.slice(5)}
                  </td>
                  <td className={bodyCellClass}>
                    {row.durations.length > 1 ? '최저 ' : ''}
                    {formatPrice(row.price)}
                  </td>
                  <td className={bodyCellClass}>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[row.status]}`}
                    >
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  <td className={bodyCellClass}>{row.reservationCount}건</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenStatusPage;
