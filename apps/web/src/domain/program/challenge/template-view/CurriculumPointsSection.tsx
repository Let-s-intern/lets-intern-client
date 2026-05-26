import DoubleArrow from '@/assets/icons/double-arrow.svg';
import { ChallengeContent } from '@/types/interface';
import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';
import { CurriculumPointsSectionConfig } from './types';

const DEFAULT_LECTURE_COUNT = 5;

const CurriculumCard = ({
  title,
  description,
  index,
  showArrow,
  primaryColor,
}: {
  title: string;
  description: ReactNode;
  index: number;
  showArrow: boolean;
  primaryColor: string;
}) => {
  return (
    <div className="relative flex flex-shrink-0 flex-col items-center justify-center gap-2 rounded-md bg-[#f3f3f3] px-[25px] py-[27px] md:w-full md:flex-1 md:rounded-sm">
      <span
        className="text-xsmall14 md:text-small18 w-full items-center justify-center text-center font-semibold md:-top-7 md:px-4"
        style={{ color: primaryColor }}
      >
        Point {index}
      </span>
      <div className="gap-[47px]text-neutral-0 flex flex-col items-center justify-center gap-10 md:gap-[47px]">
        <div className="text-small20 md:text-medium24 font-bold">{title}</div>
        <div className="text-xsmall14 text-neutral-40 md:text-small18">
          {description}
        </div>
      </div>
      {showArrow && (
        <DoubleArrow
          className="absolute -right-10 z-10 hidden md:block md:h-[60px] md:w-[60px]"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

interface Props {
  config: CurriculumPointsSectionConfig;
  content: ChallengeContent | null;
}

function CurriculumPointsSection({ config, content }: Props) {
  const weekText = content?.challengePoint?.weekText ?? '3주';
  const lectureCount = content?.lectures?.length ?? DEFAULT_LECTURE_COUNT;
  const { primaryColor, getTitle, getCurriculumCards } = config;
  const curriculumCards = getCurriculumCards?.(lectureCount);

  return (
    <section className="flex w-full flex-col items-center pb-[70px] pt-[50px] text-center md:overflow-x-hidden md:pb-[82px] md:pt-[141px]">
      <MainTitle className="flex flex-col items-center">
        {getTitle(weekText)}
      </MainTitle>

      {curriculumCards && (
        <div className="mt-[54px] flex w-full max-w-[1090px] flex-col gap-7 px-5 md:flex-row md:gap-5 md:overflow-x-hidden md:px-0">
          {curriculumCards.map((item, index) => (
            <CurriculumCard
              key={index}
              index={index + 1}
              showArrow={index < curriculumCards.length - 1}
              primaryColor={primaryColor}
              {...item}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CurriculumPointsSection;
