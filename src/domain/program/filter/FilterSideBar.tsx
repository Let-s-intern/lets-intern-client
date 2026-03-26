import clsx from 'clsx';
import React, { useState } from 'react';

import { IFilter } from '../../../types/interface';
import { getKeyByValue } from '../../../utils/convert';
import {
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_JOB,
  PROGRAM_FILTER_TYPE,
  PROGRAM_QUERY_KEY,
} from '../../../utils/programConst';
import FilterCheckbox from './FilterCheckbox';

interface FilterSideBarProps {
  isOpen: boolean;
  filterType: IFilter;
  filterClassification: IFilter;
  filterJob: IFilter;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: (key: string, value: string) => void;
  onReset: () => void;
  onApply?: () => void;
}

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const AccordionSection = ({
  title,
  defaultOpen = false,
  children,
}: AccordionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-1.5 lg:hidden"
      >
        <h2 className="text-xsmall16 font-semibold text-neutral-0">{title}</h2>
        <img
          className={clsx('transform-gpu transition-transform duration-300', {
            'scale-y-[-1]': isOpen,
          })}
          src="/icons/filter-arrow.svg"
          alt="필터"
        />
      </button>
      <h2 className="text-1-semibold hidden py-2 text-neutral-0 lg:block">
        {title}
      </h2>
      {/* 모바일: 아코디언 애니메이션 */}
      <div
        className={clsx(
          'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out lg:hidden',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div
          className={clsx(
            'min-h-0 transition-opacity duration-200',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
        >
          {children}
        </div>
      </div>

      {/* 데스크탑: 항상 열림 */}
      <div className="hidden lg:block">{children}</div>
    </section>
  );
};

const getFilterSectionsConfig = (
  filterJob: IFilter,
  filterClassification: IFilter,
  filterType: IFilter,
  handleClick: (key: string, value: string) => void,
) => [
  {
    title: '관심 직무',
    defaultOpen: true,
    items: Object.values(PROGRAM_FILTER_JOB),
    getIsChecked: (value: string) =>
      filterJob[getKeyByValue(PROGRAM_FILTER_JOB, value) as string],
    onItemClick: (value: string) => handleClick(PROGRAM_QUERY_KEY.JOB, value),
  },
  {
    title: '커리어 단계',
    defaultOpen: false,
    items: Object.values(PROGRAM_FILTER_CLASSIFICATION),
    getIsChecked: (value: string) =>
      filterClassification[
        getKeyByValue(PROGRAM_FILTER_CLASSIFICATION, value) as string
      ],
    onItemClick: (value: string) =>
      handleClick(PROGRAM_QUERY_KEY.CLASSIFICATION, value),
  },
  {
    title: '프로그램 유형',
    defaultOpen: false,
    items: Object.values(PROGRAM_FILTER_TYPE),
    getIsChecked: (value: string) =>
      filterType[getKeyByValue(PROGRAM_FILTER_TYPE, value) as string],
    onItemClick: (value: string) => handleClick(PROGRAM_QUERY_KEY.TYPE, value),
  },
];

const FilterSideBar = ({
  isOpen,
  setIsOpen,
  handleClick,
  filterType,
  filterClassification,
  filterJob,
  onReset,
  onApply,
}: FilterSideBarProps) => {
  const sections = getFilterSectionsConfig(
    filterJob,
    filterClassification,
    filterType,
    handleClick,
  );

  return (
    <>
      {/* 오버레이 배경 (모바일) */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden',
          isOpen
            ? 'opacity-25 ease-out'
            : 'pointer-events-none opacity-0 ease-in',
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* 데스크탑: 정적 사이드바 */}
      <aside className="hidden w-[161px] shrink-0 flex-col gap-5 lg:flex">
        {sections.map((section, index) => (
          <React.Fragment key={section.title}>
            <section>
              <h2 className="text-1-semibold mb-5 text-neutral-0">
                {section.title}
              </h2>
              <div className="flex flex-col gap-3">
                {section.items.map((value) => (
                  <FilterCheckbox
                    key={value}
                    caption={value}
                    isChecked={section.getIsChecked(value)}
                    onClick={() => section.onItemClick(value)}
                  />
                ))}
              </div>
            </section>
            {index < sections.length - 1 && <hr className="border-[#EFEFEF]" />}
          </React.Fragment>
        ))}
      </aside>

      {/* 모바일: 바텀시트 */}
      <div
        className={clsx(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-xl bg-static-100 transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {/* 바텀시트 헤더 */}
        <div className="flex items-center justify-between py-4 pl-5 pr-4">
          <h2 className="text-small18 font-semibold text-neutral-0">필터</h2>
          <button onClick={() => setIsOpen(false)}>
            <img src="/icons/filter-close.svg" alt="닫기" />
          </button>
        </div>

        {/* 바텀시트 콘텐츠 */}
        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-5 py-2">
          {sections.map((section) => (
            <AccordionSection
              key={section.title}
              title={section.title}
              defaultOpen={section.defaultOpen}
            >
              <div className="flex flex-col gap-1.5 pt-1.5">
                {section.items.map((value) => (
                  <FilterCheckbox
                    key={value}
                    caption={value}
                    isChecked={section.getIsChecked(value)}
                    onClick={() => section.onItemClick(value)}
                  />
                ))}
              </div>
            </AccordionSection>
          ))}
        </div>

        {/* 바텀시트 하단 버튼 */}
        <div className="flex gap-2 px-5 py-4">
          <button
            onClick={onReset}
            className="flex-1 rounded-xs border border-neutral-80 p-3 text-xsmall16 font-medium text-primary"
          >
            초기화
          </button>
          <button
            onClick={() => {
              onApply?.();
              setIsOpen(false);
            }}
            className="flex-1 rounded-xs bg-primary py-3 text-xsmall16 font-medium text-static-100"
          >
            적용하기
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSideBar;
