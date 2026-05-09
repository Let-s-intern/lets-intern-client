import {
  usePatchAttendance,
  useSubmitMission,
} from '@/api/attendance/attendance';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { AttendanceResult, AttendanceStatus } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { useEffect, useState } from 'react';

export interface MissionSubmitRegularAttendanceInfo {
  link: string | null;
  status: AttendanceStatus | null;
  id: number | null;
  submitted: boolean | null;
  comments: string | null;
  result: AttendanceResult | null;
  review?: string | null;
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
  const isSubmitPeriodEnded =
    dayjs(currentChallenge?.endDate).add(2, 'day').isBefore(dayjs()) ?? true;

  const currentSelectedMission = schedules.find(
    (schedule) => schedule.missionInfo.id === selectedMissionId,
  );
  const regularMissions = schedules.filter(
    (schedule) => schedule.missionInfo.th !== BONUS_MISSION_TH,
  );
  const lastRegularMission = regularMissions[regularMissions.length - 1];
  const lastRegularMissionId = lastRegularMission?.missionInfo.id;
  const isLastRegularMissionSubmit = lastRegularMissionId === selectedMissionId;

  const [textareaValue, setTextareaValue] = useState(
    attendanceInfo?.review || '',
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
    setIsSubmitted(attendanceInfo?.submitted === true);
    setLinkValue(linkValue);
    setIsLinkVerified(!!linkValue);
    setIsEditing(false);
    setSelectedExperienceIds(attendanceInfo?.submittedUserExperienceIds || []);
  }, [attendanceInfo]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
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
      Math.floor(totalMissionCount * (1 / 3)) === currentSubmissionMissionTh;
    const isSecondThirdMission =
      Math.floor(totalMissionCount * (2 / 3)) === currentSubmissionMissionTh;

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
        userExperienceIds: selectedExperienceIds,
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
    } catch {
      // 에러 처리 로직 추가 가능
    }
  };

  const handleCancelEdit = () => {
    const isChanged =
      attendanceInfo?.link !== linkValue ||
      attendanceInfo.review !== textareaValue;
    if (isChanged) {
      setLinkValue(attendanceInfo?.link ?? '');
      setTextareaValue(attendanceInfo?.review || '');
      setSelectedExperienceIds(
        attendanceInfo?.submittedUserExperienceIds || [],
      );
      setIsEditing(false);
      setIsLinkVerified(false);
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

  const canSubmit = !currentSelectedMission?.missionInfo?.missionType
    ? isLinkVerified && textareaValue.trim().length > 0
    : selectedExperienceIds.length >= 3 && textareaValue.trim().length > 0;

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
    handleTextareaChange,
    handleSubmit,
    handleCancelEdit,
    handleSaveEdit,
    handleLinkChange,
    handleLinkVerified,
  };
}
