import { usePatchAttendance } from '@/api/attendance/attendance';
import { usePostBlogBonus } from '@/api/review/review';
import { Schedule } from '@/schema';
import { useEffect, useState } from 'react';

interface UseBonusMissionSubmitMenuParams {
  currentSchedule: Schedule;
  setOpenReviewModal?: (value: boolean) => void;
}

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export function useBonusMissionSubmitMenu({
  currentSchedule,
  setOpenReviewModal,
}: UseBonusMissionSubmitMenuParams) {
  const attendance = currentSchedule?.attendanceInfo;
  const missionId = currentSchedule.missionInfo.id;

  const [isAttended, setIsAttended] = useState(
    attendance.result === 'WRONG' ? false : attendance.submitted || false,
  );
  const [link, setLink] = useState(attendance?.link || '');
  const [isLinkChecked, setIsLinkChecked] = useState(false);
  const [isValidLinkValue, setIsValidLinkValue] = useState(isAttended);
  const [isStartedHttp, setIsStartedHttp] = useState(false);
  const [accountType, setAccountType] = useState(attendance?.accountType ?? '');
  const [accountNum, setAccountNum] = useState(attendance?.accountNum ?? '');
  const [privacyConsent, setPrivacyConsent] = useState(attendance.submitted);

  const postBlogBonus = usePostBlogBonus();
  const patchAttendance = usePatchAttendance();

  const isSubmittable =
    !isAttended &&
    link &&
    isLinkChecked &&
    privacyConsent &&
    accountNum &&
    accountType;

  const handleMissionLinkChanged = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } },
  ) => {
    const inputValue = e.target.value;
    setLink(inputValue);
    if (inputValue.startsWith('https://') || inputValue.startsWith('http://')) {
      setIsStartedHttp(true);
    } else {
      setIsStartedHttp(false);
      setIsLinkChecked(false);
    }

    if (URL_REGEX.test(inputValue)) {
      setIsValidLinkValue(true);
    } else {
      setIsValidLinkValue(false);
      setIsLinkChecked(false);
    }
  };

  useEffect(() => {
    handleMissionLinkChanged({ target: { value: link } });
  }, [link]);

  const handleLinkCheck = () => {
    if (!link) return;
    Object.assign(document.createElement('a'), {
      target: '_blank',
      href: link,
      rel: 'noopener noreferrer',
    }).click();
    setIsLinkChecked(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid =
      isValidLinkValue &&
      isLinkChecked &&
      link &&
      accountType &&
      accountNum &&
      privacyConsent;

    if (!isValid) {
      alert('올바른 값을 입력해주세요.');
      return;
    }

    try {
      if (
        currentSchedule.attendanceInfo.result === 'WRONG' &&
        currentSchedule.attendanceInfo.id !== null
      ) {
        await patchAttendance.mutateAsync({
          attendanceId: currentSchedule.attendanceInfo.id,
          link,
          accountNum,
          accountType,
        });
        alert('미션 수정이 완료되었습니다.');
      } else {
        await postBlogBonus.mutateAsync({
          missionId,
          url: link,
          accountType,
          accountNum,
        });
        setOpenReviewModal?.(true);
      }
      setIsAttended(true);
    } catch (error) {
      console.error(error);
      alert('미션 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    isAttended,
    link,
    isLinkChecked,
    isValidLinkValue,
    isStartedHttp,
    accountType,
    accountNum,
    privacyConsent,
    isSubmittable,
    setAccountType,
    setAccountNum,
    setPrivacyConsent,
    handleMissionLinkChanged,
    handleLinkCheck,
    handleSubmit,
  };
}
