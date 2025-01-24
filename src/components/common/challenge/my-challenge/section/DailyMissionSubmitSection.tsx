import {
  usePatchChallengeAttendance,
  usePostChallengeAttendance,
} from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import BaseModal from '@components/ui/BaseModal';
import ModalButton from '@components/ui/ModalButton';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { MyDailyMission, Schedule } from '../../../../../schema';
import LastMissionSubmitModal from './LastMissionSubmitModal';

interface Props {
  myDailyMission: MyDailyMission;
}

const DailyMissionSubmitSection = ({ myDailyMission }: Props) => {
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
    lastMission?.missionInfo.th === myDailyMission.dailyMission?.th;

  const attendanceLink = myDailyMission.attendanceInfo?.link;
  const attendanceReview = myDailyMission.attendanceInfo?.review;
  const attended = myDailyMission.attendanceInfo?.submitted;
  const attendanceId = myDailyMission.attendanceInfo?.id;

  const [value, setValue] = useState(attendanceLink ?? '');
  const [review, setReview] = useState(attendanceReview ?? '');
  const [isLinkChecked, setIsLinkChecked] = useState(false);
  const [isValidLinkValue, setIsValidLinkValue] = useState(attended);
  const [isStartedHttp, setIsStartedHttp] = useState(false);
  const [isEditing, setIsEditing] = useState(
    !myDailyMission.attendanceInfo?.submitted,
  );
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [lastMissionModal, setLastMissionModal] = useState(false);

  const { mutateAsync: tryPostAttendance } = usePostChallengeAttendance({});

  const { mutateAsync: tryPatchAttendance } = usePatchChallengeAttendance({});

  useEffect(() => {
    const handleBeforeunload = (e: BeforeUnloadEvent) => {
      if (!isEditing || value === myDailyMission.attendanceInfo?.link) {
        return;
      }
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeunload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
    };
  }, [isEditing, myDailyMission.attendanceInfo?.link, value]);

  const onConfirm = () => {
    setValue(attendanceLink ?? '');
    setIsEditing(false);
  };

  const handleMissionLinkChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleMissionReviewChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReview(e.target.value);
  };

  const handleMissionLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidLinkValue || !isLinkChecked || !value) {
      alert('올바른 URL을 입력해주세요.');
      return;
    }

    if (myDailyMission.dailyMission?.id === undefined) {
      alert('미션 정보를 불러오지 못했습니다. 다시 시도해주세요.');
      return;
    }

    try {
      if (attended && attendanceId !== undefined && attendanceId !== null) {
        await tryPatchAttendance({
          attendanceId,
          link: value,
        });
      } else {
        await tryPostAttendance({
          missionId: myDailyMission.dailyMission.id,
          link: value,
          review,
        });
      }
      setIsEditing(false);

      if (isLastMission) {
        setLastMissionModal(true);
      }
    } catch (error) {
      console.error(error);
      alert('미션 제출에 실패했습니다. 다시 시도해주세요.');
      return;
    }
  };

  const cancelMisiionLinkChange = () => {
    // 입력값이 이전 링크와 다를 때만 팝업 띄우기
    if (attendanceLink !== value) {
      setIsAlertShown(true);
    } else setIsEditing(false);
  };

  return (
    <>
      <form onSubmit={handleMissionLinkSubmit}>
        <h3 className="text-xsmall16 mb-6 font-semibold">미션 제출하기</h3>
        <label
          htmlFor="link"
          className="text-xsmall14 font-semibold text-neutral-0"
        >
          링크
        </label>
        <p className="text-xsmall14 mt-1">
          {isEditing
            ? '미션 링크가 잘 열리는지 확인해 주세요. 제출 후 미션과 소감을 카톡으로 공유해야 미션 제출이 인정됩니다.'
            : '미션 제출이 완료되었습니다.'}
        </p>
        <div className="mt-3 flex items-stretch gap-4">
          <input
            type="text"
            className={clsx(
              'text-xsmall14 flex-1 cursor-text rounded-sm p-3 outline-none',
              {
                'text-neutral-400': !isEditing,
                'border-red-500': !isValidLinkValue && value && isEditing,
                'border-primary': isValidLinkValue && value && isEditing,
              },
            )}
            id="link"
            name="link"
            placeholder="제출할 링크를 입력해주세요."
            autoComplete="off"
            onChange={handleMissionLinkChanged}
            value={value}
            disabled={!isEditing}
          />
          <button
            type="button"
            className="rounded-sm bg-primary px-5 font-medium text-static-100 disabled:bg-neutral-70"
            onClick={() => {
              if (value) {
                Object.assign(document.createElement('a'), {
                  target: '_blank',
                  href: value,
                  rel: 'noopenner noreferrer',
                }).click();
                setIsLinkChecked(true);
              }
            }}
            disabled={(!value && isEditing) || !isValidLinkValue}
          >
            링크 확인
          </button>
        </div>
        {value &&
          isEditing &&
          (isLinkChecked ? (
            <div className="text-0.75-medium mt-1 text-primary">
              링크 확인을 완료하셨습니다. 링크가 올바르다면 미션 소감 작성 후
              제출 버튼을 눌러주세요.
            </div>
          ) : !isValidLinkValue ? (
            <div className="text-0.75-medium mt-1 text-red-500">
              URL 형식이 올바르지 않습니다.
              {!isStartedHttp && (
                <> (https:// 또는 http://로 시작해야 합니다.)</>
              )}
            </div>
          ) : (
            <div className="text-0.75-medium mt-1 text-primary">
              URL을 올바르게 입력하셨습니다. 링크 확인을 진행해주세요.
            </div>
          ))}
        <div className="mt-6 flex w-full flex-col gap-y-5">
          <h3 className="text-xsmall16 font-semibold text-neutral-0">
            미션 소감
          </h3>
          <textarea
            className="rounded-md p-3 h-20 text-xsmall14 outline-none resize-none"
            placeholder={`오늘의 미션은 어떠셨나요?\n새롭게 배운 점, 어려운 부분, 궁금증 등 떠오르는 생각을 남겨 주세요.`}
            value={review}
            onChange={handleMissionReviewChanged}
            disabled={!isEditing || !!attendanceReview}
          />
        </div>
        <div className="mt-6 text-right">
          {attendanceLink && (
            <button
              type="button"
              className="text-1-semibold mr-3 rounded-xxs border border-neutral-75 bg-static-100 px-5 py-2 text-center disabled:bg-gray-50 disabled:text-gray-600"
              onClick={() => {
                if (isEditing) {
                  cancelMisiionLinkChange();
                } else {
                  setIsEditing(true);
                  setIsLinkChecked(false);
                }
              }}
            >
              {isEditing ? '취소' : '수정하기'}
            </button>
          )}
          <button
            type="submit"
            className="text-1-semibold rounded-xxs border border-neutral-75 bg-static-100 px-5 py-2 text-center disabled:bg-gray-50 disabled:text-gray-600"
            disabled={!isEditing || !value || !review || !isLinkChecked}
          >
            {isEditing ? '제출' : '제출 완료'}
          </button>
        </div>

        {isAlertShown && (
          <BaseModal
            isOpen={isAlertShown}
            onClose={() => setIsAlertShown(false)}
            className="max-w-[20rem] md:max-w-[28rem]"
          >
            <div className="border-b border-neutral-80 px-6 py-5">
              <span className="mb-3 block text-xsmall16 font-semibold">
                지금 취소하시면 수정사항이 삭제됩니다.
              </span>
              <p className="text-xsmall14">링크 변경을 취소하시겠어요?</p>
            </div>
            <div className="flex items-center text-xsmall14 ">
              <ModalButton
                className="border-r border-neutral-80 font-medium"
                onClick={() => setIsAlertShown(false)}
              >
                수정 계속하기
              </ModalButton>
              <ModalButton
                className={clsx('text-primary font-semibold')}
                onClick={() => {
                  onConfirm();
                  setIsAlertShown(false);
                }}
              >
                링크 변경 취소
              </ModalButton>
            </div>
          </BaseModal>
        )}
      </form>
      {lastMissionModal && (
        <LastMissionSubmitModal
          onClose={() => setLastMissionModal(false)}
          title={currentChallenge?.title ?? ''}
          challengeId={currentChallenge?.id}
        />
      )}
    </>
  );
};

export default DailyMissionSubmitSection;
