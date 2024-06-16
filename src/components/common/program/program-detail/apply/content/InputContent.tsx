import { useEffect, useRef, useState } from 'react';

import { ProgramType } from '../../../../../../pages/common/program/ProgramDetail';
import { UserInfo } from '../../section/ApplySection';
import MotiveAnswerSection from '../section/MotiveAnswerSection';
import UserInputSection from '../section/UserInputSection';
import ScrollableBox from '../scrollable-box/ScrollableBox';

interface InputContentProps {
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  programType: ProgramType;
}

interface ScrollableDiv extends HTMLDivElement {
  scrollTimeout?: number;
}

const InputContent = ({
  contentIndex,
  setContentIndex,
  userInfo,
  setUserInfo,
  programType,
}: InputContentProps) => {
  const scrollableBoxRef = useRef<ScrollableDiv>(null);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  const handleNextButtonClick = () => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(userInfo.contactEmail)) {
      alert('렛츠커리어 정보 수신용 이메일의 형식이 올바르지 않습니다.');
      return;
    }
    setContentIndex(contentIndex + 1);
  };

  const handleBackButtonClick = () => {
    setContentIndex(contentIndex - 1);
  };

  useEffect(() => {
    if (
      userInfo.name &&
      userInfo.email &&
      userInfo.phoneNumber &&
      userInfo.contactEmail &&
      (programType !== 'challenge'
        ? userInfo.motivate && userInfo.question
        : true)
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [userInfo]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableBoxRef.current) {
        scrollableBoxRef.current.classList.add('scrolling');
        clearTimeout(scrollableBoxRef.current.scrollTimeout);
        scrollableBoxRef.current.scrollTimeout = setTimeout(() => {
          if (scrollableBoxRef.current) {
            scrollableBoxRef.current.classList.remove('scrolling');
          }
        }, 500) as unknown as number;
      }
    };

    const scrollableElement = scrollableBoxRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollableBoxRef]);

  return (
    <div className="flex flex-col gap-5">
      <ScrollableBox
        ref={scrollableBoxRef}
        className="flex h-full flex-col gap-3"
      >
        <p className="font-medium text-neutral-0">
          신청 폼을 모두 입력해주세요.
        </p>
        <div className="flex flex-col gap-2.5">
          <UserInputSection userInfo={userInfo} setUserInfo={setUserInfo} />
          {programType !== 'challenge' && (
            <MotiveAnswerSection
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
          )}
        </div>
      </ScrollableBox>
      <div className="flex items-center gap-2">
        <button
          className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark"
          onClick={handleBackButtonClick}
        >
          이전 단계로
        </button>
        <button
          className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 disabled:border-neutral-70 disabled:bg-neutral-70"
          onClick={handleNextButtonClick}
          disabled={buttonDisabled}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default InputContent;
