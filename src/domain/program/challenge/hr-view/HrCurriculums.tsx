'use client';

import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ChallengeContent, ChallengeCurriculum } from '@/types/interface';
import { useMediaQuery } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import HrCurriculumContent from './HrCurriculumContent';

interface HrCurriculumsProps {
  curriculum: ChallengeCurriculum[];
  content: ChallengeContent;
}

interface WeekGroup {
  week: string;
  weekTitle: string;
  startDate?: string;
  endDate?: string;
  items: ChallengeCurriculum[];
}

const Dropdown = ({
  index,
  date,
  title,
  children,
}: {
  index: number;
  date: string;
  title: string;
  children: React.ReactNode;
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
        <div className="flex items-center gap-2.5 text-small18 font-semibold text-[#FF5E00]">
          <span>WEEK {index + 1}</span>
          <span>{date}</span>
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
            'h-full min-w-0 overflow-x-hidden border-neutral-80',
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
          ? 'bg-[#FFF7F2] text-[#FF5E00]'
          : 'bg-transparent text-neutral-35',
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2.5 text-small18 font-semibold md:text-small20">
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

interface DesktopHrCurriculumsProps {
  groupedByWeek: WeekGroup[];
  sidebarList: {
    date: string;
    title: string;
  }[];
}

function DesktopHrCurriculums({
  groupedByWeek,
  sidebarList,
}: DesktopHrCurriculumsProps) {
  const [active, setActive] = useState(0);

  const safeActiveIndex =
    active >= 0 && active < groupedByWeek.length ? active : 0;
  const activeGroup = groupedByWeek[safeActiveIndex];

  if (!activeGroup) {
    return null;
  }

  return (
    <div className="hidden w-full max-w-[1262px] items-stretch overflow-hidden rounded-sm bg-white md:flex">
      {/* Sidebar */}
      <div className="flex min-w-fit max-w-[413px] flex-1 shrink-0 flex-col gap-[10px] border-r border-neutral-80 px-8 py-[30px]">
        {sidebarList.map((item, index) => (
          <SidebarButton
            key={`sidebar-button-${index}`}
            index={index}
            date={item.date}
            title={item.title}
            active={index === safeActiveIndex}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
      {/* Content */}
      <div className="h-[634px] min-w-0 flex-1 shrink-0 flex-col gap-3 overflow-y-auto overflow-x-hidden px-8 pb-11 pt-10">
        <HrCurriculumContent weekGroup={activeGroup} />
      </div>
    </div>
  );
}

function HrCurriculums({ curriculum, content }: HrCurriculumsProps) {
  const isMobile = useMediaQuery('(max-width:768px)');

  // 주차별로 그룹화
  const groupedByWeek = useMemo<WeekGroup[]>(() => {
    if (!content.useWeekSettings || !content.weekTitles?.length) {
      // 주차 설정이 없으면 그냥 리스트로 반환
      return [
        {
          week: '',
          weekTitle: '',
          startDate: '',
          endDate: '',
          items: curriculum,
        },
      ];
    }

    const weekMap = new Map<string, WeekGroup>();

    // 주차별로 초기화
    content.weekTitles.forEach((weekTitle) => {
      weekMap.set(weekTitle.week, {
        week: weekTitle.week,
        weekTitle: weekTitle.weekTitle,
        startDate: weekTitle.startDate,
        endDate: weekTitle.endDate,
        items: [],
      });
    });

    // 커리큘럼 아이템을 주차별로 분류
    curriculum.forEach((item) => {
      if (item.week && weekMap.has(item.week)) {
        weekMap.get(item.week)!.items.push(item);
      } else {
        // 주차가 없는 아이템은 첫 번째 그룹에 추가
        const firstWeek = Array.from(weekMap.values())[0];
        if (firstWeek) {
          firstWeek.items.push(item);
        }
      }
    });

    return Array.from(weekMap.values());
  }, [curriculum, content.useWeekSettings, content.weekTitles]);

  const sidebarList = groupedByWeek.map((group) => ({
    date:
      group.startDate && group.endDate
        ? `${dayjs(group.startDate).format('M/D')}-${dayjs(group.endDate).format('M/D')}`
        : '',
    title: group.weekTitle,
  }));

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
              <HrCurriculumContent weekGroup={group} />
            </Dropdown>
          );
        })}
      </div>
    );
  }

  return (
    <DesktopHrCurriculums
      groupedByWeek={groupedByWeek}
      sidebarList={sidebarList}
    />
  );
}

export default HrCurriculums;
