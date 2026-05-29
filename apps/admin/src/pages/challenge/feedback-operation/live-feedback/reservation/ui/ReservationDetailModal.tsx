import type {
  FeedbackAttendanceStatus,
  FeedbackDetailAdminVo,
} from '@/api/feedback/feedbackSchema';
import { useAdminFeedbackDetailQuery } from '@/api/feedback/feedback';
import { twMerge } from '@/lib/twMerge';
import { formatReservationDateTime } from '../../utils/format';

interface ReservationDetailModalProps {
  /** 선택된 예약 id. null 이면 모달을 렌더하지 않는다(닫힘). */
  feedbackId: number | null;
  onClose: () => void;
}

const ATTENDANCE_LABEL: Record<FeedbackAttendanceStatus, string> = {
  PENDING: '대기',
  PRESENT: '참석',
  ABSENT: '불참',
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xxsmall12 text-neutral-40">{label}</dt>
      <dd className="text-xsmall14 text-neutral-0 break-words">
        {value || '-'}
      </dd>
    </div>
  );
}

function DetailBody({ detail }: { detail: FeedbackDetailAdminVo }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Field label="프로그램" value={detail.programTitle} />
      </div>
      <div className="md:col-span-2">
        <Field
          label="일시"
          value={formatReservationDateTime(detail.startDate, detail.endDate)}
        />
      </div>

      <Field label="멘토" value={detail.mentorName} />
      <Field label="멘토 이메일" value={detail.mentorEmail} />

      <Field label="멘티" value={detail.menteeName} />
      <Field label="멘티 이메일" value={detail.menteeEmail} />
      <Field label="멘티 연락처" value={detail.menteePhoneNum} />

      <Field
        label="멘토 출석"
        value={ATTENDANCE_LABEL[detail.mentorStatus]}
      />
      <Field
        label="멘티 출석"
        value={ATTENDANCE_LABEL[detail.menteeStatus]}
      />

      <div className="md:col-span-2">
        <Field
          label="미팅 URL"
          value={
            detail.meetingUrl ? (
              <a
                href={detail.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {detail.meetingUrl}
              </a>
            ) : (
              '-'
            )
          }
        />
      </div>

      <div className="md:col-span-2">
        <Field label="사전 질문" value={detail.preQuestion} />
      </div>
    </dl>
  );
}

export default function ReservationDetailModal({
  feedbackId,
  onClose,
}: ReservationDetailModalProps) {
  const { data: detail, isLoading } = useAdminFeedbackDetailQuery(
    feedbackId ?? undefined,
  );

  if (feedbackId == null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="예약 상세"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={twMerge(
          'relative z-10 flex max-h-[85dvh] w-full max-w-2xl flex-col',
          'overflow-hidden rounded-lg bg-white shadow-lg',
        )}
      >
        <div className="border-neutral-80 flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-medium16 text-neutral-0 font-semibold">
            예약 상세
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-neutral-40 hover:text-neutral-0 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {isLoading || !detail ? (
            <div className="text-xsmall14 text-neutral-40 py-12 text-center">
              불러오는 중...
            </div>
          ) : (
            <DetailBody detail={detail} />
          )}
        </div>
      </div>
    </div>
  );
}
