import clsx from 'clsx';
import React, { useCallback, useReducer } from 'react';

import {
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_NAME,
  PROGRAM_FILTER_TYPE,
} from '../../../../utils/programConst';
import FilterCheckbox from './FilterCheckbox';
import {
  filterTypeReducer,
  initialFilterType,
  filterNameReducer,
  initialFilterName,
  filterStatusReducer,
  initialFilterStatus,
} from '../../../../reducers/filterReducer';

interface FilterSideBarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterSideBar = ({ isOpen, setIsOpen }: FilterSideBarProps) => {
  const [filterType, typeDispatch] = useReducer(
    filterTypeReducer,
    initialFilterType,
  );
  const [filterName, nameDispatch] = useReducer(
    filterNameReducer,
    initialFilterName,
  );
  const [filterStatus, statusDispatch] = useReducer(
    filterStatusReducer,
    initialFilterStatus,
  );

  const handleClick = useCallback((key: string, index: number) => {
    switch (key) {
      case 'type': {
        typeDispatch({ type: 'init' });
        typeDispatch({
          type: filterType[index] ? 'uncheck' : 'check',
          index,
        });
        break;
      }
      case 'name': {
        nameDispatch({ type: 'init' });
        nameDispatch({
          type: filterName[index] ? 'uncheck' : 'check',
          index,
        });
        break;
      }
      case 'status': {
        statusDispatch({ type: 'init' });
        statusDispatch({
          type: filterStatus[index] ? 'uncheck' : 'check',
          index,
        });
        break;
      }
    }
  }, []);

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
        {Object.values(PROGRAM_FILTER_TYPE).map((value, i) => (
          <FilterCheckbox
            caption={value}
            isChecked={filterType[i]}
            onClick={() => handleClick('type', i)}
          />
        ))}
      </section>
      <section>
        <h1 className="text-1-semibold mb-2">프로그램</h1>
        {Object.values(PROGRAM_FILTER_NAME).map((value, i) => (
          <FilterCheckbox
            caption={value}
            isChecked={filterName[i]}
            onClick={() => handleClick('name', i)}
          />
        ))}
      </section>
      <section>
        <h1 className="text-1-semibold mb-2">모집 현황</h1>
        {Object.values(PROGRAM_FILTER_STATUS).map((value, i) => (
          <FilterCheckbox
            caption={value}
            isChecked={filterStatus[i]}
            onClick={() => handleClick('status', i)}
          />
        ))}
      </section>
    </div>
  );
};

export default FilterSideBar;
