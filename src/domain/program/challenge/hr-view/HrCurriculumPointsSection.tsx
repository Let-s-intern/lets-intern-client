import { parseChallengeContent } from '@/domain/program/challenge/utils/parseChallengeContent';
import { ChallengeIdPrimitive } from '@/schema';
import { ReactNode, useMemo } from 'react';
import MainTitle from '../ui/MainTitle';
interface HrCurriculumPointsSectionProps {
  challenge: ChallengeIdPrimitive;
}

const curriculumCards = [
  {
    title: 'HR 실무 역량 Class',
    description: (
      <>
        HR 직무에서 수행해야 하는 사전 과제,
        <br />
        HR 관련 뉴스기사, 아티클 등 수집하는
        <br />
        스터디까지 지원해드려요
      </>
    ),
  },
  {
    title: '현직자의 LIVE 세미나',
    description: (
      <>
        4명의 HR 현직자 선배들이
        <br />
        어떻게 HR 커리어를 시작했는지,
        <br />그 이야기를 직접 들려드릴게요
      </>
    ),
  },
  {
    title: '챌린지를 통한 서류 완성',
    description: (
      <>
        채용 공고에 바로 지원이 가능하도록,
        <br />
        수준급의 서류를 무조건 완성해요
      </>
    ),
  },
];

const CurriculumCard = ({
  title,
  description,
  index,
  showArrow,
}: {
  title: string;
  description: ReactNode;
  index: number;
  showArrow: boolean;
}) => {
  return (
    <div className="relative flex flex-shrink-0 flex-col items-center justify-center gap-2 rounded-md bg-[#f3f3f3] px-[25px] py-[27px] md:w-full md:flex-1 md:rounded-sm">
      <span className="w-full items-center justify-center text-center text-xsmall14 font-semibold text-[#FF5E00] md:-top-7 md:px-4 md:text-small18">
        Point {index}
      </span>
      <div className="gap-[47px]text-neutral-0 flex flex-col items-center justify-center gap-10 md:gap-[47px]">
        <div className="text-small20 font-bold md:text-medium24">{title}</div>
        <div className="text-xsmall14 text-neutral-40 md:text-small18">
          {description}
        </div>
      </div>
      {showArrow && (
        <img
          src="/images/hr-double-arrow.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-10 z-10 hidden md:block md:h-[60px] md:w-[60px]"
        />
      )}
    </div>
  );
};

const HrCurriculumPointsSection: React.FC<HrCurriculumPointsSectionProps> = ({
  challenge,
}) => {
  const receivedContent = useMemo(() => {
    return parseChallengeContent(challenge.desc);
  }, [challenge.desc]);

  const weekText = receivedContent?.challengePoint?.weekText || '3주';

  return (
    <section className="flex w-full flex-col items-center pb-[70px] pt-[50px] text-center md:overflow-x-hidden md:pb-[82px] md:pt-[141px]">
      <MainTitle className="flex flex-col items-center">
        <span>누적 5,000건 이상의 피드백,</span>
        <span>100+회 챌린지 운영 노하우를 집약해</span>
        <div>
          <span className="text-[#FF5E00]">단 {weekText} 만에 끝내는 </span>
          <br className="md:hidden" />
          <span>실전형 커리큘럼을 설계했습니다.</span>
        </div>
      </MainTitle>

      {/* 카드 섹션 */}
      <div className="mt-[54px] flex w-full max-w-[1090px] flex-col gap-7 px-5 md:flex-row md:gap-5 md:overflow-x-hidden md:px-0">
        {curriculumCards.map((item, index) => (
          <CurriculumCard
            key={index}
            index={index + 1}
            showArrow={index < curriculumCards.length - 1}
            {...item}
          />
        ))}
      </div>
    </section>
  );
};

export default HrCurriculumPointsSection;
