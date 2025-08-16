import { usePatchAttendance } from '@/api/attendance';
import {
  useGetChallengeGoal,
  useGetChallengeReviewStatus,
  usePatchChallengeGoal,
  usePostChallengeAttendance,
} from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { Schedule } from '@/schema';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ParsedCommentBox from './my-challenge/ParsedCommentBox';

interface Props {
  currentSchedule: Schedule;
  setOpenReviewModal?: (value: boolean) => void;
}

const OtMissionSubmitMenu = ({
  currentSchedule,
  setOpenReviewModal,
}: Props) => {
  const params = useParams();

  const { schedules, currentChallenge } = useCurrentChallenge();
  const lastMission = schedules.reduce((acc: Schedule | null, schedule) => {
    if (acc === null) return schedule;

    return schedule.missionInfo.th &&
      acc.missionInfo.th &&
      schedule.missionInfo.th > acc.missionInfo.th
      ? schedule
      : acc;
  }, null);
  const isLastMission =
    lastMission?.missionInfo.th === currentSchedule.missionInfo.th;

  const [isAttended, setIsAttended] = useState(
    currentSchedule?.attendanceInfo.result === 'WRONG'
      ? false
      : currentSchedule?.attendanceInfo.submitted || false,
  );
  const [goal, setGoal] = useState('');

  const { data: reviewCompleted } = useGetChallengeReviewStatus(
    currentChallenge?.id,
  );
  const patchAttendance = usePatchAttendance();
  const { data: goalData, isLoading } = useGetChallengeGoal(params.programId);
  const patchGoal = usePatchChallengeGoal();
  const postAttendance = usePostChallengeAttendance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goal) {
      alert('올바른 목표를 입력해주세요.');
      return;
    }

    try {
      if (
        currentSchedule.attendanceInfo.result === 'WRONG' &&
        currentSchedule.attendanceInfo.id !== null
      ) {
        await editGoal();
        alert('미션 수정이 완료되었습니다.');
      } else {
        await submitGoal();
        if (
          isLastMission &&
          reviewCompleted &&
          reviewCompleted.reviewId === null &&
          setOpenReviewModal
        ) {
          setOpenReviewModal(true);
        }
      }
      setIsAttended(true);
    } catch (error) {
      console.error(error);
      alert('미션 제출에 실패했습니다. 다시 시도해주세요.');
      return;
    }
  };

  const submitGoal = async () => {
    if (!params.programId) return;

    await Promise.all([
      patchGoal.mutateAsync({ challengeId: params.programId, goal }),
      postAttendance.mutateAsync({
        missionId: currentSchedule.missionInfo.id,
      }),
    ]);
  };

  const editGoal = async () => {
    const attendanceId = currentSchedule.attendanceInfo.id;
    if (!params.programId || !attendanceId) return;

    await Promise.all([
      patchGoal.mutateAsync({ challengeId: params.programId, goal }),
      patchAttendance.mutateAsync({
        attendanceId,
      }),
    ]);
  };

  useEffect(() => {
    if (isLoading) return;
    setGoal(goalData?.goal ?? '');
  }, [goalData, isLoading]);

  return (
    <>
      <form onSubmit={handleSubmit} className="px-3">
        <h3 className="text-lg font-semibold">
          {currentSchedule?.attendanceInfo.result === 'WRONG' &&
          currentSchedule?.attendanceInfo.status === 'UPDATED'
            ? '해당 미션은 총 2회 반려되었으므로, 재제출이 불가능한 미션입니다.'
            : '미션 제출하기'}
        </h3>
        {isAttended ? (
          <p className="mt-1 text-sm">미션 제출이 완료되었습니다.</p>
        ) : (
          currentSchedule?.attendanceInfo.result === 'WRONG' &&
          currentSchedule?.attendanceInfo.status !== 'UPDATED' && (
            <p className="mt-1 text-sm">
              아래 반려 사유를 확인하여, 다시 제출해주세요!
            </p>
          )
        )}
        {currentSchedule?.attendanceInfo.comments && (
          <div className="mt-4">
            <ParsedCommentBox
              className="rounded-md bg-[#F2F2F2] px-8 py-6 text-sm"
              comment={currentSchedule?.attendanceInfo.comments}
            />
          </div>
        )}
        {!(
          currentSchedule?.attendanceInfo.result === 'WRONG' &&
          currentSchedule?.attendanceInfo.status === 'UPDATED'
        ) && (
          <>
            <div className="mt-6 flex w-full flex-col gap-y-5">
              <h3 className="text-xsmall16 font-semibold text-neutral-0">
                챌린지 참여 목표
              </h3>
              <div
                className={clsx('flex flex-col gap-y-2 rounded-md p-3', {
                  'bg-neutral-95': !isAttended,
                  'bg-white': isAttended,
                })}
              >
                <textarea
                  className={clsx(
                    'h-20 flex-1 resize-none bg-neutral-95 text-xsmall14 outline-none disabled:bg-white',
                    {
                      'text-neutral-400': isAttended,
                    },
                  )}
                  placeholder={`챌린지를 신청한 목적과 계기,\n또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요.`}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  disabled={isAttended}
                  maxLength={500}
                />
                <span className="w-full text-right text-xxsmall12 text-neutral-0/35">
                  {goal.length}/500
                </span>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                className="rounded border border-[#DCDCDC] bg-white px-5 py-2 text-center font-semibold disabled:bg-gray-50 disabled:text-gray-600"
                disabled={isAttended || !goal}
              >
                {isAttended ? '제출 완료' : '제출'}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default OtMissionSubmitMenu;
