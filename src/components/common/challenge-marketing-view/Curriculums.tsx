'use client';

import { twMerge } from '@/lib/twMerge';
import { useMediaQuery } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReactNode, useState } from 'react';
import CurriculumContent, { curriculums } from './CurriculumContent';

const Dropdown = ({
  index,
  title,
  children,
  contentClassName,
}: {
  index: number;
  title: string;
  children: ReactNode;
  contentClassName?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xs bg-white md:hidden">
      <button
        className="flex w-full items-center justify-between p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5 text-small18 font-semibold text-[#4A76FF]">
          <span>WEEK {index + 1}</span>
          <span>{title}</span>
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
            'border-neutral-80transition-all h-full duration-200 ease-out',
            isOpen
              ? `border-t p-4 pt-5 opacity-100 ${contentClassName}`
              : 'max-h-0 opacity-0',
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
      <h3
        className={
          active ? 'text-xsmall16 font-semibold' : 'text-small18 font-normal'
        }
      >
        {title}
      </h3>
    </button>
  );
};

const sidebarList = curriculums.map((item) => ({
  date: item.date,
  title: item.title,
}));

const ContentWithSidebar = () => {
  const [active, setActive] = useState(0);

  const activeContent = curriculums[active];

  return (
    <div className="hidden w-full max-w-[898px] items-stretch overflow-hidden rounded-sm bg-white md:flex">
      {/* Sidebar */}
      <div className="flex min-w-fit max-w-[398px] flex-1 shrink-0 flex-col border-r border-neutral-80 px-8 py-[30px]">
        {sidebarList.map((item, index) => (
          <SidebarButton
            key={`sidebar-button-${item.date}`}
            index={index}
            date={item.date}
            title={item.title}
            active={index === active}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
      {/* Content */}
      <div className="w-full min-w-fit flex-1 shrink-0 px-8 pb-11 pt-10">
        <CurriculumContent curriculum={activeContent} />
      </div>
    </div>
  );
};

function Curriculums() {
  const isMobile = useMediaQuery('(max-width:768px)');

  if (isMobile) {
    return (
      <div className="flex w-full flex-col items-stretch gap-3">
        {curriculums.map((item, index) => (
          <Dropdown
            key={`dropdown-${item.date}`}
            title={item.date}
            index={index}
            contentClassName={item.contentClassName}
          >
            <CurriculumContent curriculum={item} />
          </Dropdown>
        ))}
      </div>
    );
  }

  return <ContentWithSidebar />;
}

export default Curriculums;
