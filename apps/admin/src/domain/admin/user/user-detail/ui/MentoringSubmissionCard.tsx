import {
  APPLICATION_STATUS_LABELS,
  CATEGORY_LABELS,
  formatDateTime,
} from '@/domain/live-mentoring/constants';
import { MenteeSubmissionContent } from '@/domain/live-mentoring/ui/MenteeSubmission';
import type { UserLiveMentoringSubmission } from '@/schema';

const categoryLabel = (value?: string | null) =>
  value ? ((CATEGORY_LABELS as Record<string, string>)[value] ?? value) : '-';

const statusLabel = (value?: string | null) =>
  value
    ? ((APPLICATION_STATUS_LABELS as Record<string, string>)[value] ?? value)
    : '-';

const productLabel = (submission: UserLiveMentoringSubmission) => {
  const name = submission.productNameSnapshot ?? '-';
  return submission.durationMinutesSnapshot
    ? `${name} · ${submission.durationMinutesSnapshot}분`
    : name;
};

/**
 * 1:1 LIVE 멘토링 제출 내역 한 건. 신청 요약과 질문·첨부·공유 동의를 함께 보인다.
 * 어드민은 멘토 공유 동의와 상관없이 첨부를 본다(`MenteeSubmissionContent` 가 그렇게 그린다).
 */
const MentoringSubmissionCard = ({
  submission,
}: {
  submission: UserLiveMentoringSubmission;
}) => (
  <div className="flex flex-col gap-4">
    <dl className="grid grid-cols-[8rem_1fr] gap-y-1 text-sm">
      <dt className="text-neutral-500">멘토링 유형</dt>
      <dd>{categoryLabel(submission.mentoringCategory)}</dd>

      <dt className="text-neutral-500">상품·시간</dt>
      <dd>{productLabel(submission)}</dd>

      <dt className="text-neutral-500">연락 이메일</dt>
      <dd>{submission.contactEmail || '-'}</dd>

      <dt className="text-neutral-500">예약 일정</dt>
      <dd>
        {formatDateTime(submission.reservationStartAt ?? null)} ~{' '}
        {formatDateTime(submission.reservationEndAt ?? null)}
      </dd>

      <dt className="text-neutral-500">상태</dt>
      <dd>{statusLabel(submission.status)}</dd>
    </dl>

    <MenteeSubmissionContent value={submission} />
  </div>
);

export default MentoringSubmissionCard;
