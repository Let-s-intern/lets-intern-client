import clsx from 'clsx';
import React from 'react';

import {
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_QUERY_KEY,
  PROGRAM_FILTER_CLASSIFICATION,
} from '../../../../utils/programConst';
import FilterCheckbox from './FilterCheckbox';
import { IFilter } from '../../../../interfaces/interface';
import { getKeyByValue } from '../../../../utils/convert';

interface FilterSideBarProps {
  isOpen: boolean;
  filterType: IFilter;
  filterClassification: IFilter;
  filterStatus: IFilter;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: (key: string, value: string) => void;
}

const FilterSideBar = ({
  isOpen,
  setIsOpen,
  handleClick,
  filterType,
  filterClassification,
  filterStatus,
}: FilterSideBarProps) => {
  return (
    <>
      {/* 투명한 검정색 배경 */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isOpen
            ? 'opacity-50 ease-out'
            : 'pointer-events-none opacity-0 ease-in'
        }`}
      ></div>

      <div
        className={clsx(
          'fixed left-0 top-0 z-50 flex h-screen w-full flex-col gap-5 bg-neutral-90 p-10 transition-transform duration-300 ease-in-out md:w-80',
          {
            'translate-x-0': isOpen,
            'translate-x-[-100vw]': !isOpen,
          },
        )}
      >
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icons/filter.svg" alt="필터 아이콘" />
            <h1 className="text-1.125-semibold text-neutral-40">필터</h1>
          </div>
          <img
            onClick={() => setIsOpen(false)}
            className="cursor-pointer"
            src="/icons/chevron-left-duo.svg"
            alt="필터 닫기 아이콘"
          />
        </section>
        <hr />
        <section>
          <h1 className="text-1-semibold mb-2">커리어 단계</h1>
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
        <section>
          <h1 className="text-1-semibold mb-2">프로그램</h1>
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
        <section>
          <h1 className="text-1-semibold mb-2">모집 현황</h1>
          {Object.values(PROGRAM_FILTER_STATUS).map((value) => (
            <FilterCheckbox
              key={value}
              caption={value}
              isChecked={
                filterStatus[
                  getKeyByValue(PROGRAM_FILTER_STATUS, value) as string
                ]
              }
              onClick={() => handleClick(PROGRAM_QUERY_KEY.STATUS, value)}
            />
          ))}
        </section>
      </div>
    </>
  );
};

export default FilterSideBar;
