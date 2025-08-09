import { usePatchAttendance } from '@/api/attendance';
import {
  useGetChallengeReviewStatus,
  usePostChallengeAttendance,
} from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { MyDailyMission, Schedule } from '@/schema';
import BaseModal from '@components/ui/BaseModal';
import ModalButton from '@components/ui/ModalButton';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import DailyMissionLinkInputSection from '../../DailyMissionLinkInputSection';
import DailyMissionReviewSection from '../../DailyMissionReviewSection';
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
  const [isValidLinkValue, setIsValidLinkValue] = useState<boolean>(!!attended);
  const [isStartedHttp, setIsStartedHttp] = useState(false);
  const [isEditing, setIsEditing] = useState(
    !myDailyMission.attendanceInfo?.submitted,
  );
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [lastMissionModal, setLastMissionModal] = useState(false);

  const { data: reviewCompleted } = useGetChallengeReviewStatus(
    currentChallenge?.id,
  );

  const { mutateAsync: tryPostAttendance } = usePostChallengeAttendance({});
  const patchAttendance = usePatchAttendance();

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
        await patchAttendance.mutateAsync({
          attendanceId,
          link: value,
          review,
        });
        alert('미션 수정이 완료되었습니다.');
      } else {
        await tryPostAttendance({
          missionId: myDailyMission.dailyMission.id,
          link: value,
          review,
        });
      }
      setIsEditing(false);

      if (isLastMission && !attended) {
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
        <h3 className="mb-6 text-xsmall16 font-semibold">미션 제출하기</h3>
        <DailyMissionLinkInputSection
          value={value}
          isEditing={isEditing}
          isValidLinkValue={isValidLinkValue}
          handleMissionLinkChanged={handleMissionLinkChanged}
          setIsLinkChecked={setIsLinkChecked}
        />
        <DailyMissionReviewSection
          value={value}
          isEditing={isEditing}
          isValidLinkValue={isValidLinkValue}
          isLinkChecked={isLinkChecked}
          isStartedHttp={isStartedHttp}
          review={review}
          attendanceLink={attendanceLink ?? undefined}
          handleMissionReviewChanged={handleMissionReviewChanged}
          cancelMisiionLinkChange={cancelMisiionLinkChange}
          setIsEditing={setIsEditing}
          setIsLinkChecked={setIsLinkChecked}
        />
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
            <div className="flex items-center text-xsmall14">
              <ModalButton
                className="border-r border-neutral-80 font-medium"
                onClick={() => setIsAlertShown(false)}
              >
                수정 계속하기
              </ModalButton>
              <ModalButton
                className={clsx('font-semibold text-primary')}
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
      {lastMissionModal &&
        (reviewCompleted?.reviewId === null ||
          reviewCompleted?.reviewId === undefined) && (
          <LastMissionSubmitModal
            onClose={() => setLastMissionModal(false)}
            challengeId={currentChallenge?.id}
          />
        )}
    </>
  );
};

export default DailyMissionSubmitSection;
