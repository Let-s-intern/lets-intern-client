import { Fragment, useState } from 'react';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import { twMerge } from '@/lib/twMerge';
import {
  formatApplyDateTime,
  formatReservationDateTime,
} from '../../utils/format';
import type { SortKey, SortState } from '../utils/sortReservations';
import ReservationHistoryPanel from './ReservationHistoryPanel';

/** 표 컬럼 수 (변경 내역 펼침 행의 colSpan 용) */
const COLUMN_COUNT = 7;

interface ReservationListViewProps {
  reservations: FeedbackAdminVo[];
  sort: SortState;
  onToggleSort: (key: SortKey) => void;
  onView: (feedbackId: number) => void;
  isLoading: boolean;
  /** 빈 목록일 때 표시할 문구. 섹션(예약 목록/예약 변경 내역)별로 다르게 줄 수 있다. */
  emptyMessage?: string;
}

const thClassName =
  'text-xsmall14 text-neutral-0 whitespace-nowrap px-4 py-3 font-semibold';
const tdClassName = 'text-xsmall14 whitespace-nowrap px-4 py-3';

function SortHeader({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: 'asc' | 'desc';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1"
    >
      {label}
      <span
        className={twMerge(
          'text-xxsmall12',
          active ? 'text-neutral-0' : 'text-neutral-60',
        )}
      >
        {active && direction === 'desc' ? '↓' : '↑'}
      </span>
    </button>
  );
}

export default function ReservationListView({
  reservations,
  sort,
  onToggleSort,
  onView,
  isLoading,
  emptyMessage = '예약 내역이 없습니다.',
}: ReservationListViewProps) {
  // 행별 "예약 변경 내역" 펼침 — 한 번에 하나만 펼친다.
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        불러오는 중...
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-neutral-60 bg-neutral-95 border-b-2">
            <th className={twMerge(thClassName, 'text-left')}>
              <SortHeader
                label="날짜 / 시간"
                active={sort.key === 'dateTime'}
                direction={sort.direction}
                onClick={() => onToggleSort('dateTime')}
              />
            </th>
            <th className={twMerge(thClassName, 'text-left')}>프로그램</th>
            <th className={twMerge(thClassName, 'text-center')}>멘토</th>
            <th className={twMerge(thClassName, 'text-center')}>
              <SortHeader
                label="멘티"
                active={sort.key === 'menteeName'}
                direction={sort.direction}
                onClick={() => onToggleSort('menteeName')}
              />
            </th>
            <th className={twMerge(thClassName, 'text-center')}>
              <SortHeader
                label="신청 시간"
                active={sort.key === 'createDate'}
                direction={sort.direction}
                onClick={() => onToggleSort('createDate')}
              />
            </th>
            <th className={twMerge(thClassName, 'text-center')}>상세</th>
            <th className={twMerge(thClassName, 'text-center')}>
              예약 변경 내역
            </th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((item) => {
            const isExpanded = expandedId === item.feedbackId;
            return (
              <Fragment key={item.feedbackId}>
                <tr className="border-neutral-80 border-b last:border-b-0">
                  <td className={tdClassName}>
                    {formatReservationDateTime(item.startDate, item.endDate)}
                  </td>
                  <td
                    className={twMerge(tdClassName, 'max-w-[260px] truncate')}
                  >
                    {item.programTitle || '-'}
                  </td>
                  <td className={twMerge(tdClassName, 'text-center')}>
                    {item.mentorName}
                  </td>
                  <td className={twMerge(tdClassName, 'text-center')}>
                    {item.menteeName}
                  </td>
                  <td className={twMerge(tdClassName, 'text-center')}>
                    {formatApplyDateTime(item.createDate)}
                  </td>
                  <td className={twMerge(tdClassName, 'text-center')}>
                    <button
                      type="button"
                      onClick={() => onView(item.feedbackId)}
                      className="text-blue-600 hover:underline"
                    >
                      보기
                    </button>
                  </td>
                  <td className={twMerge(tdClassName, 'text-center')}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : item.feedbackId)
                      }
                      aria-expanded={isExpanded}
                      className="text-neutral-40 hover:text-neutral-0 inline-flex items-center gap-1"
                    >
                      예약 변경 내역
                      <span className="text-xxsmall12">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-neutral-80 bg-neutral-95 border-b">
                    <td colSpan={COLUMN_COUNT} className="px-4 py-2">
                      <ReservationHistoryPanel feedbackId={item.feedbackId} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
