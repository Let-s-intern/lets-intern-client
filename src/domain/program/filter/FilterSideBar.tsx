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
        className="flex w-full items-center justify-between py-3 lg:hidden"
      >
        <h2 className="text-1.125-semibold text-neutral-10">{title}</h2>
        <img
          className={clsx('w-5 transition-transform', {
            'rotate-180': isOpen,
          })}
          src="/icons/chevron-down.svg"
          alt="토글"
        />
      </button>
      {/* 데스크탑: 항상 열림 */}
      <h2 className="text-1-semibold mb-2 hidden text-neutral-10 lg:block">
        {title}
      </h2>
      <div className={clsx('lg:block', { hidden: !isOpen, block: isOpen })}>
        {children}
      </div>
    </section>
  );
};

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
  return (
    <>
      {/* 오버레이 배경 (모바일) */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden',
          isOpen
            ? 'opacity-50 ease-out'
            : 'pointer-events-none opacity-0 ease-in',
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* 데스크탑: 정적 사이드바 */}
      <aside className="hidden w-56 shrink-0 flex-col gap-6 py-8 lg:flex">
        <FilterSections
          filterJob={filterJob}
          filterClassification={filterClassification}
          filterType={filterType}
          handleClick={handleClick}
        />
      </aside>

      {/* 모바일: 바텀시트 */}
      <div
        className={clsx(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-xl bg-static-100 transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {/* 바텀시트 헤더 */}
        <div className="flex items-center justify-between border-b border-neutral-85 px-6 py-4">
          <h2 className="text-1.25-semibold text-neutral-10">필터</h2>
          <button onClick={() => setIsOpen(false)} className="p-1">
            <img className="w-6" src="/icons/close.svg" alt="닫기" />
          </button>
        </div>

        {/* 바텀시트 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <AccordionSection title="관심 직무" defaultOpen>
            {Object.values(PROGRAM_FILTER_JOB).map((value) => (
              <FilterCheckbox
                key={value}
                caption={value}
                isChecked={
                  filterJob[
                    getKeyByValue(PROGRAM_FILTER_JOB, value) as string
                  ]
                }
                onClick={() => handleClick(PROGRAM_QUERY_KEY.JOB, value)}
              />
            ))}
          </AccordionSection>
          <hr className="border-neutral-85" />
          <AccordionSection title="커리어 단계">
            {Object.values(PROGRAM_FILTER_CLASSIFICATION).map((value) => (
              <FilterCheckbox
                key={value}
                caption={value}
                isChecked={
                  filterClassification[
                    getKeyByValue(
                      PROGRAM_FILTER_CLASSIFICATION,
                      value,
                    ) as string
                  ]
                }
                onClick={() =>
                  handleClick(PROGRAM_QUERY_KEY.CLASSIFICATION, value)
                }
              />
            ))}
          </AccordionSection>
          <hr className="border-neutral-85" />
          <AccordionSection title="프로그램 유형">
            {Object.values(PROGRAM_FILTER_TYPE).map((value) => (
              <FilterCheckbox
                key={value}
                caption={value}
                isChecked={
                  filterType[
                    getKeyByValue(PROGRAM_FILTER_TYPE, value) as string
                  ]
                }
                onClick={() => handleClick(PROGRAM_QUERY_KEY.TYPE, value)}
              />
            ))}
          </AccordionSection>
        </div>

        {/* 바텀시트 하단 버튼 */}
        <div className="flex gap-3 border-t border-neutral-85 px-6 py-4">
          <button
            onClick={onReset}
            className="text-0.875-medium flex-1 rounded-sm border border-neutral-70 py-3 text-neutral-40"
          >
            초기화
          </button>
          <button
            onClick={() => {
              onApply?.();
              setIsOpen(false);
            }}
            className="text-0.875-medium flex-1 rounded-sm bg-primary py-3 text-static-100"
          >
            적용하기
          </button>
        </div>
      </div>
    </>
  );
};

const FilterSections = ({
  filterJob,
  filterClassification,
  filterType,
  handleClick,
}: {
  filterJob: IFilter;
  filterClassification: IFilter;
  filterType: IFilter;
  handleClick: (key: string, value: string) => void;
}) => (
  <>
    <section>
      <h2 className="text-1-semibold mb-2 text-neutral-10">관심 직무</h2>
      {Object.values(PROGRAM_FILTER_JOB).map((value) => (
        <FilterCheckbox
          key={value}
          caption={value}
          isChecked={
            filterJob[getKeyByValue(PROGRAM_FILTER_JOB, value) as string]
          }
          onClick={() => handleClick(PROGRAM_QUERY_KEY.JOB, value)}
        />
      ))}
    </section>
    <hr className="border-neutral-85" />
    <section>
      <h2 className="text-1-semibold mb-2 text-neutral-10">커리어 단계</h2>
      {Object.values(PROGRAM_FILTER_CLASSIFICATION).map((value) => (
        <FilterCheckbox
          key={value}
          caption={value}
          isChecked={
            filterClassification[
              getKeyByValue(PROGRAM_FILTER_CLASSIFICATION, value) as string
            ]
          }
          onClick={() =>
            handleClick(PROGRAM_QUERY_KEY.CLASSIFICATION, value)
          }
        />
      ))}
    </section>
    <hr className="border-neutral-85" />
    <section>
      <h2 className="text-1-semibold mb-2 text-neutral-10">프로그램 유형</h2>
      {Object.values(PROGRAM_FILTER_TYPE).map((value) => (
        <FilterCheckbox
          key={value}
          caption={value}
          isChecked={
            filterType[getKeyByValue(PROGRAM_FILTER_TYPE, value) as string]
          }
          onClick={() => handleClick(PROGRAM_QUERY_KEY.TYPE, value)}
        />
      ))}
    </section>
  </>
);

export default FilterSideBar;
