import CurriculumIcon from '@/assets/icons/curriculum.svg?react';
import { twMerge } from '@/lib/twMerge';
import { ChallengeCurriculum as ChallengeCurriculumType } from '@/types/interface';
import { ChallengeColor } from '@components/ChallengeView';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const superTitle = '취업 챌린지에서는 이런 걸 가져갈 수 있어요';
const desktopTitle = '챌린지에서는 이런 걸 가져갈 수 있어요\n';
const title = ['기초부터 결과물까지 가져가는', '완벽한 취업 준비 2주 커리큘럼'];

interface ChallengeCurriculumProps {
  curriculum: ChallengeCurriculumType[];
  colors: ChallengeColor;
}

function ChallengeCurriculum({ curriculum, colors }: ChallengeCurriculumProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!curriculum || !curriculum[0]) {
    return <></>;
  }

  return (
    <section className="flex w-full max-w-[1200px] flex-col px-5 py-20 md:items-center md:px-10 md:py-40">
      <SuperTitle className="mb-6 md:mb-12" style={{ color: colors.subTitle }}>
        커리큘럼
      </SuperTitle>
      <div
        className="mb-4 flex w-fit items-center gap-x-2 rounded-sm px-2 py-1 text-xsmall14 font-bold md:gap-x-3 md:text-[18px]"
        style={{ color: colors.primary, backgroundColor: colors.primaryLight }}
      >
        <CurriculumIcon className="h-6 w-6 md:h-8 md:w-8" />
        {superTitle}
      </div>
      <Heading2 className="mb-10 md:mb-20">
        {isDesktop && desktopTitle}
        {isDesktop ? title.join(' ') : title.join('\n')}
      </Heading2>

      <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8">
        {curriculum.map((item) => (
          <CurriculumItem key={item.id} item={item} colors={colors} />
        ))}
      </div>
    </section>
  );
}

function CurriculumItem({
  item,
  colors,
}: {
  item: ChallengeCurriculumType;
  colors: ChallengeColor;
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
        style={{ color: colors.primary }}
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
        <div className="mt-3.5 whitespace-pre-line rounded-md bg-neutral-100 px-4 py-3 text-xsmall14 text-neutral-0 md:px-4 md:py-8 md:text-small20">
          {item.content}
        </div>
      )}
    </div>
  );
}

export default ChallengeCurriculum;
