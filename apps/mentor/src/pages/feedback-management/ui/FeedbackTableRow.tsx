import { STATUS_BADGE } from '@/constants/statusColors';
import type { FeedbackRow } from '../types';

const COLUMN_WIDTHS = [
  'w-12', // 구분
  'w-24', // 피드백 상태
  'w-24', // 멘티 예약
  'w-24', // 멘티 제출
  'w-16', // 멘티
  'w-16', // 멘토
  'min-w-[200px]', // 챌린지
  'w-20', // 미션 회차
  'min-w-[180px]', // 피드백 일정
  'w-24', // 멘티 성명
  'w-16', // 상세
] as const;

interface FeedbackTableRowProps {
  row: FeedbackRow;
  onClickDetail: (row: FeedbackRow) => void;
}

/**
 * 11컬럼 통합 표의 한 행. 분기 렌더(서면/라이브)는 별도 컴포넌트로 분리하지 않고
 * `row.type`별 컬럼 값이 selector(`useMergedFeedbackRows`)에서 이미 비워져 있으므로 단일 렌더.
 *
 * 빈 컬럼은 `·` (중점) 으로 표시한다.
 */
const FeedbackTableRow = ({ row, onClickDetail }: FeedbackTableRowProps) => {
  return (
    <tr className="border-b border-gray-100 text-sm text-neutral-700 hover:bg-gray-50">
      <td className={`${COLUMN_WIDTHS[0]} px-3 py-3 text-center`}>
        <RowKindIcon type={row.type} />
      </td>
      <td className={`${COLUMN_WIDTHS[1]} px-3 py-3`}>
        <StatusCell label={row.statusLabel} tone={row.statusTone} />
      </td>
      <td className={`${COLUMN_WIDTHS[2]} px-3 py-3`}>
        <ReservationCell label={row.reservationLabel} />
      </td>
      <td className={`${COLUMN_WIDTHS[3]} px-3 py-3`}>
        <SubmissionCell label={row.submissionLabel} />
      </td>
      <td className={`${COLUMN_WIDTHS[4]} px-3 py-3`}>
        <ParticipationCell label={row.menteeParticipation} />
      </td>
      <td className={`${COLUMN_WIDTHS[5]} px-3 py-3`}>
        <ParticipationCell label={row.mentorParticipation} />
      </td>
      <td className={`${COLUMN_WIDTHS[6]} px-3 py-3 text-neutral-800`}>
        {row.challengeTitle}
      </td>
      <td className={`${COLUMN_WIDTHS[7]} px-3 py-3 text-neutral-600`}>
        {row.thLabel}
      </td>
      <td
        className={`${COLUMN_WIDTHS[8]} whitespace-nowrap px-3 py-3 text-neutral-600`}
      >
        {row.scheduleLabel}
      </td>
      <td className={`${COLUMN_WIDTHS[9]} px-3 py-3 text-neutral-800`}>
        {row.menteeNameLabel}
      </td>
      <td className={`${COLUMN_WIDTHS[10]} px-3 py-3 text-center`}>
        {row.canOpenDetail ? (
          <button
            type="button"
            onClick={() => onClickDetail(row)}
            className="text-primary text-sm font-medium underline-offset-2 hover:underline"
          >
            보기
          </button>
        ) : (
          <span className="text-xs text-gray-300">-</span>
        )}
      </td>
    </tr>
  );
};

export default FeedbackTableRow;

// ─────────────────────────────────────────────────────────────────
// Cell components
// ─────────────────────────────────────────────────────────────────

/** 서면 / 라이브 구분 아이콘 */
const RowKindIcon = ({ type }: { type: FeedbackRow['type'] }) => {
  if (type === 'written') {
    return (
      <span
        aria-label="서면 피드백"
        role="img"
        className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-gray-500"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M3.5 1.5h6L12.5 4.5v10h-9v-13z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M5 6.5h6M5 9h6M5 11.5h3.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span
      aria-label="라이브 피드백"
      role="img"
      className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-gray-500"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect
          x="1.5"
          y="2.5"
          width="13"
          height="11"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path d="M7 6.5l3 1.5-3 1.5v-3z" fill="currentColor" />
      </svg>
    </span>
  );
};

const StatusCell = ({
  label,
  tone,
}: {
  label: string | null;
  tone: FeedbackRow['statusTone'];
}) => {
  if (!label || !tone) return <EmptyCell />;
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[tone]}`}
    >
      {label}
    </span>
  );
};

const ReservationCell = ({
  label,
}: {
  label: '예약 전' | '예약 완료' | null;
}) => {
  if (!label) return <EmptyCell />;
  const isReserved = label === '예약 완료';
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isReserved ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-neutral-700">{label}</span>
    </span>
  );
};

const SubmissionCell = ({ label }: { label: '제출' | '미제출' | null }) => {
  if (!label) return <EmptyCell />;
  const isSubmitted = label === '제출';
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isSubmitted ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-neutral-700">{label}</span>
    </span>
  );
};

const ParticipationCell = ({ label }: { label: '참여' | '불참' | null }) => {
  if (!label) return <EmptyCell />;
  const isAttended = label === '참여';
  return (
    <span
      className={
        isAttended
          ? 'text-xs font-medium text-neutral-600'
          : 'text-xs font-medium text-red-500'
      }
    >
      {label}
    </span>
  );
};

const EmptyCell = () => <span className="text-xs text-gray-300">·</span>;
