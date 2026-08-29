import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import { APPLICATION_STATUS_LABELS } from '@/domain/live-mentoring/constants';
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
import {
  RESERVATION_KIND_LABEL,
  rowCreateDate,
  rowKey,
  rowMenteeName,
  rowMentorName,
  rowProgramTitle,
  type ReservationRow,
} from '../utils/reservationRow';
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

/**
 * 1대1에 존재하지 않는 값을 채우는 문구.
 *
 * 빈 칸으로 두면 "없음"이 아니라 "조회가 빠졌다"로 읽힌다. 출석·뱃지는
 * 챌린지 라이브 피드백에만 있는 개념이라 1대1 행에서는 이 말로 채운다.
 * 예약 변경은 이제 1대1에도 있지만, 결제 완료건이 아니거나 슬롯이 없으면
 * (아직 확정되지 않은 신청) 같은 이유로 이 문구를 쓴다.
 */
const NOT_APPLICABLE = '해당 없음';

interface ReservationListViewProps {
  reservations: ReservationRow[];
  sort: SortState;
  onToggleSort: (key: SortKey) => void;
  onView: (row: ReservationRow) => void;
  /** 예약 변경 모달 열기 — 챌린지 라이브 피드백. */
  onReschedule: (feedback: FeedbackAdminVo) => void;
  /** 예약 변경 모달 열기 — 1대1 라이브 멘토링. */
  onLiveMentoringReschedule: (
    reservation: AdminLiveMentoringReservation,
  ) => void;
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

/** 1대1에 없는 값. 빈 칸과 구별되도록 흐린 글자로 명시한다. */
function NotApplicableCell() {
  return <span className="text-neutral-40">{NOT_APPLICABLE}</span>;
}

/** 챌린지 라이브 피드백 한 행. 출석·뱃지·예약 변경이 모두 있다. */
function ChallengeRow({
  feedback,
  now,
  onView,
  onReschedule,
}: {
  feedback: FeedbackAdminVo;
  now: Date;
  onView: () => void;
  onReschedule: () => void;
}) {
  const spec = resolveAdminVoLiveSpec(feedback, now);
  // 멘토·멘티 진행 상태 조합으로 행 배경색을 구분한다.
  const rowToneClassName = ROW_TONE_CLASS[resolveRowTone(spec)];

  return (
    <tr
      className={twMerge(
        'border-neutral-80 border-b last:border-b-0',
        rowToneClassName,
      )}
    >
      <td className={tdClassName}>
        {formatReservationDateTime(feedback.startDate, feedback.endDate)}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        {RESERVATION_KIND_LABEL.CHALLENGE}
      </td>
      <td className={twMerge(tdClassName, 'max-w-[260px] truncate')}>
        {feedback.programTitle || '-'}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        {feedback.mentorName}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        {feedback.menteeName}
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
        {formatApplyDateTime(feedback.createDate)}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        <button
          type="button"
          onClick={onView}
          className="text-blue-600 hover:underline"
        >
          보기
        </button>
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        <button
          type="button"
          onClick={onReschedule}
          className="text-blue-600 hover:underline"
        >
          예약 변경
        </button>
      </td>
    </tr>
  );
}

/**
 * 1대1 라이브 멘토링 한 행.
 *
 * 출석·뱃지는 서버가 기록하지 않아 그 자리를 `해당 없음` 으로 채운다. 예약 변경은
 * 결제 완료(CONFIRMED)건이고 슬롯을 점유하고 있을 때만 연다 — 그 밖의 상태는
 * 옮길 일정 자체가 없다.
 */
function LiveMentoringRow({
  row,
  onView,
  onReschedule,
}: {
  row: Extract<ReservationRow, { kind: 'LIVE_MENTORING' }>;
  onView: () => void;
  onReschedule: () => void;
}) {
  const { reservation } = row;
  const hasSlot =
    reservation.reservationStartAt != null &&
    reservation.reservationEndAt != null;
  const canReschedule = hasSlot && reservation.status === 'CONFIRMED';

  return (
    <tr className="border-neutral-80 border-b last:border-b-0">
      <td className={tdClassName}>
        {hasSlot ? (
          formatReservationDateTime(
            reservation.reservationStartAt as string,
            reservation.reservationEndAt as string,
          )
        ) : (
          // 결제 대기 중이거나 선점이 만료돼 슬롯을 반납한 신청이다.
          <span className="text-neutral-40">예약 슬롯 없음</span>
        )}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        <div className="flex flex-col gap-0.5">
          <span>{RESERVATION_KIND_LABEL.LIVE_MENTORING}</span>
          <span className="text-xxsmall12 text-neutral-40">
            {APPLICATION_STATUS_LABELS[reservation.status]}
            {reservation.durationMinutes != null &&
              ` · ${reservation.durationMinutes}분`}
          </span>
        </div>
      </td>
      <td className={twMerge(tdClassName, 'max-w-[260px] truncate')}>
        {rowProgramTitle(row)}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        {rowMentorName(row)}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        {rowMenteeName(row)}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        <NotApplicableCell />
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        <NotApplicableCell />
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        <NotApplicableCell />
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        <NotApplicableCell />
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        {formatApplyDateTime(rowCreateDate(row))}
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        <button
          type="button"
          onClick={onView}
          className="text-blue-600 hover:underline"
        >
          보기
        </button>
      </td>
      <td className={twMerge(tdClassName, 'text-center')}>
        {canReschedule ? (
          <button
            type="button"
            onClick={onReschedule}
            className="text-blue-600 hover:underline"
          >
            예약 변경
          </button>
        ) : (
          <NotApplicableCell />
        )}
      </td>
    </tr>
  );
}

export default function ReservationListView({
  reservations,
  sort,
  onToggleSort,
  onView,
  onReschedule,
  onLiveMentoringReschedule,
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
            <th className={twMerge(thClassName, 'text-center')}>유형</th>
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
          {reservations.map((row) =>
            row.kind === 'CHALLENGE' ? (
              <ChallengeRow
                key={rowKey(row)}
                feedback={row.feedback}
                now={now}
                onView={() => onView(row)}
                onReschedule={() => onReschedule(row.feedback)}
              />
            ) : (
              <LiveMentoringRow
                key={rowKey(row)}
                row={row}
                onView={() => onView(row)}
                onReschedule={() => onLiveMentoringReschedule(row.reservation)}
              />
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
