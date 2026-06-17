import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import { twMerge } from '@/lib/twMerge';
import {
  formatApplyDateTime,
  formatReservationDateTime,
} from '../../utils/format';
import {
  resolveAdminVoLiveSpec,
  resolveRowTone,
  type LiveBadge,
  type RowTone,
} from '../../utils/liveFeedbackSpec';
import type { SortKey, SortState } from '../utils/sortReservations';

/**
 * 행 배경 톤 → Tailwind 클래스 (기획 2026-06-09).
 * 진행 중=브랜드 강조 / 진행 예정=흰색 / 둘 다 참여=초록 / 한쪽만 참여=빨강 / 둘 다 미참여=진한 회색.
 */
const ROW_TONE_CLASS: Record<RowTone, string> = {
  inProgress: 'bg-[#EEF0FF] font-medium',
  green: 'bg-green-50',
  red: 'bg-red-50',
  gray: 'bg-neutral-90',
  none: '',
};

interface ReservationListViewProps {
  reservations: FeedbackAdminVo[];
  sort: SortState;
  onToggleSort: (key: SortKey) => void;
  onView: (feedbackId: number) => void;
  /** 예약 변경 모달 열기 */
  onReschedule: (feedback: FeedbackAdminVo) => void;
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

/** 진리표 뱃지(색·테두리 없는 글자만) 또는 '-'. */
function StatusBadge({ badge }: { badge: LiveBadge | null }) {
  if (!badge) return <span className="text-neutral-40">-</span>;
  return <span>{badge.label}</span>;
}

export default function ReservationListView({
  reservations,
  sort,
  onToggleSort,
  onView,
  onReschedule,
  isLoading,
  emptyMessage = '예약 내역이 없습니다.',
}: ReservationListViewProps) {
  // 진행일시 분기 기준 시각. 목록 렌더 1회 기준으로 고정한다.
  const now = new Date();

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
            <th className={twMerge(thClassName, 'text-center')}>멘토 출석</th>
            <th className={twMerge(thClassName, 'text-center')}>멘티 출석</th>
            <th className={twMerge(thClassName, 'text-center')}>멘토 뱃지</th>
            <th className={twMerge(thClassName, 'text-center')}>멘티 뱃지</th>
            <th className={twMerge(thClassName, 'text-center')}>
              <SortHeader
                label="신청 시간"
                active={sort.key === 'createDate'}
                direction={sort.direction}
                onClick={() => onToggleSort('createDate')}
              />
            </th>
            <th className={twMerge(thClassName, 'text-center')}>상세</th>
            <th className={twMerge(thClassName, 'text-center')}>예약 변경</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((item) => {
            const spec = resolveAdminVoLiveSpec(item, now);
            // 멘토·멘티 진행 상태 조합으로 행 배경색을 구분한다.
            const rowToneClassName = ROW_TONE_CLASS[resolveRowTone(spec)];
            return (
              <tr
                key={item.feedbackId}
                className={twMerge(
                  'border-neutral-80 border-b last:border-b-0',
                  rowToneClassName,
                )}
              >
                <td className={tdClassName}>
                  {formatReservationDateTime(item.startDate, item.endDate)}
                </td>
                <td className={twMerge(tdClassName, 'max-w-[260px] truncate')}>
                  {item.programTitle || '-'}
                </td>
                <td className={twMerge(tdClassName, 'text-center')}>
                  {item.mentorName}
                </td>
                <td className={twMerge(tdClassName, 'text-center')}>
                  {item.menteeName}
                </td>
                <td className={twMerge(tdClassName, 'text-center')}>
                  {spec.mentorAttendance}
                </td>
                <td className={twMerge(tdClassName, 'text-center')}>
                  {spec.menteeAttendance}
                </td>
                <td className={twMerge(tdClassName, 'text-center')}>
                  <StatusBadge badge={spec.mentorBadge} />
                </td>
                <td className={twMerge(tdClassName, 'text-center')}>
                  <StatusBadge badge={spec.menteeBadge} />
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
                    onClick={() => onReschedule(item)}
                    className="text-blue-600 hover:underline"
                  >
                    예약 변경
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
