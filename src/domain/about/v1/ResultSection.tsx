import { useEffect, useRef, useState } from 'react';

import useCounter from '../../../hooks/useCounter';
import useDecimalCounter from '../../../hooks/useDecimalCounter';
import AboutTitleDark from './ui/AboutTitleDark';

const title = {
  subTitle: '참여자 만족도 4.8점',
  mainTitle: '렛츠커리어가 이뤄낸 성과',
};

const maxProgramCount = 59;
const maxApplicationCount = 1646;
const maxSuccessCount = 162;
const maxSatisfaction = 4.8;
const defaultIncrement = 1;

const groupDigit = (num: number) => {
  return num.toLocaleString();
};

const calculateIncrement = (target: number) => {
  const min = Math.min(maxProgramCount, maxApplicationCount, maxSuccessCount);
  return Math.floor(defaultIncrement * (target / min));
};

const ResultSection = () => {
  const programRef = useRef<HTMLDivElement>(null);

  const [isCount, setIsCount] = useState(false);

  const programCount = useCounter({
    isStartCount: isCount,
    maxCount: maxProgramCount,
    increment: calculateIncrement(maxProgramCount),
  });
  const applicationCount = useCounter({
    isStartCount: isCount,
    maxCount: maxApplicationCount,
    increment: calculateIncrement(maxApplicationCount),
  });
  const successCount = useCounter({
    isStartCount: isCount,
    maxCount: maxSuccessCount,
    increment: calculateIncrement(maxSuccessCount),
  });

  const satisfaction = useDecimalCounter({
    isStartCount: isCount,
    maxCount: maxSatisfaction,
  });

  useEffect(() => {
    const handleScroll = () => {
      const current = programRef.current;
      if (current && current.getBoundingClientRect().top <= window.innerHeight)
        setIsCount(true);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="flex flex-col bg-[#101348] px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] md:items-center md:px-10 xl:py-[8.75rem]">
      <AboutTitleDark {...title} />
      <div className="mt-[3.75rem] flex w-full max-w-[50rem] flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div ref={programRef}>
          <ResultLine />
          <ResultTitle title="프로그램 수" />
          <ResultScore>{groupDigit(programCount)}개</ResultScore>
        </div>
        <div>
          <ResultLine />
          <ResultTitle title="참여자 수" />
          <ResultScore>{groupDigit(applicationCount)}명</ResultScore>
        </div>
        <div>
          <ResultLine />
          <div className="flex items-center gap-1">
            <ResultTitle title="합격자 수" />
            <span className="text-0.75 text-neutral-40">*24년 4월 기준</span>
          </div>
          <ResultScore>{groupDigit(successCount)}명</ResultScore>
        </div>
        <div>
          <ResultLine />
          <ResultTitle title="참여자 만족도" />
          <ResultScore>{satisfaction}점</ResultScore>
        </div>
      </div>
    </section>
  );
};

interface ResultTitleProps {
  title: string;
}

interface ResultScoreProps {
  children: React.ReactNode;
}

const ResultLine = () => {
  return (
    <div className="mb-3 h-0.5 w-full bg-neutral-100 md:w-32 xl:w-[8.75rem]" />
  );
};

const ResultTitle = ({ title }: ResultTitleProps) => {
  return (
    <h2 className="text-0.875-medium xl:text-1-medium text-neutral-100">
      {title}
    </h2>
  );
};

const ResultScore = ({ children }: ResultScoreProps) => {
  return <p className="text-1.75-bold mt-1 text-neutral-100">{children}</p>;
};

export default ResultSection;
