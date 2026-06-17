import { usePatchAttendance } from '@/api/attendance/attendance';
import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge/challenge';
import { useSubmitMissionBlogBonus } from '@/api/mission/mission';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import useChallengeNav from '@/domain/challenge/hooks/useChallengeNav';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { useCallback, useEffect, useState } from 'react';

interface UseMissionSubmitBonusParams {
  missionId?: number;
  attendanceInfo?: Schedule['attendanceInfo'] | null;
}

export function useMissionSubmitBonus({
  missionId,
  attendanceInfo,
}: UseMissionSubmitBonusParams) {
  const { currentChallenge, refetchSchedules } = useCurrentChallenge();
  const { data: missionData } = useChallengeMissionAttendanceInfoQuery({
    challengeId: currentChallenge?.id,
    missionId,
    enabled: !!currentChallenge?.id && !!missionId,
  });

  const isSubmitPeriodEnded = missionData?.missionInfo?.endDate
    ? missionData.missionInfo.endDate.isBefore(dayjs())
    : true;

  const isResubmitBlocked =
    attendanceInfo?.result === 'PASS' ||
    attendanceInfo?.result === 'FINAL_WRONG' ||
    (attendanceInfo?.result === 'WAITING' &&
      (attendanceInfo?.status === 'LATE' ||
        attendanceInfo?.status === 'UPDATED'));

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [isLinkVerified, setIsLinkVerified] = useState(false);
  const [isLinkChangeModalOpen, setIsLinkChangeModalOpen] = useState(false);

  const submitBlogBonus = useSubmitMissionBlogBonus();
  const patchAttendance = usePatchAttendance();
  const { testDate } = useChallengeNav();

  const disabled = isSubmitted && !isEditing;

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAccountNumber(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleLinkChange = (link: string) => {
    setLinkValue(link);
  };

  const handleLinkVerified = (isVerified: boolean) => {
    setIsLinkVerified(isVerified);
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      setIsEditing(true);
      return;
    }

    if (!missionId) {
      console.error('미션 ID가 없습니다.');
      return;
    }

    try {
      const cleanAccountNumber = accountNumber.replace(/[^0-9]/g, '');

      await submitBlogBonus.mutateAsync({
        missionId,
        url: linkValue,
        accountType: selectedBank,
        accountNum: cleanAccountNumber,
        testDate,
      });
      await refetchSchedules?.();
      setIsSubmitted(true);
      setShowToast(true);
    } catch (error) {
      console.error('제출 실패:', error);
      alert('미션 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
  };

  const handleSaveEdit = async () => {
    if (!attendanceInfo?.id) return;

    try {
      await patchAttendance.mutateAsync({
        attendanceId: attendanceInfo.id,
        link: linkValue,
        accountNum: accountNumber,
        accountType: selectedBank,
      });
      await refetchSchedules?.();
      setIsEditing(false);
      setShowToast(true);
    } catch (error) {
      console.error('미션 수정 실패:', error);
    }
  };

  const initValues = useCallback(() => {
    setLinkValue(attendanceInfo?.link ?? '');
    setSelectedBank(attendanceInfo?.accountType ?? '');
    setAccountNumber(attendanceInfo?.accountNum ?? '');
    setIsAgreed(attendanceInfo?.submitted ?? false);
    setIsMarketingAgreed(attendanceInfo?.submitted ?? false);
    setIsSubmitted(attendanceInfo?.submitted ?? false);
  }, [attendanceInfo]);

  const handleCancelEdit = () => {
    const isChanged =
      attendanceInfo?.link !== linkValue ||
      attendanceInfo?.accountType !== selectedBank ||
      attendanceInfo?.accountNum !== accountNumber;
    if (isChanged) {
      setIsLinkChangeModalOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleConfirmLinkChange = () => {
    initValues();
    setIsEditing(false);
    setIsLinkVerified(false);
    setIsLinkChangeModalOpen(false);
  };

  const cleanAccountNumber = accountNumber.replace(/[^0-9]/g, '');
  const canSubmit =
    isAgreed &&
    isMarketingAgreed &&
    isLinkVerified &&
    selectedBank.trim().length > 0 &&
    cleanAccountNumber.length > 0;

  useEffect(() => {
    initValues();
  }, [attendanceInfo, initValues]);

  return {
    isSubmitted,
    isEditing,
    showToast,
    selectedBank,
    accountNumber,
    isAgreed,
    isMarketingAgreed,
    linkValue,
    isLinkChangeModalOpen,
    isSubmitPeriodEnded,
    isResubmitBlocked,
    disabled,
    canSubmit,
    setShowToast,
    setIsAgreed,
    setIsMarketingAgreed,
    setIsLinkChangeModalOpen,
    handleAccountNumberChange,
    handleLinkChange,
    handleLinkVerified,
    handleSubmit,
    handleBankSelect,
    handleSaveEdit,
    handleCancelEdit,
    handleConfirmLinkChange,
  };
}
