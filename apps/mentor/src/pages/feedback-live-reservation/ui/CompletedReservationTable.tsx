import { Fragment, useState } from 'react';

import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';
import { twMerge } from '@/lib/twMerge';

import type { SortDirection, SortKey } from '../hooks/useReservationFilters';
import {
  formatCreateDate,
  formatDateTimeRange,
} from '../utils/formatReservation';
import ReservationHistoryPanel from './ReservationHistoryPanel';

/** 표 컬럼 수 (예약 변경 내역 펼침 행의 colSpan 용) */
const COLUMN_COUNT = 7;

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
      <span aria-hidden className="text-neutral-60 ml-1">
        ↕
      </span>
    );
  return (
    <span aria-hidden className="text-neutral-0 ml-1">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

const thBase =
  'text-xsmall14 text-neutral-0 whitespace-nowrap px-4 py-3 font-semibold';
const tdBase = 'text-xsmall14 text-neutral-20 whitespace-nowrap px-4 py-3';

/**
 * 완료된 예약 테이블.
 * 컬럼: 날짜/시간 · 프로그램 · 멘토 · 멘티 · 신청 시간 · 상세 · 예약 변경 내역.
 * 날짜/시간·멘티·신청시간은 헤더 클릭으로 정렬 토글.
 *
 * 레이아웃/정렬 헤더/펼침 행 구성은 어드민 라이브 피드백 예약관리
 * (`ReservationListView`)와 동일한 톤으로 맞춘다. 헤더 배경은 흰색(요구사항).
 */
const CompletedReservationTable = ({
  rows,
  mentorName,
  sortKey,
  sortDirection,
  onToggleSort,
  onViewDetail,
}: CompletedReservationTableProps) => {
  // 행별 "예약 변경 내역" 펼침 — 한 번에 하나만 펼친다.
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="border-neutral-85 overflow-x-auto rounded-lg border bg-white">
      <table className="w-full min-w-[840px] border-collapse">
        <thead>
          <tr className="border-neutral-60 border-b-2 bg-white">
            <th className={twMerge(thBase, 'text-left')} scope="col">
              <button
                type="button"
                className="inline-flex items-center"
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
            <th className={twMerge(thBase, 'text-left')} scope="col">
              프로그램
            </th>
            <th className={twMerge(thBase, 'text-center')} scope="col">
              멘토
            </th>
            <th className={twMerge(thBase, 'text-center')} scope="col">
              <button
                type="button"
                className="inline-flex items-center"
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
            <th className={twMerge(thBase, 'text-center')} scope="col">
              <button
                type="button"
                className="inline-flex items-center"
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
            <th className={twMerge(thBase, 'text-center')} scope="col">
              상세
            </th>
            <th className={twMerge(thBase, 'text-center')} scope="col">
              예약 변경 내역
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isExpanded = expandedId === row.feedbackId;
            return (
              <Fragment key={row.feedbackId}>
                <tr className="border-neutral-90 border-b last:border-b-0">
                  <td className={tdBase}>
                    {formatDateTimeRange(row.startDate, row.endDate)}
                  </td>
                  <td className={twMerge(tdBase, 'max-w-[260px] truncate')}>
                    {row.programTitle}
                  </td>
                  <td className={twMerge(tdBase, 'text-center')}>
                    {mentorName}
                  </td>
                  <td className={twMerge(tdBase, 'text-center')}>
                    {row.menteeName}
                  </td>
                  <td className={twMerge(tdBase, 'text-center')}>
                    {formatCreateDate(row.createDate)}
                  </td>
                  <td className={twMerge(tdBase, 'text-center')}>
                    <button
                      type="button"
                      className="text-primary text-xsmall14 font-medium hover:underline"
                      onClick={() => onViewDetail(row.feedbackId)}
                    >
                      보기
                    </button>
                  </td>
                  <td className={twMerge(tdBase, 'text-center')}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : row.feedbackId)
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
                  <tr className="border-neutral-90 border-b bg-white">
                    <td colSpan={COLUMN_COUNT} className="px-4 py-2">
                      <ReservationHistoryPanel />
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
};

export default CompletedReservationTable;
