import { usePatchAttendance } from '@/api/attendance';
import { usePostBlogBonus } from '@/api/review';
import { MyDailyMission } from '@/schema';
import clsx from 'clsx';
import { useState } from 'react';
import BankSelectDropdown from './BankSelectDropdown';
import LinkChangeConfirmationModal from './LinkChangeConfirmationModal';

interface Props {
  myDailyMission: MyDailyMission;
  onCancelEdit?: () => void;
  onSubmit?: () => void;
}

const BonusMissionInputSection = ({
  myDailyMission,
  onCancelEdit,
  onSubmit,
}: Props) => {
  const attendanceLink = myDailyMission.attendanceInfo?.link;
  const submitted = myDailyMission.attendanceInfo?.submitted;
  const missionId = myDailyMission.dailyMission?.id;
  const attendanceId = myDailyMission.attendanceInfo?.id;
  const attendance = myDailyMission.attendanceInfo;

  const [url, setUrl] = useState(attendanceLink ?? '');
  const [isEditing, setIsEditing] = useState(!submitted);
  const [isValidLinkValue, setIsValidLinkValue] =
    useState<boolean>(!!submitted);
  const [isLinkChecked, setIsLinkChecked] = useState(false);
  const [isStartedHttp, setIsStartedHttp] = useState(false);
  const [accountType, setAccountType] = useState(attendance?.accountType ?? '');
  const [accountNum, setAccountNum] = useState(attendance?.accountNum ?? '');
  const [privacyConsent, setPrivacyConsent] = useState(submitted);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const isSubmittable =
    isEditing &&
    url &&
    accountNum &&
    accountType &&
    isLinkChecked &&
    privacyConsent;

  const postBlogBonus = usePostBlogBonus();
  const patchAttendance = usePatchAttendance();

  const handleMissionLinkChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUrl(inputValue);
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

  const handleSubmit = async () => {
    if (!missionId) return;

    if (submitted) {
      if (!attendanceId) return;
      // 수정하기
      await patchAttendance.mutateAsync({
        attendanceId,
        link: url,
        accountType,
        accountNum,
      });
      alert('미션 수정이 완료되었습니다.');
      setIsEditing(false);
    } else {
      // 생성하기
      await postBlogBonus.mutateAsync({
        missionId,
        url,
        accountType,
        accountNum,
      });
      setIsEditing(false);
      onSubmit?.();
    }
  };

  const cancelEdit = () => {
    if (attendanceLink !== url) setIsOpenModal(true);
    else setIsEditing(false);
  };

  return (
    <>
      {/* 블로그 링크 */}
      <label
        htmlFor="link"
        className="text-xsmall14 font-semibold text-neutral-0"
      >
        블로그 링크
      </label>
      <p className="mt-1 text-xsmall14">
        {isEditing
          ? '미션 링크가 잘 열리는지 확인해 주세요.'
          : '미션 제출이 완료되었습니다.'}
      </p>
      <div className="mt-3 flex items-stretch gap-4">
        <input
          type="text"
          className={clsx(
            'flex-1 cursor-text rounded-sm p-3 text-xsmall14 outline-none disabled:bg-neutral-95',
            {
              'text-neutral-400': !isEditing,
              'border-red-500': !isValidLinkValue && url && isEditing,
              'border-primary': isValidLinkValue && url && isEditing,
            },
          )}
          id="link"
          name="link"
          placeholder="링크를 입력해주세요."
          autoComplete="off"
          onChange={handleMissionLinkChanged}
          value={url}
          disabled={!isEditing}
        />
        <button
          type="button"
          className="rounded-sm bg-primary px-5 font-medium text-static-100 disabled:bg-neutral-70"
          onClick={() => {
            if (url) {
              Object.assign(document.createElement('a'), {
                target: '_blank',
                href: url,
                rel: 'noopener noreferrer',
              }).click();
              setIsLinkChecked(true);
            }
          }}
          disabled={(!url && isEditing) || !isValidLinkValue}
        >
          링크 확인
        </button>
      </div>
      {url &&
        isEditing &&
        (isLinkChecked ? (
          <div className="text-0.75-medium mt-1 text-primary">
            링크 확인을 완료하셨습니다.
          </div>
        ) : !isValidLinkValue ? (
          <div className="text-0.75-medium mt-1 text-red-500">
            URL 형식이 올바르지 않습니다.
            {!isStartedHttp && <> (https:// 또는 http://로 시작해야 합니다.)</>}
          </div>
        ) : (
          <div className="text-0.75-medium mt-1 text-primary">
            URL을 올바르게 입력하셨습니다. 링크 확인을 진행해주세요.
          </div>
        ))}

      {/* 리워드 받을 계좌번호 */}
      <label
        htmlFor="accountNum"
        className="mt-8 block text-xsmall14 font-semibold text-neutral-0"
      >
        리워드 받을 계좌번호
      </label>
      <p className="mt-1 text-xsmall14">
        리워드 받을 은행과 계좌번호를 입력해주세요. 본인 명의가 아닌 계좌로는
        리워드가 입금되지 않습니다.
      </p>
      <div className="mt-3 flex items-stretch gap-4">
        <BankSelectDropdown
          selectedBank={accountType}
          onBankSelect={(bank: string) => {
            setAccountType(bank);
          }}
          disabled={!isEditing}
        />
        <input
          type="number"
          className={clsx(
            'flex-1 cursor-text rounded-sm p-3 text-xsmall14 outline-none disabled:bg-neutral-95',
            {
              'text-neutral-400': !isEditing,
            },
          )}
          id="accountNum"
          name="accountNum"
          placeholder="계좌번호를 입력해주세요."
          autoComplete="off"
          onChange={(e) => setAccountNum(e.target.value)}
          value={accountNum}
          disabled={!isEditing}
        />
      </div>

      {/* 개인정보 활용 동의 */}
      <label
        htmlFor="privacyConsent"
        className="mt-8 block text-xsmall14 font-semibold text-neutral-0"
      >
        개인정보 활용 동의
      </label>
      <p className="mt-1 text-xsmall14">
        [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로 개인정보를
        수집, 이용 및 제공하는데 동의합니다. <br />
        □ 개인정보의 수집 및 이용에 관한 사항 <br />
        ✓ 수집하는 개인정보 항목 : 성명, 전화번호, 계좌번호 <br />
        ✓ 개인정보의 이용 목적 : 렛츠커리어 프로그램 후기 리워드 지급
      </p>
      <button
        type="button"
        className="mt-3 flex items-center gap-1 disabled:opacity-60"
        disabled={submitted}
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

      {/* 미션 제출 버튼 */}
      <div className="mt-6 flex gap-x-6">
        {submitted && (
          <button
            type="button"
            className="h-12 flex-1 rounded-md border border-gray-50 bg-white px-6 py-3 text-center text-small18 font-medium disabled:bg-gray-50 disabled:text-gray-600"
            onClick={() => {
              if (isEditing) {
                cancelEdit();
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
          type="button"
          className="h-12 flex-1 rounded-md bg-primary px-6 py-3 text-center text-small18 font-medium text-white disabled:bg-neutral-70 disabled:text-white"
          disabled={!isSubmittable}
          onClick={handleSubmit}
        >
          {isEditing ? '미션 제출' : '제출 완료'}
        </button>
      </div>

      <LinkChangeConfirmationModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onClickCancel={() => setIsOpenModal(false)}
        onClickConfirm={() => {
          setUrl(attendanceLink ?? '');
          setIsEditing(false);
          setIsOpenModal(false);
        }}
      />
    </>
  );
};

export default BonusMissionInputSection;
