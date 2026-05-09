import { Schedule } from '@/schema';
import clsx from 'clsx';
import BankSelectDropdown from '../my-challenge/mission/BankSelectDropdown';
import ParsedCommentBox from '../my-challenge/ParsedCommentBox';
import { useBonusMissionSubmitMenu } from './useBonusMissionSubmitMenu';

interface Props {
  currentSchedule: Schedule;
  setOpenReviewModal?: (value: boolean) => void;
}

const BonusMissionSubmitMenu = ({
  currentSchedule,
  setOpenReviewModal,
}: Props) => {
  const {
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
  } = useBonusMissionSubmitMenu({ currentSchedule, setOpenReviewModal });

  return (
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
              className="bg-primary rounded px-5 font-medium text-white disabled:bg-[#c7c7c7]"
              onClick={handleLinkCheck}
              disabled={(!link && !isAttended) || !isValidLinkValue}
            >
              링크 확인
            </button>
          </div>
          {link &&
            !isAttended &&
            (isLinkChecked ? (
              <div className="text-primary ml-12 mt-1 text-xs font-medium">
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
              <div className="text-primary ml-12 mt-1 text-xs font-medium">
                URL을 올바르게 입력하셨습니다. 링크 확인을 진행해주세요.
              </div>
            ))}

          <div className="mt-6 flex w-full flex-col gap-y-3">
            <h3 className="text-xsmall16 text-neutral-0 font-semibold">
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
                  'text-xsmall14 disabled:bg-neutral-95 flex-1 cursor-text rounded-sm p-3 outline-none',
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

          <label
            htmlFor="privacyConsent"
            className="text-xsmall14 text-neutral-0 mt-8 block font-semibold"
          >
            개인정보 활용 동의
          </label>
          <p className="text-xsmall14 mt-1">
            [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로 개인정보를
            수집, 이용 및 제공하는데 동의합니다. <br />
            □ 개인정보의 수집 및 이용에 관한 사항 <br />
            ✓ 수집하는 개인정보 항목 : 성명, 전화번호, 계좌번호 <br />✓
            개인정보의 이용 목적 : 렛츠커리어 프로그램 후기 리워드 지급
          </p>
          <button
            type="button"
            className="mt-3 flex items-center gap-1 disabled:opacity-60"
            disabled={isAttended}
            onClick={() => setPrivacyConsent(!privacyConsent)}
          >
            {privacyConsent ? (
              <img src="/icons/checkbox-fill.svg" className="h-6 w-6" alt="" />
            ) : (
              <img src="/icons/Checkbox_Empty.svg" className="h-6 w-6" alt="" />
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
  );
};

export default BonusMissionSubmitMenu;
