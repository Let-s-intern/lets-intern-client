import { usePatchAttendance } from '@/api/attendance';
import {
  useGetChallengeReviewStatus,
  usePostChallengeAttendance,
} from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { Schedule, UserChallengeMissionDetail } from '@/schema';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ParsedCommentBox from '../ParsedCommentBox';

interface Props {
  missionDetail: UserChallengeMissionDetail;
  currentSchedule: Schedule;
  setOpenReviewModal?: (value: boolean) => void;
}

const AbsentMissionSubmitMenu = ({
  missionDetail,
  currentSchedule,
  setOpenReviewModal,
}: Props) => {
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
  const [value, setValue] = useState(
    currentSchedule?.attendanceInfo?.link || '',
  );
  const [review, setReview] = useState(
    currentSchedule?.attendanceInfo?.review || '',
  );
  const [isLinkChecked, setIsLinkChecked] = useState(false);
  const [isValidLinkValue, setIsValidLinkValue] = useState(isAttended);
  const [isStartedHttp, setIsStartedHttp] = useState(false);

  const { data: reviewCompleted } = useGetChallengeReviewStatus(
    currentChallenge?.id,
  );

  const { mutateAsync: tryPostAttendance } = usePostChallengeAttendance({});

  const patchAttendance = usePatchAttendance();

  const handleMissionLinkChanged = (e: any) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue.startsWith('https://') || inputValue.startsWith('http://')) {
      setIsStartedHttp(true);
    } else {
      setIsStartedHttp(false);
      setIsLinkChecked(false);
    }

    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const regex = new RegExp(expression);

    if (regex.test(e.target.value)) {
      setIsValidLinkValue(true);
    } else {
      setIsValidLinkValue(false);
      setIsLinkChecked(false);
    }
  };

  useEffect(() => {
    handleMissionLinkChanged({ target: { value } });
  }, [value]);

  const handleMissionLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidLinkValue || !isLinkChecked || !value || !review) {
      alert('올바른 URL 또는 미션 소감을 입력해주세요.');
      return;
    }

    try {
      if (
        currentSchedule.attendanceInfo.result === 'WRONG' &&
        currentSchedule.attendanceInfo.id !== null
      ) {
        await patchAttendance.mutateAsync({
          attendanceId: currentSchedule.attendanceInfo.id,
          link: value,
          review,
        });
        alert('미션 수정이 완료되었습니다.');
      } else {
        await tryPostAttendance({
          missionId: missionDetail.id,
          link: value,
          review,
        });

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

  return (
    <>
      <form onSubmit={handleMissionLinkSubmit} className="px-3">
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
            <div className="mt-4 flex items-stretch gap-4">
              <label
                htmlFor="link"
                className="flex items-center font-semibold text-[#626262]"
              >
                링크
              </label>
              <input
                type="text"
                className={clsx(
                  'flex-1 cursor-text rounded-lg border border-[#A3A3A3] px-3 py-2 text-sm outline-none',
                  {
                    'text-neutral-400': isAttended,
                    'border-red-500': !isValidLinkValue && value && !isAttended,
                    'border-primary': isValidLinkValue && value && !isAttended,
                  },
                )}
                id="link"
                name="link"
                placeholder="제출할 링크를 입력해주세요."
                autoComplete="off"
                onChange={handleMissionLinkChanged}
                value={value}
                disabled={isAttended}
              />
              <button
                type="button"
                className="rounded bg-primary px-5 font-medium text-white disabled:bg-[#c7c7c7]"
                onClick={() => {
                  if (value) {
                    Object.assign(document.createElement('a'), {
                      target: '_blank',
                      href: value,
                      rel: 'noopener noreferrer',
                    }).click();
                    setIsLinkChecked(true);
                  }
                }}
                disabled={(!value && !isAttended) || !isValidLinkValue}
              >
                링크 확인
              </button>
            </div>
            {value &&
              !isAttended &&
              (isLinkChecked ? (
                <div className="ml-12 mt-1 text-xs font-medium text-primary">
                  링크 확인을 완료하셨습니다. 링크가 올바르다면 제출 버튼을
                  눌러주세요.
                </div>
              ) : !isValidLinkValue ? (
                <div className="ml-12 mt-1 text-xs font-medium text-red-500">
                  URL 형식이 올바르지 않습니다.
                  {!isStartedHttp && (
                    <> (https:// 또는 http://로 시작해야 합니다.)</>
                  )}
                </div>
              ) : (
                <div className="ml-12 mt-1 text-xs font-medium text-primary">
                  URL을 올바르게 입력하셨습니다. 링크 확인을 진행해주세요.
                </div>
              ))}
            <div className="mt-6 flex w-full flex-col gap-y-5">
              <h3 className="text-xsmall16 font-semibold text-neutral-0">
                미션 소감
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
                  placeholder={`오늘의 미션은 어떠셨나요?\n새롭게 배운 점, 어려운 부분, 궁금증 등 떠오르는 생각을 남겨 주세요.`}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  disabled={isAttended}
                  maxLength={500}
                />
                <span className="w-full text-right text-xxsmall12 text-neutral-0/35">
                  {review.length}/500
                </span>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                type="submit"
                className="rounded border border-[#DCDCDC] bg-white px-5 py-2 text-center font-semibold disabled:bg-gray-50 disabled:text-gray-600"
                disabled={
                  isAttended ||
                  !value ||
                  !isLinkChecked ||
                  !isValidLinkValue ||
                  !review
                }
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

export default AbsentMissionSubmitMenu;
