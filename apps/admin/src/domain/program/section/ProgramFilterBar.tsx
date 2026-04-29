import { useSearchParams } from 'react-router-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';

import FilterItem from '@/domain/program/filter/FilterItem';
import { FilterCheckedAction } from '@/reducers/filterReducer';
import {
  filterClassificationkey,
  filterJobkey,
  filterTypekey,
  IPageable,
} from '@/types/interface';
import { getKeyByValue } from '@/utils/convert';
import {
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_JOB,
  PROGRAM_FILTER_TYPE,
  PROGRAM_QUERY_KEY,
} from '@/utils/programConst';

interface ProgramFilterBarProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setPageable: Dispatch<SetStateAction<IPageable>>;
  classificationDispatch: Dispatch<FilterCheckedAction>;
  typeDispatch: Dispatch<FilterCheckedAction>;
  jobDispatch: Dispatch<FilterCheckedAction>;
  onResetAll: () => void;
}

const initialPageable = { page: 1, size: 12 };

const ProgramFilterBar = ({
  setIsOpen,
  setPageable,
  classificationDispatch,
  typeDispatch,
  jobDispatch,
  onResetAll,
}: ProgramFilterBarProps) => {
  const [searchParams] = useSearchParams();

  const resetPageable = () => {
    setPageable(initialPageable);
  };

  const cancelFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const deleteParam = (target: string, key: string) => {
      const checkedList = params.getAll(key);
      params.delete(key);
      checkedList.forEach((item) => {
        if (item !== target) params.append(key, item);
      });
    };

    switch (key) {
      case PROGRAM_QUERY_KEY.CLASSIFICATION: {
        const filterKey = getKeyByValue(PROGRAM_FILTER_CLASSIFICATION, value);
        classificationDispatch({ type: 'uncheck', value: filterKey });
        deleteParam(filterKey as string, PROGRAM_QUERY_KEY.CLASSIFICATION);
        break;
      }
      case PROGRAM_QUERY_KEY.TYPE: {
        const filterKey = getKeyByValue(PROGRAM_FILTER_TYPE, value);
        typeDispatch({ type: 'uncheck', value: filterKey });
        deleteParam(filterKey as string, PROGRAM_QUERY_KEY.TYPE);
        break;
      }
      case PROGRAM_QUERY_KEY.JOB_CATEGORY: {
        const filterKey = getKeyByValue(PROGRAM_FILTER_JOB, value);
        jobDispatch({ type: 'uncheck', value: filterKey });
        deleteParam(filterKey as string, PROGRAM_QUERY_KEY.JOB_CATEGORY);
        break;
      }
    }
    resetPageable();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params}`,
    );
  };

  useEffect(() => {
    typeDispatch({ type: 'init' });
    classificationDispatch({ type: 'init' });
    jobDispatch({ type: 'init' });

    searchParams.getAll(PROGRAM_QUERY_KEY.CLASSIFICATION).forEach((item) => {
      classificationDispatch({ type: 'check', value: item });
    });
    searchParams.getAll(PROGRAM_QUERY_KEY.TYPE).forEach((item) => {
      typeDispatch({ type: 'check', value: item });
    });
    searchParams.getAll(PROGRAM_QUERY_KEY.JOB_CATEGORY).forEach((item) => {
      jobDispatch({ type: 'check', value: item });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const hasActiveFilters =
    searchParams.getAll(PROGRAM_QUERY_KEY.CLASSIFICATION).length > 0 ||
    searchParams.getAll(PROGRAM_QUERY_KEY.TYPE).length > 0 ||
    searchParams.getAll(PROGRAM_QUERY_KEY.JOB_CATEGORY).length > 0;

  return (
    <section className="flex w-full flex-col gap-3 md:flex-row">
      <div className="flex items-center justify-between">
        <div
          onClick={() => setIsOpen(true)}
          className="flex cursor-pointer items-center gap-2 md:w-max md:px-5 lg:hidden"
        >
          <img
            className="w-4 md:w-6"
            src="/icons/filter-round.svg"
            alt="필터 아이콘"
          />
          <h1 className="text-1.125-semibold md:text-1.25-semibold text-neutral-40">
            필터
          </h1>
        </div>
        {/* 모바일: 초기화 버튼 */}
        {hasActiveFilters && (
          <div
            onClick={onResetAll}
            className="flex cursor-pointer items-center gap-2 md:hidden"
          >
            <img
              className="w-4"
              src="/icons/redo.svg"
              alt="필터 초기화 아이콘"
            />
            <span className="text-0.75-medium text-neutral-40 w-9">초기화</span>
          </div>
        )}
      </div>
      {hasActiveFilters && (
        <div className="md:bg-neutral-90 mx-auto flex h-fit w-full items-center gap-4 overflow-auto py-4 md:min-h-[4.6rem] md:rounded-lg md:px-5 md:py-2">
          {/* 초기화 버튼 */}
          <div
            onClick={onResetAll}
            className="hidden min-w-max cursor-pointer items-center gap-2 md:flex"
          >
            <img
              className="w-5"
              src="/icons/redo.svg"
              alt="필터 초기화 아이콘"
            />
            <div className="text-0.875-semibold text-neutral-40">초기화</div>
          </div>
          {searchParams.getAll(PROGRAM_QUERY_KEY.JOB_CATEGORY).map((item) => (
            <FilterItem
              programType={PROGRAM_QUERY_KEY.JOB_CATEGORY}
              handleClick={cancelFilter}
              key={item}
              caption={PROGRAM_FILTER_JOB[item as filterJobkey]}
            />
          ))}
          {searchParams.getAll(PROGRAM_QUERY_KEY.CLASSIFICATION).map((item) => (
            <FilterItem
              programType={PROGRAM_QUERY_KEY.CLASSIFICATION}
              handleClick={cancelFilter}
              key={item}
              caption={
                PROGRAM_FILTER_CLASSIFICATION[item as filterClassificationkey]
              }
            />
          ))}
          {searchParams.getAll(PROGRAM_QUERY_KEY.TYPE).map((item) => (
            <FilterItem
              programType={PROGRAM_QUERY_KEY.TYPE}
              handleClick={cancelFilter}
              key={item}
              caption={PROGRAM_FILTER_TYPE[item as filterTypekey]}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProgramFilterBar;
