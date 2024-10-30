import dayjs from 'dayjs';
import { IoIosArrowDown } from 'react-icons/io';

import { ChallengeCurriculum as ChallengeCurriculumType } from '@/types/interface';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { twJoin } from 'tailwind-merge';

const superTitle = '취업 트랜드를 반영한 체계적인 커리큘럼';
const title = ['기초부터 결과물까지 가져가는', '완벽한 취업 준비 2주 커리큘럼'];

interface ChallengeCurriculumProps {
  curriculum: ChallengeCurriculumType[];
}

function ChallengeCurriculum({ curriculum }: ChallengeCurriculumProps) {
  const [selectedIndex, setIsSelectedIndex] = useState(0);

  const isDesktop = useMediaQuery('(min-width:991px)');

  if (curriculum === undefined) return <></>;

  return (
    <section
      id="curriculum"
      className="-mx-5 bg-neutral-95 px-5 py-16 lg:-mx-10 lg:px-10 lg:pb-36 lg:pt-28 xl:-mx-52 xl:px-52"
    >
      <SuperTitle className="mb-6 text-neutral-45 lg:mb-12">
        커리큘럼
      </SuperTitle>
      <SuperTitle className="mb-1 text-[#00A8EB]">{superTitle}</SuperTitle>
      <Heading2 className="mb-10 lg:mb-20">{title.join('\n')}</Heading2>

      {isDesktop ? (
        // 데스크탑 커리큘럼
        <div className="flex w-full overflow-hidden rounded-md bg-white">
          <div className="flex w-1/3 flex-col gap-2.5 border-r border-neutral-80 px-10 py-8">
            {curriculum.map((item, index) => (
              <SidebarMenu
                key={item.id}
                item={item}
                selected={index === selectedIndex}
                onClick={() => setIsSelectedIndex(index)}
              />
            ))}
          </div>
          <div className="w-2/3 px-16 py-10">
            <span className="text-medium24 font-bold text-neutral-0">
              {curriculum[selectedIndex].title}
            </span>
            <div className="mt-8 whitespace-pre-line bg-neutral-100 px-8 py-5">
              {curriculum[selectedIndex].content}
            </div>
          </div>
        </div>
      ) : (
        // 모바일 커리큘럼
        <div className="flex flex-col gap-4">
          {curriculum.map((item) => (
            <CurriculumItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function SidebarMenu({
  item,
  selected,
  onClick,
}: {
  item: ChallengeCurriculumType;
  selected: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      key={item.id}
      className={twJoin(
        'cursor-pointer rounded-md px-8 py-3',
        selected && 'bg-[#EEFAFF]',
      )}
      onClick={onClick}
    >
      <div className="mb-2 flex items-center gap-3 text-small20 font-semibold text-[#00A8EB]">
        <span>{item.session}</span>
        <span>
          {dayjs(item.startDate).format('M/D')}-
          {dayjs(item.endDate).format('M/D')}
        </span>
      </div>
      <span
        className={twJoin(
          'text-medium22 font-bold',
          selected ? 'text-neutral-0' : 'text-neutral-50',
        )}
      >
        {item.title}
      </span>
    </div>
  );
}

function CurriculumItem({ item }: { item: ChallengeCurriculumType }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div key={item.id} className="rounded-md bg-white p-5 pt-4">
      <div className="mb-2 flex items-center gap-2.5 text-xsmall16 font-semibold text-[#00A8EB]">
        <span>{item.session}</span>
        <span>
          {dayjs(item.startDate).format('M/D')}-
          {dayjs(item.endDate).format('M/D')}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-small18 font-bold text-neutral-0">
          {item.title}
        </span>
        <IoIosArrowDown
          className={twJoin('cursor-pointer', isOpen && 'rotate-180')}
          color="#ACAFB6"
          size={24}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="mt-3.5 whitespace-pre-line rounded-md bg-neutral-100 px-4 py-3 text-xsmall14 text-neutral-0">
          {item.content}
        </div>
      )}
    </div>
  );
}

export default ChallengeCurriculum;
