import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { MyDailyMission, Schedule } from '../../../../../schema';
import axios from '../../../../../utils/axios';
import AlertModal from '../../../../ui/alert/AlertModal';

interface Props {
  myDailyMission: MyDailyMission;
}

const DailyMissionSubmitSection = ({ myDailyMission }: Props) => {
  const queryClient = useQueryClient();

  const { schedules } = useCurrentChallenge();

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
  const attendanceReview = '';
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

  const submitMissionLink = useMutation({
    mutationFn: async (linkValue: string) => {
      // 출석 링크 수정
      if (attended) {
        const res = await axios.patch(`/attendance/${attendanceId}`, {
          link: linkValue,
        });
        const data = res.data;
        return data;
      }

      const res = await axios.post(
        `/attendance/${myDailyMission.dailyMission?.id}`,
        {
          link: linkValue,
        },
      );
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },
  });

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
      // eslint-disable-next-line no-useless-escape
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

  const handleMissionLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLastMission) {
      alert(
        '마지막 미션입니다. 미션 제출 후 미션 소감을 카톡으로 공유해주세요.',
      );
      return;
    }

    // 미션 소감 제출 반영해야 함
    submitMissionLink.mutate(value as string);
    setIsEditing(false);
  };

  const cancelMisiionLinkChange = () => {
    // 입력값이 이전 링크와 다를 때만 팝업 띄우기
    if (attendanceLink !== value) {
      setIsAlertShown(true);
    } else setIsEditing(false);
  };

  return (
    <form onSubmit={handleMissionLinkSubmit}>
      <h3 className="text-1-semibold">미션 제출하기</h3>
      <p className="text-0.875 mt-1">
        {isEditing
          ? '미션 링크가 잘 열리는지 확인해 주세요. 제출 후 미션과 소감을 카톡으로 공유해야 미션 제출이 인정됩니다.'
          : '미션 제출이 완료되었습니다.'}
      </p>
      <div className="mt-4 flex items-stretch gap-4">
        <label
          htmlFor="link"
          className="text-0.875-semibold flex items-center text-neutral-35"
        >
          링크
        </label>
        <input
          type="text"
          className={clsx(
            'text-0.875 flex-1 cursor-text rounded-xxs border border-neutral-50 bg-neutral-95 px-3 py-2 outline-none',
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
          className="rounded-xxs bg-primary px-5 font-medium text-static-100 disabled:bg-neutral-70"
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
          <div className="text-0.75-medium ml-12 mt-1 text-primary">
            링크 확인을 완료하셨습니다. 링크가 올바르다면 미션 소감 작성 후 제출
            버튼을 눌러주세요.
          </div>
        ) : !isValidLinkValue ? (
          <div className="text-0.75-medium ml-12 mt-1 text-red-500">
            URL 형식이 올바르지 않습니다.
            {!isStartedHttp && <> (https:// 또는 http://로 시작해야 합니다.)</>}
          </div>
        ) : (
          <div className="text-0.75-medium ml-12 mt-1 text-primary">
            URL을 올바르게 입력하셨습니다. 링크 확인을 진행해주세요.
          </div>
        ))}
      <div className="mt-6 flex w-full flex-col gap-y-2.5">
        <h3 className="text-xsmall16 font-bold text-neutral-0">미션 소감</h3>
        <textarea
          className="rounded-md border border-neutral-50 bg-neutral-95 p-3 text-xsmall16 outline-none"
          placeholder={`오늘의 미션은 어떠셨나요?\n새롭게 배운 점, 어려운 부분, 궁금증 등 떠오르는 생각을 남겨 주세요.`}
          value={review}
          onChange={handleMissionReviewChanged}
          disabled={!isEditing || attendanceReview !== ''}
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
        <AlertModal
          onConfirm={() => {
            onConfirm();
            setIsAlertShown(false);
          }}
          title="링크 변경을 취소하시겠어요?"
          onCancel={() => setIsAlertShown(false)}
          highlight="confirm"
          confirmText="링크 변경 취소"
          cancelText="수정 계속하기"
        >
          지금 취소하시면 수정사항이 삭제됩니다.
        </AlertModal>
      )}
    </form>
  );
};

export default DailyMissionSubmitSection;
