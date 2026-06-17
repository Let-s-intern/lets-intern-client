import {
  useGetChallengeGoal,
  usePatchChallengeGoal,
  usePostChallengeAttendance,
} from '@/api/challenge/challenge';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  missionId: number;
}

const OtMissionInputSection = ({ missionId }: Props) => {
  const params = useParams<{ programId: string }>();

  const { data: goalData, isLoading } = useGetChallengeGoal(params.programId);
  const patchGoal = usePatchChallengeGoal();
  const postAttendance = usePostChallengeAttendance();

  const [goal, setGoal] = useState('');

  const submitted = !!(goalData?.goal && goalData.goal.length > 0);

  const handleClickSubmit = async () => {
    if (!params.programId) {
      console.error('프로그램 id 없음');
      return;
    }

    await Promise.all([
      patchGoal.mutateAsync({ challengeId: params.programId, goal }),
      postAttendance.mutateAsync({ missionId }),
    ]);
  };

  useEffect(() => {
    if (isLoading) return;
    setGoal(goalData?.goal ?? '');
  }, [goalData, isLoading]);

  return (
    <>
      <div className="mt-6 flex w-full flex-col gap-y-5">
        <h3 className="text-xsmall16 text-neutral-0 font-semibold">
          챌린지 참여 목표
        </h3>
        <p className="text-xsmall14 text-neutral-10">
          미션 제출 후, 작성한 챌린지 목표를 카카오톡 오픈채팅방에 공유해주세요.
        </p>
        <textarea
          className={clsx(
            'goalTextarea',
            'text-xsmall14 disabled:bg-neutral-95 h-[120px] w-full resize-none rounded-md p-3 outline-none',
          )}
          placeholder="챌린지를 신청한 목적과 계기, 또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요."
          disabled={submitted}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <div className="mt-6 flex gap-x-6">
        <button
          type="button"
          className="bg-primary text-small18 disabled:bg-neutral-70 h-12 flex-1 rounded-md px-6 py-3 text-center font-medium text-white disabled:cursor-not-allowed disabled:text-white"
          disabled={submitted || goal.length === 0}
          value={goal}
          onClick={handleClickSubmit}
        >
          {submitted ? '제출 완료' : '제출하기'}
        </button>
      </div>
    </>
  );
};

export default OtMissionInputSection;
