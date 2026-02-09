'use client';

import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ChallengeContent, ChallengeCurriculum } from '@/types/interface';
import { useMediaQuery } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';
import {
  CurriculumContent,
  getCurriculumGroupedByWeek,
} from './CurriculumContent';

interface CurriculumsProps {
  curriculum?: ChallengeCurriculum[];
  content?: ChallengeContent;
}

const Dropdown = ({
  index,
  title,
  date,
  children,
}: {
  index: number;
  title: string;
  date?: string;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(
    index === 0 || index === 1 ? true : false,
  );

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xs bg-white md:hidden">
      <button
        className="flex w-full items-center justify-between p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5 text-small18 font-semibold text-[#4A76FF]">
          <span>WEEK {index + 1}</span>
          {date ? <span>{date}</span> : <span>{title}</span>}
        </div>
        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-neutral-50" />
        ) : (
          <ChevronDown className="h-6 w-6 text-neutral-50" />
        )}
      </button>
      {isOpen && (
        <div
          className={twMerge(
            'h-full border-neutral-80',
            isOpen && 'border-t p-4 pt-5',
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const SidebarButton = ({
  index,
  date,
  title,
  active,
  onClick,
}: {
  index: number;
  date: string;
  title: string;
  active: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        'flex flex-col items-start gap-1 rounded-xs px-[30px] py-5',
        active
          ? 'bg-[#F0F4FF] text-[#4A76FF]'
          : 'bg-transparent text-neutral-35',
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2.5 text-small20 font-semibold">
        <span>WEEK {index + 1}</span>
        <span>{date}</span>
      </div>
      {title && (
        <h3
          className={
            active ? 'text-xsmall16 font-semibold' : 'text-small18 font-normal'
          }
        >
          {title}
        </h3>
      )}
    </button>
  );
};

function Curriculums({ curriculum, content }: CurriculumsProps) {
  const isMobile = useMediaQuery('(max-width:768px)');

  const groupedByWeek = useMemo(
    () => getCurriculumGroupedByWeek(curriculum, content),
    [curriculum, content],
  );

  const sidebarListFromAdmin = groupedByWeek.map((group) => ({
    date:
      group.startDate && group.endDate
        ? `${dayjs(group.startDate).format('M/D')}-${dayjs(group.endDate).format('M/D')}`
        : '',
    title: group.weekTitle,
  }));

  // 어드민 커리큘럼이 없으면 아무것도 렌더링하지 않음
  if (groupedByWeek.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="flex w-full min-w-[320px] max-w-full flex-col items-stretch gap-3 overflow-x-hidden md:hidden">
        {groupedByWeek.map((group, index) => {
          const dateRange =
            group.startDate && group.endDate
              ? `${dayjs(group.startDate).format('M/D')}-${dayjs(group.endDate).format('M/D')}`
              : '';

          return (
            <Dropdown
              key={`dropdown-${group.week || index}`}
              title={group.weekTitle}
              date={dateRange}
              index={index}
            >
              <CurriculumContent weekGroup={group} />
            </Dropdown>
          );
        })}
      </div>
    );
  }

  const ContentWithSidebar = () => {
    const [active, setActive] = useState(0);
    const activeGroup = groupedByWeek[active];

    return (
      <div className="hidden w-full max-w-[920px] items-stretch overflow-hidden rounded-sm bg-white md:flex">
        {/* Sidebar */}
        <div className="flex min-w-fit max-w-[398px] flex-1 shrink-0 flex-col border-r border-neutral-80 px-8 py-[30px]">
          {sidebarListFromAdmin.map((item, index) => (
            <SidebarButton
              key={`sidebar-button-${index}`}
              index={index}
              date={item.date}
              title={item.title}
              active={index === active}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
        {/* Content */}
        <div className="h-[634px] min-w-0 flex-1 shrink-0 flex-col gap-3 overflow-y-auto overflow-x-hidden px-8 pb-11 pt-10">
          <CurriculumContent weekGroup={activeGroup} />
        </div>
      </div>
    );
  };

  return <ContentWithSidebar />;
}

export default Curriculums;
