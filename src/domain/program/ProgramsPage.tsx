'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useReducer, useState } from 'react';

import FilterSideBar from '@/domain/program/filter/FilterSideBar';
import ProgramBanner from '@/domain/program/section/ProgramBanner';
import ProgramGrid from '@/domain/program/section/ProgramGrid';
import ProgramRecommendCTA from '@/domain/program/section/ProgramRecommendCTA';
import ProgramStatusTabs from '@/domain/program/section/ProgramStatusTabs';
import {
  filterClassificationReducer,
  filterJobReducer,
  filterTypeReducer,
  initialFilterClassification,
  initialFilterJob,
  initialFilterType,
} from '@/reducers/filterReducer';
import {
  filterClassificationkey,
  filterJobkey,
  filterTypekey,
} from '@/types/interface';
import { getKeyByValue } from '@/utils/convert';
import {
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_JOB,
  PROGRAM_FILTER_TYPE,
  PROGRAM_QUERY_KEY,
} from '@/utils/programConst';

const initialPageable = { page: 1, size: 12 };

const createInitialFilterState = <T extends Record<string, boolean>>(
  initialState: T,
  queryKey: string,
  searchParams: URLSearchParams,
): T => {
  const initial = { ...initialState };
  searchParams.getAll(queryKey).forEach((item) => {
    if (item in initial) {
      (initial as Record<string, boolean>)[item] = true;
    }
  });
  return initial;
};

const Programs = () => {
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [pageable, setPageable] = useState(initialPageable);
  const [statusTab, setStatusTab] = useState(
    searchParams.get(PROGRAM_QUERY_KEY.STATUS) ?? '',
  );

  const [filterClassification, classificationDispatch] = useReducer(
    filterClassificationReducer,
    null,
    () =>
      createInitialFilterState(
        initialFilterClassification,
        PROGRAM_QUERY_KEY.CLASSIFICATION,
        searchParams,
      ),
  );

  const [filterType, typeDispatch] = useReducer(filterTypeReducer, null, () =>
    createInitialFilterState(
      initialFilterType,
      PROGRAM_QUERY_KEY.TYPE,
      searchParams,
    ),
  );

  const [filterJob, jobDispatch] = useReducer(filterJobReducer, null, () =>
    createInitialFilterState(
      initialFilterJob,
      PROGRAM_QUERY_KEY.JOB,
      searchParams,
    ),
  );

  const resetPageable = () => {
    setPageable(initialPageable);
  };

  const handleStatusTabChange = (value: string) => {
    setStatusTab(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(PROGRAM_QUERY_KEY.STATUS, value);
    } else {
      params.delete(PROGRAM_QUERY_KEY.STATUS);
    }
    resetPageable();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params}`,
    );
  };

  const resetAllFilters = useCallback(() => {
    typeDispatch({ type: 'init' });
    classificationDispatch({ type: 'init' });
    jobDispatch({ type: 'init' });
    setStatusTab('');
    setPageable(initialPageable);
    const params = new URLSearchParams();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params}`,
    );
  }, []);

  const handleClickCheckbox = useCallback(
    (programType: string, value: string) => {
      const params = new URLSearchParams(window.location.search);

      const deleteParam = (target: string, key: string) => {
        const checkedList = params.getAll(key);
        params.delete(key);
        checkedList.forEach((item) => {
          if (item !== target) params.append(key, item);
        });
      };

      switch (programType) {
        case PROGRAM_QUERY_KEY.CLASSIFICATION: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_CLASSIFICATION, value);
          if (filterClassification[filterKey as filterClassificationkey]) {
            classificationDispatch({ type: 'uncheck', value: filterKey });
            deleteParam(filterKey as string, PROGRAM_QUERY_KEY.CLASSIFICATION);
          } else {
            params.append(
              PROGRAM_QUERY_KEY.CLASSIFICATION,
              filterKey as string,
            );
            classificationDispatch({ type: 'check', value: filterKey });
          }
          break;
        }

        case PROGRAM_QUERY_KEY.TYPE: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_TYPE, value);
          const isChecked = filterType[filterKey as filterTypekey];
          if (isChecked) {
            typeDispatch({ type: 'uncheck', value: filterKey });
            deleteParam(filterKey as string, PROGRAM_QUERY_KEY.TYPE);
          } else {
            params.append(PROGRAM_QUERY_KEY.TYPE, filterKey as string);
            typeDispatch({ type: 'check', value: filterKey });
          }
          break;
        }

        case PROGRAM_QUERY_KEY.JOB: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_JOB, value);
          const isChecked = filterJob[filterKey as filterJobkey];
          if (isChecked) {
            jobDispatch({ type: 'uncheck', value: filterKey });
            deleteParam(filterKey as string, PROGRAM_QUERY_KEY.JOB);
          } else {
            params.append(PROGRAM_QUERY_KEY.JOB, filterKey as string);
            jobDispatch({ type: 'check', value: filterKey });
          }
          break;
        }
      }
      resetPageable();
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${params}`,
      );
    },
    [filterClassification, filterType, filterJob],
  );

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
    searchParams.getAll(PROGRAM_QUERY_KEY.JOB).forEach((item) => {
      jobDispatch({ type: 'check', value: item });
    });

    const statusParam = searchParams.get(PROGRAM_QUERY_KEY.STATUS);
    setStatusTab(statusParam ?? '');
  }, [searchParams]);

  return (
    <div className="mw-1180 mx-auto w-full pb-[120px] pt-8 md:px-0 md:pt-12">
      <h1 className="mb-8 text-medium24 font-bold md:mb-16 md:text-xlarge28">
        프로그램
      </h1>

      <div className="flex gap-16">
        <FilterSideBar
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          handleClick={handleClickCheckbox}
          filterType={filterType}
          filterClassification={filterClassification}
          filterJob={filterJob}
          onReset={resetAllFilters}
        />

        <main className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
          <div className="flex w-full items-center">
            <ProgramStatusTabs
              selected={statusTab}
              onChange={handleStatusTabChange}
            />
            {/* 모바일: 필터 아이콘 */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex shrink-0 items-center justify-center border-b border-neutral-85 p-1 pb-2 pl-2 lg:hidden"
            >
              <img
                className="w-5 md:w-6"
                src="/icons/filter-round.svg"
                alt="필터"
              />
            </button>
          </div>
          <ProgramGrid
            pageable={pageable}
            setPageable={setPageable}
            onResetFilter={resetAllFilters}
          />
          <ProgramRecommendCTA />
          <ProgramBanner />
        </main>
      </div>
    </div>
  );
};

export default Programs;
