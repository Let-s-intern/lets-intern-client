import { useSubmitMission } from '@/api/attendance';
import {
  ChallengeMissionQueryKey,
  useGetChallengeGoal,
  useSubmitChallengeGoal,
} from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import MissionSubmitButton from '@/domain/challenge/my-challenge/mission/MissionSubmitButton';
import MissionToast from '@/domain/challenge/my-challenge/mission/MissionToast';
import dayjs from '@/lib/dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**  최초 입장을 판별하기 위한 아무값
 * 0회차에서 목표를 사용자가 입력하기 때문에
 * 목표가 visit이면 입력하지 않은 것으로 판단해야 한다.
 */
export const DASHBOARD_FIRST_VISIT_GOAL = 'visit';

interface MissionSubmitZeroSectionProps {
  className?: string;
  missionId?: number; // 0회차 미션 ID
}

const MissionSubmitZeroSection = ({
  className,
  missionId,
}: MissionSubmitZeroSectionProps) => {
  const params = useParams<{ programId: string }>();
  const programId = params.programId;
  const queryClient = useQueryClient();

  const { currentChallenge, refetchSchedules } = useCurrentChallenge();
  const { data: goalData, isLoading } = useGetChallengeGoal(programId);

  // 챌린지 종료 + 2일
  const isSubmitPeriodEnded =
    dayjs(currentChallenge?.endDate).add(2, 'day').isBefore(dayjs()) ?? true;

  // 챌린지 목표 제출 mutation
  const submitChallengeGoal = useSubmitChallengeGoal();
  const submitAttendance = useSubmitMission();

  const [textareaValue, setTextareaValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (isSubmitted || !programId || !missionId) {
      setIsSubmitted(false);
    } else {
      try {
        await Promise.all([
          submitChallengeGoal.mutateAsync({
            challengeId: programId,
            goal: textareaValue,
          }),
          // 단순 출석 체크용
          submitAttendance.mutateAsync({
            missionId,
            link: 'https://example.com',
            review: textareaValue,
          }),
        ]);
        await Promise.all([
          refetchSchedules?.(),
          // 모든 미션 정보 invalidate
          queryClient.invalidateQueries({
            queryKey: [ChallengeMissionQueryKey],
          }),
        ]);
        setIsSubmitted(true);
        setShowToast(true);
      } catch (error) {
        console.error('제출 실패:', error);
      }
    }
  };

  useEffect(() => {
    /** 상태 초기화 */
    if (isLoading) return;

    const isFirstVisit = goalData?.goal === DASHBOARD_FIRST_VISIT_GOAL;
    setTextareaValue(isFirstVisit ? '' : goalData?.goal || '');
    // goalData가 있으면 이미 제출된 상태로 설정
    if (!isFirstVisit && goalData?.goal) {
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
    }
  }, [goalData, isLoading]);

  return (
    <section className={clsx('', className)}>
      <h2 className="mb-6 text-small18 font-bold text-neutral-0">
        미션 제출하기
      </h2>
      <div className="mb-1.5">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            챌린지 참여 목표
          </span>
        </div>
        <div className="rounded bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
          미션 제출 후, 작성한 챌린지 목표를 카카오톡 오픈채팅방에 공유해주세요.
        </div>
      </div>
      <textarea
        className={clsx(
          'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
          'p-3 text-xsmall14 text-neutral-0 placeholder:text-neutral-50 md:text-base',
          'min-h-[120px] outline-none focus:border-primary',
          'disabled:bg-neutral-100 disabled:text-neutral-50',
        )}
        placeholder={
          '챌린지를 신청한 목적과 계기,\n또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요.'
        }
        value={textareaValue}
        onChange={handleTextareaChange}
        disabled={isSubmitted}
      />

      {!isSubmitPeriodEnded && (
        <MissionSubmitButton
          isSubmitted={isSubmitted}
          hasContent={textareaValue.trim().length > 0}
          onButtonClick={handleSubmit}
          disabled={isSubmitted}
        />
      )}

      <MissionToast isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
};

export default MissionSubmitZeroSection;
