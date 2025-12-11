import { UserInfo } from '@/lib/order';
import { useEffect, useState } from 'react';
import { ProgramType } from '../../../../../types/common';
import { IApplyDrawerAction } from '../../../../../types/interface';
import MotiveAnswerSection from '../section/MotiveAnswerSection';
import UserInputSection from '../section/UserInputSection';

interface PaymentInputContentProps {
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  programType: ProgramType;
  drawerDispatch?: (value: IApplyDrawerAction) => void;
}

const PaymentInputContent = ({
  contentIndex,
  setContentIndex,
  userInfo,
  setUserInfo,
  programType,
}: PaymentInputContentProps) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [contactEmail, setContactEmail] = useState(userInfo.contactEmail);

  const handleNextButtonClick = () => {
    setUserInfo({
      ...userInfo,
      contactEmail,
    });
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(userInfo.contactEmail)) {
      alert('렛츠커리어 정보 수신용 이메일의 형식이 올바르지 않습니다.');
      return;
    }

    setContentIndex(contentIndex + 2);
  };

  const handleBackButtonClick = () => {
    if (contentIndex === 1) setContentIndex(contentIndex - 1);
    if (contentIndex === 2) setContentIndex(contentIndex - 2);
  };

  useEffect(() => {
    if (
      userInfo.name &&
      userInfo.email &&
      userInfo.phoneNumber &&
      userInfo.contactEmail
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [userInfo]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex h-full flex-col gap-3">
        <p className="text-xsmall16 font-semibold text-neutral-0">
          신청 폼을 모두 입력해주세요.
        </p>
        <div className="flex flex-col gap-2.5">
          <UserInputSection
            userInfo={userInfo}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
          />
          {programType !== 'challenge' && (
            <MotiveAnswerSection
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark disabled:border-neutral-70 disabled:bg-neutral-70 disabled:text-white"
          onClick={handleBackButtonClick}
          disabled={contentIndex === 0}
        >
          이전 단계로
        </button>
        <button
          className="next_button flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 disabled:border-neutral-70 disabled:bg-neutral-70"
          onClick={handleNextButtonClick}
          disabled={buttonDisabled}
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default PaymentInputContent;
