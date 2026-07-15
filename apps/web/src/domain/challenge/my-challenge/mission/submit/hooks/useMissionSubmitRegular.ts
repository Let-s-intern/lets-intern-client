import {
  usePatchAttendance,
  useSubmitMission,
} from '@/domain/challenge/api/attendance';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import useChallengeNav from '@/domain/challenge/hooks/useChallengeNav';
import dayjs from '@/lib/dayjs';
import { AttendanceResult, AttendanceStatus } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { useEffect, useState } from 'react';

const FIRST_THIRD_RATIO = 1 / 3;
const SECOND_THIRD_RATIO = 2 / 3;

export interface MissionSubmitRegularAttendanceInfo {
  link: string | null;
  status: AttendanceStatus | null;
  id: number | null;
  submitted: boolean | null;
  comments: string | null;
  result: AttendanceResult | null;
  review?: string | null;
  preQuestion?: string | null;
  submittedUserExperienceIds?: number[] | null;
}

interface UseMissionSubmitRegularParams {
  selectedMissionTh: number;
  missionId?: number;
  attendanceInfo?: MissionSubmitRegularAttendanceInfo | null;
  onRefreshMissionData?: () => void;
  onSubmitLastMission?: () => void;
}

export function useMissionSubmitRegular({
  selectedMissionTh,
  missionId,
  attendanceInfo,
  onRefreshMissionData,
  onSubmitLastMission,
}: UseMissionSubmitRegularParams) {
  const { selectedMissionId, setSelectedMission } = useMissionStore();
  const { schedules, currentChallenge, refetchSchedules } =
    useCurrentChallenge();
  const { testDate } = useChallengeNav();
  const isSubmitPeriodEnded =
    dayjs(currentChallenge?.endDate).add(2, 'day').isBefore(dayjs()) ?? true;

  const currentSelectedMission = schedules.find(
    (schedule) => schedule.missionInfo.id === selectedMissionId,
  );
  const hasFeedback = currentSelectedMission?.missionInfo?.hasFeedback ?? false;
  const feedbackType =
    currentSelectedMission?.missionInfo?.feedbackType ?? null;
  const regularMissions = schedules.filter(
    (schedule) => schedule.missionInfo.th !== BONUS_MISSION_TH,
  );
  const lastRegularMission = regularMissions[regularMissions.length - 1];
  const lastRegularMissionId = lastRegularMission?.missionInfo.id;
  const isLastRegularMissionSubmit = lastRegularMissionId === selectedMissionId;

  const [textareaValue, setTextareaValue] = useState(
    attendanceInfo?.review || '',
  );
  const [preQuestionValue, setPreQuestionValue] = useState(
    attendanceInfo?.preQuestion || '',
  );
  const [isSubmitted, setIsSubmitted] = useState(
    attendanceInfo?.submitted === true,
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [linkValue, setLinkValue] = useState(attendanceInfo?.link || '');
  const [isLinkVerified, setIsLinkVerified] = useState(!!attendanceInfo?.link);
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isBonusMissionModalOpen, setIsBonusMissionModalOpen] = useState(false);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<number[]>(
    [],
  );

  const submitMission = useSubmitMission();
  const patchAttendance = usePatchAttendance();

  const bonusMission = schedules.find(
    (item) => item.missionInfo.th === BONUS_MISSION_TH,
  );
  const missionType = currentSelectedMission?.missionInfo?.missionType ?? null;

  useEffect(() => {
    const reviewValue = attendanceInfo?.review || '';
    const linkValue = attendanceInfo?.link || '';

    setTextareaValue(reviewValue);
    setPreQuestionValue(attendanceInfo?.preQuestion || '');
    setIsSubmitted(attendanceInfo?.submitted === true);
    setLinkValue(linkValue);
    setIsLinkVerified(!!linkValue);
    setIsEditing(false);
    setSelectedExperienceIds(attendanceInfo?.submittedUserExperienceIds || []);
  }, [attendanceInfo]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handlePreQuestionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setPreQuestionValue(e.target.value);
  };

  const isResubmitBlocked =
    attendanceInfo?.result === 'PASS' ||
    attendanceInfo?.result === 'FINAL_WRONG' ||
    (attendanceInfo?.result === 'WAITING' &&
      (attendanceInfo?.status === 'LATE' ||
        attendanceInfo?.status === 'UPDATED'));

  const handleOpenBonusMissionModalAtSubmission = (
    currentSubmissionMissionTh: number,
  ) => {
    if (!bonusMission) return;
    const totalMissionCount = schedules.length;
    const isFirstThirdMission =
      Math.floor(totalMissionCount * FIRST_THIRD_RATIO) ===
      currentSubmissionMissionTh;
    const isSecondThirdMission =
      Math.floor(totalMissionCount * SECOND_THIRD_RATIO) ===
      currentSubmissionMissionTh;

    if (isFirstThirdMission || isSecondThirdMission) {
      setIsBonusMissionModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (isResubmitBlocked) return;

    if (isSubmitted) {
      setIsEditing(true);
      return;
    }

    if (!missionId || missionId === 0) return;

    try {
      await submitMission.mutateAsync({
        missionId,
        link: linkValue,
        review: textareaValue,
        preQuestion: preQuestionValue,
        userExperienceIds: selectedExperienceIds,
        testDate,
      });
      await refetchSchedules?.();
      setToastMessage('미션 제출이 완료되었습니다.');
      setIsSubmitted(true);
      setShowToast(true);
      onRefreshMissionData?.();
      onSubmitLastMission?.();
      handleOpenBonusMissionModalAtSubmission(selectedMissionTh);
      if (isLastRegularMissionSubmit && !attendanceInfo?.submitted) {
        setModalOpen(true);
      }
    } catch (error) {
      console.error('미션 제출 실패:', error);
      alert('미션 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancelEdit = () => {
    const isChanged =
      attendanceInfo?.link !== linkValue ||
      attendanceInfo.review !== textareaValue ||
      attendanceInfo.preQuestion !== preQuestionValue;
    if (isChanged) {
      setLinkValue(attendanceInfo?.link ?? '');
      setTextareaValue(attendanceInfo?.review || '');
      setPreQuestionValue(attendanceInfo?.preQuestion || '');
      setSelectedExperienceIds(
        attendanceInfo?.submittedUserExperienceIds || [],
      );
      setIsEditing(false);
      setIsLinkVerified(!!attendanceInfo?.link);
    } else {
      setIsEditing(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!attendanceInfo?.id) return;

    try {
      await patchAttendance.mutateAsync({
        attendanceId: attendanceInfo.id,
        link: linkValue,
        review: textareaValue,
        preQuestion: preQuestionValue,
        userExperienceIds: selectedExperienceIds,
      });
      await refetchSchedules?.();
      setIsEditing(false);
      setToastMessage('수정사항이 저장되었습니다.');
      setShowToast(true);
      onRefreshMissionData?.();
    } catch {
      // 에러 처리 로직 추가 가능
    }
  };

  const preQuestionValid = !hasFeedback || preQuestionValue.trim().length > 0;
  const baseSubmitValid = !currentSelectedMission?.missionInfo?.missionType
    ? isLinkVerified && textareaValue.trim().length > 0
    : selectedExperienceIds.length >= 3 && textareaValue.trim().length > 0;
  const canSubmit = baseSubmitValid && preQuestionValid;

  const handleLinkChange = (link: string) => {
    setLinkValue(link);
  };

  const handleLinkVerified = (isVerified: boolean) => {
    setIsLinkVerified(isVerified);
  };

  return {
    currentSelectedMission,
    bonusMission,
    missionType,
    selectedExperienceIds,
    setSelectedExperienceIds,
    setSelectedMission,
    textareaValue,
    isSubmitted,
    showToast,
    toastMessage,
    setShowToast,
    linkValue,
    isLinkVerified,
    isEditing,
    modalOpen,
    isBonusMissionModalOpen,
    setIsBonusMissionModalOpen,
    setModalOpen,
    isSubmitPeriodEnded,
    isResubmitBlocked,
    canSubmit,
    hasFeedback,
    feedbackType,
    preQuestionValue,
    handleTextareaChange,
    handlePreQuestionChange,
    handleSubmit,
    handleCancelEdit,
    handleSaveEdit,
    handleLinkChange,
    handleLinkVerified,
  };
}
