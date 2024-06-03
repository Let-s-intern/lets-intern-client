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
    <div
      className={clsx(
        'absolute z-10 flex h-full w-full flex-col gap-5 bg-neutral-90 p-10 transition ease-in-out',
        {
          'translate-x-0': isOpen,
          'translate-x-[-100vw]': !isOpen,
        },
        isOpen ? 'translate-x-0' : 'translate-x-[-100vw]',
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
            onClick={() => handleClick(PROGRAM_QUERY_KEY.CLASSIFICATION, value)}
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
  );
};

export default FilterSideBar;
