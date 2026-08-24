import { LiveFeedbackIcon, WrittenFeedbackIcon } from '@/common/icon/feedback';
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
      <td
        className={`${COLUMN_WIDTHS[7]} whitespace-nowrap px-3 py-3 text-neutral-600`}
      >
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
        <DetailCell row={row} onClickDetail={onClickDetail} />
      </td>
    </tr>
  );
};

export default FeedbackTableRow;

// ─────────────────────────────────────────────────────────────────
// Cell components
// ─────────────────────────────────────────────────────────────────

/** 서면 / 라이브 / 1대1 구분 아이콘 */
const RowKindIcon = ({ type }: { type: FeedbackRow['type'] }) => {
  if (type === 'live-mentoring') {
    // 1대1 전용 아이콘이 없다. 캘린더 카드·태그 필터와 같은 primary 점으로 맞춘다.
    return (
      <span
        aria-label="1대1 라이브 멘토링"
        role="img"
        className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white"
      >
        <span className="bg-primary h-2 w-2 rounded-full" />
      </span>
    );
  }
  if (type === 'written') {
    return (
      <span
        aria-label="서면 피드백"
        role="img"
        className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-gray-500"
      >
        <WrittenFeedbackIcon size={14} />
      </span>
    );
  }
  return (
    <span
      aria-label="라이브 피드백"
      role="img"
      className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-gray-500"
    >
      <LiveFeedbackIcon size={14} />
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
      className={`inline-block rounded-[4px] px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[tone]}`}
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

const SubmissionCell = ({
  label,
}: {
  label: FeedbackRow['submissionLabel'];
}) => {
  if (!label) return <EmptyCell />;
  // 지각 제출은 제출을 하긴 했지만 피드백 대상이 아니므로 미제출과 같은 경고색을 쓴다.
  // 일부 제출(1대1에서 질문·파일 중 하나만)은 그 사이라 주의색.
  const dotClass =
    label === '제출'
      ? 'bg-green-500'
      : label === '일부 제출'
        ? 'bg-amber-500'
        : 'bg-red-500';
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      <span className="text-neutral-700">{label}</span>
    </span>
  );
};

/**
 * 상세 컬럼.
 *
 * 열 수 있으면 `보기`, 못 여는 이유가 있으면 그 이유를 달고 잠근 버튼을 둔다.
 * `disabled` 만 걸면 고장으로 읽히므로 `준비 중` 이라는 말과 이유를 함께 붙인다.
 * (1대1 행 — 멘토가 멘티 질문·전달 파일을 볼 화면이 아직 없다.)
 */
const DetailCell = ({
  row,
  onClickDetail,
}: {
  row: FeedbackRow;
  onClickDetail: (row: FeedbackRow) => void;
}) => {
  if (row.canOpenDetail) {
    return (
      <button
        type="button"
        onClick={() => onClickDetail(row)}
        className="text-primary text-sm font-medium underline-offset-2 hover:underline"
      >
        보기
      </button>
    );
  }

  if (row.detailDisabledReason) {
    return (
      <button
        type="button"
        disabled
        title={row.detailDisabledReason}
        aria-label={`상세 준비 중 — ${row.detailDisabledReason}`}
        className="cursor-not-allowed whitespace-nowrap text-xs font-medium text-gray-400"
      >
        준비 중
      </button>
    );
  }

  return <span className="text-xs text-gray-300">-</span>;
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
