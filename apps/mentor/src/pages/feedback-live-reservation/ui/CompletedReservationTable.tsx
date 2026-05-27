import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

import type { SortDirection, SortKey } from '../hooks/useReservationFilters';
import {
  formatCreateDate,
  formatDateTimeRange,
} from '../utils/formatReservation';

interface CompletedReservationTableProps {
  rows: FeedbackMentor[];
  mentorName: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onToggleSort: (key: SortKey) => void;
  onViewDetail: (feedbackId: number) => void;
}

/** 정렬 화살표. 활성 컬럼만 방향 표기, 그 외는 양방향 힌트. */
function SortArrow({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active)
    return (
      <span aria-hidden className="text-neutral-70 ml-1">
        ↕
      </span>
    );
  return (
    <span aria-hidden className="text-primary ml-1">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

const thBase = 'text-xsmall14 text-neutral-30 px-4 py-3 text-left font-medium';
const tdBase = 'text-xsmall14 text-neutral-20 px-4 py-3 align-middle';

/**
 * 완료된 예약 테이블.
 * 컬럼: 날짜/시간 · 프로그램 · 멘토 · 멘티 · 신청 시간 · 상세.
 * 날짜/시간·멘티·신청시간은 헤더 클릭으로 정렬 토글.
 */
const CompletedReservationTable = ({
  rows,
  mentorName,
  sortKey,
  sortDirection,
  onToggleSort,
  onViewDetail,
}: CompletedReservationTableProps) => {
  return (
    <div className="border-neutral-85 overflow-x-auto rounded-lg border bg-white">
      <table className="w-full min-w-[720px] border-collapse">
        <thead className="bg-neutral-95 border-neutral-90 border-b">
          <tr>
            <th className={thBase} scope="col">
              <button
                type="button"
                className="flex items-center"
                onClick={() => onToggleSort('datetime')}
                aria-sort={
                  sortKey === 'datetime'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                날짜 / 시간
                <SortArrow
                  active={sortKey === 'datetime'}
                  direction={sortDirection}
                />
              </button>
            </th>
            <th className={thBase} scope="col">
              프로그램
            </th>
            <th className={thBase} scope="col">
              멘토
            </th>
            <th className={thBase} scope="col">
              <button
                type="button"
                className="flex items-center"
                onClick={() => onToggleSort('menteeName')}
                aria-sort={
                  sortKey === 'menteeName'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                멘티
                <SortArrow
                  active={sortKey === 'menteeName'}
                  direction={sortDirection}
                />
              </button>
            </th>
            <th className={thBase} scope="col">
              <button
                type="button"
                className="flex items-center"
                onClick={() => onToggleSort('createDate')}
                aria-sort={
                  sortKey === 'createDate'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                신청 시간
                <SortArrow
                  active={sortKey === 'createDate'}
                  direction={sortDirection}
                />
              </button>
            </th>
            <th className={thBase} scope="col">
              상세
            </th>
          </tr>
        </thead>
        <tbody className="divide-neutral-90 divide-y">
          {rows.map((row) => (
            <tr key={row.feedbackId}>
              <td className={tdBase}>
                {formatDateTimeRange(row.startDate, row.endDate)}
              </td>
              <td className={tdBase}>{row.programTitle}</td>
              <td className={tdBase}>{mentorName}</td>
              <td className={tdBase}>{row.menteeName}</td>
              <td className={tdBase}>{formatCreateDate(row.createDate)}</td>
              <td className={tdBase}>
                <button
                  type="button"
                  className="text-primary text-xsmall14 font-medium hover:underline"
                  onClick={() => onViewDetail(row.feedbackId)}
                >
                  보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedReservationTable;
