import { useSubmitMission } from '@/api/attendance';
import { useGetChallengeGoal, useSubmitChallengeGoal } from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MissionSubmitButton from '../mission/MissionSubmitButton';
import MissionToast from '../mission/MissionToast';

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

  const { schedules, currentChallenge } = useCurrentChallenge();
  const { data: goalData, isLoading } = useGetChallengeGoal(programId);

  // 챌린지 종료 + 2일
  const isSubmitPeriodEnded =
    dayjs(currentChallenge?.endDate).add(2, 'day').isBefore(dayjs()) ?? true;

  const submitted = !!(goalData?.goal && goalData.goal.length > 0);

  // 챌린지 목표 제출 mutation
  const submitChallengeGoal = useSubmitChallengeGoal();
  const submitAttendance = useSubmitMission();

  const [textareaValue, setTextareaValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(submitted);
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
    setTextareaValue(goalData?.goal || '');
    // goalData가 있으면 이미 제출된 상태로 설정
    if (goalData?.goal) {
      setIsSubmitted(true);
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
