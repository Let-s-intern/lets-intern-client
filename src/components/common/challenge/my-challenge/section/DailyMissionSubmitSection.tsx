import { usePatchAttendance } from '@/api/attendance';
import {
  useGetChallengeReviewStatus,
  usePostChallengeAttendance,
} from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { MyDailyMission, Schedule } from '@/schema';
import { useEffect, useState } from 'react';
import BonusMissionInputSection from '../../BonusMissionInputSection';
import DailyMissionLinkInputSection from '../../DailyMissionLinkInputSection';
import DailyMissionReviewSection from '../../DailyMissionReviewSection';
import DailyMissionSubmitButton from '../../DailyMissionSubmitButton';
import LinkChangeConfirmationModal from '../../LinkChangeConfirmationModal';
import OtMissionInputSection from '../../OtMissionInputSection';
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
  const isOtMission = myDailyMission.dailyMission?.th === 0;
  const isBonusMission = myDailyMission.dailyMission?.th === 100;

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

  useEffect(() => {
    const handleBeforeunload = (e: BeforeUnloadEvent) => {
      const disabled =
        !isEditing ||
        value === myDailyMission.attendanceInfo?.link ||
        lastMissionModal; // 모달이 열렸을 때는 생략

      if (disabled) return;
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeunload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
    };
  }, [isEditing, myDailyMission.attendanceInfo?.link, value, lastMissionModal]);

  return (
    <>
      <form onSubmit={handleMissionLinkSubmit}>
        <h3 className="mb-6 text-xsmall16 font-semibold">미션 제출하기</h3>
        {/* 기본 미션 */}
        {!isOtMission && !isBonusMission && (
          <>
            <DailyMissionLinkInputSection
              value={value}
              isEditing={isEditing}
              isValidLinkValue={isValidLinkValue}
              isLinkChecked={isLinkChecked}
              isStartedHttp={isStartedHttp}
              handleMissionLinkChanged={handleMissionLinkChanged}
              setIsLinkChecked={setIsLinkChecked}
            />
            <DailyMissionReviewSection
              isEditing={isEditing}
              review={review}
              handleMissionReviewChanged={handleMissionReviewChanged}
            />
            <DailyMissionSubmitButton
              value={value}
              isEditing={isEditing}
              isLinkChecked={isLinkChecked}
              review={review}
              attendanceLink={attendanceLink ?? undefined}
              cancelMisiionLinkChange={cancelMisiionLinkChange}
              setIsEditing={setIsEditing}
              setIsLinkChecked={setIsLinkChecked}
            />
          </>
        )}

        {/* OT 미션 */}
        {isOtMission && myDailyMission.dailyMission?.id && (
          <OtMissionInputSection missionId={myDailyMission.dailyMission?.id} />
        )}

        {/* 보너스 미션 */}
        {isBonusMission && (
          <BonusMissionInputSection
            myDailyMission={myDailyMission}
            onCancelEdit={cancelMisiionLinkChange}
            onSubmit={() => {
              if (!attended) setLastMissionModal(true);
            }}
          />
        )}
      </form>

      <LinkChangeConfirmationModal
        isOpen={isAlertShown}
        onClose={() => setIsAlertShown(false)}
        onClickCancel={() => setIsAlertShown(false)}
        onClickConfirm={() => {
          onConfirm();
          setIsAlertShown(false);
        }}
      />

      {/* 챌린지 리뷰 */}
      {lastMissionModal &&
        (reviewCompleted?.reviewId === null ||
          reviewCompleted?.reviewId === undefined) && (
          <LastMissionSubmitModal
            onClose={() => {
              setLastMissionModal(false);
              window.location.reload();
            }}
            challengeId={currentChallenge?.id}
          />
        )}
    </>
  );
};

export default DailyMissionSubmitSection;
