import { useEffect, useRef } from 'react';

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

  const handleNextButtonClick = () => {
    setContentIndex(contentIndex + 1);
  };

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
        className="flex max-h-[20rem] flex-col gap-3"
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
      <button
        className="flex w-full justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
        onClick={handleNextButtonClick}
      >
        다음
      </button>
    </div>
  );
};

export default InputContent;
