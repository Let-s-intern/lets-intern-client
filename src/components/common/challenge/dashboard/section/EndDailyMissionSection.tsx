import { useGetChallengeReviewStatus } from '@/api/challenge';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';
import DashboardCreateReviewModal from '../modal/DashboardCreateReviewModal';
import DashboardReviewModal from '../modal/DashboardReviewModal';

const EndDailyMissionSection = () => {
  const params = useParams<{ applicationId: string }>();
  const applicationId = params.applicationId;
  const { currentChallenge } = useCurrentChallenge();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: reviewStatus } = useGetChallengeReviewStatus(
    currentChallenge?.id,
  );
  const isReviewCompleted = reviewStatus && reviewStatus.reviewId !== null;

  return (
    <>
      <section className="flex flex-1 flex-col rounded-xl border border-[#E4E4E7] p-6">
        <div className="flex items-end gap-2">
          <h2 className="w-full text-center font-semibold text-[#4A495C]">
            챌린지가 종료되었습니다.
          </h2>
        </div>
        <p className="mt-2 line-clamp-6 flex-1 whitespace-pre-line text-center">
          나의 기록장에서 이전 미션들을 확인하실 수 있습니다.
        </p>
        <div className="mt-4 flex w-full items-center gap-x-3">
          <Link
            href={`/challenge/${applicationId}/${currentChallenge?.id}/me`}
            className="flex-1 rounded-sm border border-primary bg-white px-4 py-3 text-center font-medium text-primary"
          >
            이전 미션 돌아보기
          </Link>
          <button
            className="flex-1 rounded-sm bg-primary px-4 py-3 text-center font-medium text-white"
            onClick={() => setModalOpen(true)}
          >
            {isReviewCompleted
              ? '챌린지 회고 확인하기'
              : '챌린지 회고 작성하기'}
          </button>
        </div>
      </section>
      {modalOpen ? (
        isReviewCompleted ? (
          <DashboardReviewModal
            programId={currentChallenge?.id.toString() ?? ''}
            reviewId={reviewStatus?.reviewId?.toString() ?? ''}
            onClose={() => setModalOpen(false)}
          />
        ) : (
          <DashboardCreateReviewModal
            programId={currentChallenge?.id.toString() ?? ''}
            applicationId={applicationId ?? ''}
            onClose={() => setModalOpen(false)}
          />
        )
      ) : null}
    </>
  );
};

export default EndDailyMissionSection;
