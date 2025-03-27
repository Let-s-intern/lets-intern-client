import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ChallengeCurriculum as ChallengeCurriculumType } from '@/types/interface';
import { challengeColors } from '@components/ChallengeView';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';
import { useMediaQuery } from '@mui/material';
import { CSSProperties, useMemo, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const {
  PORTFOLIO,
  CAREER_START,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
} = challengeTypeSchema.enum;

interface ChallengeCurriculumProps {
  curriculum: ChallengeCurriculumType[];
  challengeType: ChallengeType;
  challengeTitle: string;
}

function ChallengeCurriculum({
  curriculum,
  challengeType,
  challengeTitle,
}: ChallengeCurriculumProps) {
  const iconName = useMemo(() => {
    switch (challengeType) {
      case PORTFOLIO:
        return 'folder-icon-portfolio.svg';
      case CAREER_START:
        return 'folder-icon-career-start.svg';
      case EXPERIENCE_SUMMARY:
        return 'folder-icon-experience-summary.svg';
      // 자소서
      default:
        return 'folder-icon-personal-statement.svg';
    }
  }, [challengeType]);

  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          superTitleStyle: { color: challengeColors._4D55F5 },
          titleStyle: { color: challengeColors._4D55F5 },
          curriculumDateStyle: { color: challengeColors._4D55F5 },
        };
      case PORTFOLIO:
        return {
          superTitleStyle: { color: challengeColors._4A76FF },
          titleStyle: { color: challengeColors.F8AE00 },
          curriculumDateStyle: { color: challengeColors._4A76FF },
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          superTitleStyle: { color: challengeColors._14BCFF },
          titleStyle: { color: challengeColors.FF9C34 },
          curriculumDateStyle: { color: challengeColors._14BCFF },
        };
      case EXPERIENCE_SUMMARY:
        return {
          superTitleStyle: { color: challengeColors.F26646 },
          titleStyle: { color: challengeColors.F26646 },
          curriculumDateStyle: { color: challengeColors.F26646 },
        };
      default:
        return {
          superTitleStyle: { color: challengeColors._14BCFF },
          titleStyle: { color: challengeColors.FF9C34 },
          curriculumDateStyle: { color: challengeColors._14BCFF },
        };
    }
  }, [challengeType]);

  if (!curriculum || !curriculum[0]) {
    return <></>;
  }

  const title = `기초부터 결과물까지 가져가는 완벽한\n${challengeTitle} 커리큘럼`;

  return (
    <div className="flex w-full max-w-[1000px] flex-col px-5 py-20 md:items-center md:py-32 md:pb-36 lg:px-0">
      <SuperTitle className="mb-6 md:mb-12" style={styles.superTitleStyle}>
        커리큘럼
      </SuperTitle>
      <div
        className="mb-4 flex w-fit gap-x-2 rounded-sm bg-white px-2 py-1 text-xsmall14 font-bold sm:items-center md:gap-x-3 md:rounded-md md:px-4 md:py-2.5 md:text-[18px]"
        style={styles.titleStyle}
      >
        <img
          className="h-6 w-6 md:h-8 md:w-8"
          src={`/icons/${iconName}`}
          alt=""
        />
        {challengeTitle}에서는
        <br className="sm:hidden" /> 이런 걸 가져갈 수 있어요
      </div>
      <Heading2 className="mb-10 whitespace-pre-line md:mb-16">
        {title}
      </Heading2>

      <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8">
        {curriculum.map((item) => (
          <CurriculumItem
            key={item.id}
            item={item}
            dateStyle={styles.curriculumDateStyle}
          />
        ))}
      </div>
    </div>
  );
}

function CurriculumItem({
  item,
  dateStyle,
}: {
  item: ChallengeCurriculumType;
  dateStyle?: CSSProperties;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [isOpen, setIsOpen] = useState(isDesktop ? true : false);

  return (
    <div
      key={item.id}
      className="h-fit rounded-md bg-white p-5 pt-4 md:shadow-06"
    >
      <div
        className="mb-2 flex items-center gap-2.5 text-xsmall16 font-semibold md:text-small20"
        style={dateStyle}
      >
        <span>{item.session}</span>
        <span>
          {dayjs(item.startDate).format('M/D')}-
          {dayjs(item.endDate).format('M/D')}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-small18 font-bold text-neutral-0 md:text-medium22">
          {item.title}
        </span>
        <IoIosArrowDown
          className={twMerge('cursor-pointer', isOpen && 'rotate-180')}
          color="#ACAFB6"
          size={24}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="mt-3.5 whitespace-pre-line rounded-md bg-neutral-100 px-4 py-3 text-xsmall14 font-semibold text-neutral-0 md:px-4 md:py-8 md:text-small20">
          {item.content}
        </div>
      )}
    </div>
  );
}

export default ChallengeCurriculum;
