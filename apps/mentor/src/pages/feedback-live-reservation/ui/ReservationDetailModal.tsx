import { useFeedbackMentorDetailQuery } from '@/api/feedback/feedback';
import BaseModal from '@/common/modal/BaseModal';

import { formatDateTimeRange } from '../utils/formatReservation';

interface ReservationDetailModalProps {
  /** 열려있을 때의 feedbackId. null이면 닫힘. */
  feedbackId: number | null;
  mentorName: string;
  onClose: () => void;
}

const EMPTY = '—';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xsmall14 text-neutral-40 font-medium">{label}</dt>
      <dd className="text-xsmall16 text-neutral-10">{value || EMPTY}</dd>
    </div>
  );
}

/**
 * 완료된 예약 "보기" 상세 모달.
 *
 * `useFeedbackMentorDetailQuery(feedbackId)`로 상세를 불러와
 * 멘티명·프로그램·일시·희망정보·사전질문을 표시한다.
 * (schedule의 캘린더 bar 기반 모달과 분리한 경량 자체 모달)
 */
const ReservationDetailModal = ({
  feedbackId,
  mentorName,
  onClose,
}: ReservationDetailModalProps) => {
  const { data, isLoading, isError } = useFeedbackMentorDetailQuery(feedbackId);

  return (
    <BaseModal
      isOpen={feedbackId !== null}
      onClose={onClose}
      isLoading={isLoading}
      className="max-w-[480px]"
    >
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-small18 text-neutral-10 font-semibold">
            예약 상세
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-40 hover:text-neutral-20 text-xsmall16"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {isError ? (
          <p className="text-xsmall14 text-neutral-40 py-8 text-center">
            상세 정보를 불러오지 못했습니다.
          </p>
        ) : data ? (
          <dl className="flex flex-col gap-4">
            <InfoRow label="멘티" value={`${data.menteeName} 멘티`} />
            <InfoRow label="멘토" value={mentorName} />
            <InfoRow label="프로그램" value={data.programTitle} />
            <InfoRow
              label="일시"
              value={formatDateTimeRange(data.startDate, data.endDate)}
            />
            <InfoRow label="희망 직무" value={data.menteeWishField ?? ''} />
            <InfoRow label="희망 산업" value={data.menteeWishIndustry ?? ''} />
            <InfoRow label="희망 기업" value={data.menteeWishCompany ?? ''} />
            <InfoRow label="사전 질문" value={data.preQuestion ?? ''} />
          </dl>
        ) : null}
      </div>
    </BaseModal>
  );
};

export default ReservationDetailModal;
