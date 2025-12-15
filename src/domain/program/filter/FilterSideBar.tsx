import clsx from 'clsx';
import React from 'react';

import { IFilter } from '../../../types/interface';
import { getKeyByValue } from '../../../utils/convert';
import {
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_QUERY_KEY,
} from '../../../utils/programConst';
import FilterCheckbox from './FilterCheckbox';

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
    <div>
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
          'fixed left-0 top-0 z-50 flex h-full min-h-screen w-full flex-col gap-5 overflow-y-auto bg-neutral-90 p-10 transition-transform duration-300 ease-in-out md:w-64 lg:static lg:z-0 lg:transition-none',
          {
            'translate-x-0': isOpen,
            'translate-x-[-100vw] lg:translate-x-0': !isOpen,
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
            className="cursor-pointer lg:hidden"
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
              className={clsx({
                career_filter:
                  !filterClassification[
                    getKeyByValue(
                      PROGRAM_FILTER_CLASSIFICATION,
                      value,
                    ) as string
                  ],
              })}
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
              className={clsx({
                program_filter:
                  !filterType[
                    getKeyByValue(PROGRAM_FILTER_TYPE, value) as string
                  ],
              })}
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
              className={clsx({
                recruit_filter:
                  !filterStatus[
                    getKeyByValue(PROGRAM_FILTER_STATUS, value) as string
                  ],
              })}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default FilterSideBar;
