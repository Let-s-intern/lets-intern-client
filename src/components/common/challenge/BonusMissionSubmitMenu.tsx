import { usePatchAttendance } from '@/api/attendance';
import { usePostBlogBonus } from '@/api/review';
import { Schedule } from '@/schema';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import BankSelectDropdown from './BankSelectDropdown';
import ParsedCommentBox from './my-challenge/ParsedCommentBox';

interface Props {
  currentSchedule: Schedule;
  setOpenReviewModal?: (value: boolean) => void;
}

const BonusMissionSubmitMenu = ({
  currentSchedule,
  setOpenReviewModal,
}: Props) => {
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

  const handleMissionLinkChanged = (e: any) => {
    const inputValue = e.target.value;
    setLink(inputValue);
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
    handleMissionLinkChanged({ target: { value: link } });
  }, [link]);

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
        // 수정하기
        await patchAttendance.mutateAsync({
          attendanceId: currentSchedule.attendanceInfo.id,
          link,
          accountNum,
          accountType,
        });
        alert('미션 수정이 완료되었습니다.');
      } else {
        // 생성하기
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
      return;
    }
  };

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
            <div className="mt-4 flex items-stretch gap-4">
              <label
                htmlFor="link"
                className="flex items-center font-semibold text-[#626262]"
              >
                블로그 링크
              </label>
              <input
                type="text"
                className={clsx(
                  'flex-1 cursor-text rounded-lg border border-[#A3A3A3] px-3 py-2 text-sm outline-none',
                  {
                    'text-neutral-400': isAttended,
                    'border-red-500': !isValidLinkValue && link && !isAttended,
                    'border-primary': isValidLinkValue && link && !isAttended,
                  },
                )}
                id="link"
                name="link"
                placeholder="제출할 링크를 입력해주세요."
                autoComplete="off"
                onChange={handleMissionLinkChanged}
                value={link}
                disabled={isAttended}
              />
              <button
                type="button"
                className="rounded bg-primary px-5 font-medium text-white disabled:bg-[#c7c7c7]"
                onClick={() => {
                  if (link) {
                    Object.assign(document.createElement('a'), {
                      target: '_blank',
                      href: link,
                      rel: 'noopener noreferrer',
                    }).click();
                    setIsLinkChecked(true);
                  }
                }}
                disabled={(!link && !isAttended) || !isValidLinkValue}
              >
                링크 확인
              </button>
            </div>
            {link &&
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

            {/* 리워드 받을 계좌번호 */}
            <div className="mt-6 flex w-full flex-col gap-y-3">
              <h3 className="text-xsmall16 font-semibold text-neutral-0">
                리워드 받을 계좌번호
              </h3>
              <p className="text-xsmall14">
                리워드 받을 은행과 계좌번호를 입력해주세요. 본인 명의가 아닌
                계좌로는 리워드가 입금되지 않습니다.
              </p>
              <div className="mt-3 flex items-stretch gap-4">
                <BankSelectDropdown
                  selectedBank={accountType}
                  onBankSelect={(bank: string) => {
                    setAccountType(bank);
                  }}
                  disabled={isAttended}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  className={clsx(
                    'flex-1 cursor-text rounded-sm p-3 text-xsmall14 outline-none disabled:bg-neutral-95',
                    {
                      'text-neutral-400': isAttended,
                    },
                  )}
                  id="accountNum"
                  name="accountNum"
                  placeholder="계좌번호를 입력해주세요."
                  autoComplete="off"
                  onChange={(e) => setAccountNum(e.target.value)}
                  value={accountNum}
                  disabled={isAttended}
                />
              </div>
            </div>

            {/* 개인정보 활용 동의 */}
            <label
              htmlFor="privacyConsent"
              className="mt-8 block text-xsmall14 font-semibold text-neutral-0"
            >
              개인정보 활용 동의
            </label>
            <p className="mt-1 text-xsmall14">
              [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로
              개인정보를 수집, 이용 및 제공하는데 동의합니다. <br />
              □ 개인정보의 수집 및 이용에 관한 사항 <br />
              ✓ 수집하는 개인정보 항목 : 성명, 전화번호, 계좌번호 <br />
              ✓ 개인정보의 이용 목적 : 렛츠커리어 프로그램 후기 리워드 지급
            </p>
            <button
              type="button"
              className="mt-3 flex items-center gap-1 disabled:opacity-60"
              disabled={isAttended}
              onClick={() => setPrivacyConsent(!privacyConsent)}
            >
              {privacyConsent ? (
                <img
                  src="/icons/checkbox-fill.svg"
                  className="h-6 w-6"
                  alt=""
                />
              ) : (
                <img
                  src="/icons/Checkbox_Empty.svg"
                  className="h-6 w-6"
                  alt=""
                />
              )}
              <span className="text-xsmall14 text-neutral-10">
                리워드 지급을 위한 개인정보 활용에 동의합니다.
              </span>
            </button>

            <div className="mt-6 text-right">
              <button
                type="submit"
                className="rounded border border-[#DCDCDC] bg-white px-5 py-2 text-center font-semibold disabled:bg-gray-50 disabled:text-gray-600"
                disabled={!isSubmittable}
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

export default BonusMissionSubmitMenu;
