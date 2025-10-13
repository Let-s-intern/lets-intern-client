'use client';

import clsx from 'clsx';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';

import { useUserProgramQuery } from '@/api/program';
import Banner from '@/components/common/program/banner/Banner';
import FilterItem from '@/components/common/program/filter/FilterItem';
import FilterSideBar from '@/components/common/program/filter/FilterSideBar';
import MuiPagination from '@/components/common/program/pagination/MuiPagination';
import EmptyCardList from '@/components/common/program/programs/card/EmptyCardList';
import ProgramCard from '@/components/common/program/programs/card/ProgramCard';
import LoadingContainer from '@/components/common/ui/loading/LoadingContainer';
import {
  FilterCheckedAction,
  filterClassificationReducer,
  filterStatusReducer,
  filterTypeReducer,
  initialFilterClassification,
  initialFilterStatus,
  initialFilterType,
} from '@/reducers/filterReducer';
import {
  filterClassificationkey,
  filterStatuskey,
  filterTypekey,
  IPageable,
} from '@/types/interface';
import { getKeyByValue } from '@/utils/convert';
import {
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_QUERY_KEY,
} from '@/utils/programConst';

const initialPageable = { page: 1, size: 12 };
const initialPageInfo = {
  pageNum: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};
const ERROR_MESSAGE =
  "프로그램 조회 중 오류가 발생했습니다.\n새로고침 후에도 문제가 지속되면 아래 '채팅문의'를 통해 문의해주세요.";

const FilterBar = ({
  setIsOpen,
  setPageable,
  classificationDispatch,
  typeDispatch,
  statusDispatch,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setPageable: Dispatch<SetStateAction<IPageable>>;
  classificationDispatch: Dispatch<FilterCheckedAction>;
  typeDispatch: Dispatch<FilterCheckedAction>;
  statusDispatch: Dispatch<FilterCheckedAction>;
}) => {
  const searchParams = useSearchParams();

  const resetPageable = () => {
    setPageable(initialPageable);
  };

  const resetFilter = () => {
    typeDispatch({ type: 'init' });
    classificationDispatch({ type: 'init' });
    statusDispatch({ type: 'init' });
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PROGRAM_QUERY_KEY.CLASSIFICATION);
    params.delete(PROGRAM_QUERY_KEY.TYPE);
    params.delete(PROGRAM_QUERY_KEY.STATUS);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const cancelFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // 파라미터 하나만 삭제
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
      case PROGRAM_QUERY_KEY.STATUS: {
        const filterKey = getKeyByValue(PROGRAM_FILTER_STATUS, value);
        statusDispatch({ type: 'uncheck', value: filterKey });
        deleteParam(filterKey as string, PROGRAM_QUERY_KEY.STATUS);
        break;
      }
    }
    resetPageable();
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  useEffect(() => {
    // 필터 초기화
    typeDispatch({ type: 'init' });
    classificationDispatch({ type: 'init' });
    statusDispatch({ type: 'init' });

    // URL 파라미터로 필터 설정
    searchParams.getAll(PROGRAM_QUERY_KEY.CLASSIFICATION).forEach((item) => {
      classificationDispatch({ type: 'check', value: item });
    });
    searchParams.getAll(PROGRAM_QUERY_KEY.TYPE).forEach((item) => {
      typeDispatch({ type: 'check', value: item });
    });
    searchParams.getAll(PROGRAM_QUERY_KEY.STATUS).forEach((item) => {
      statusDispatch({ type: 'check', value: item });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <section className="flex w-full flex-col gap-3 md:flex-row">
      <div className="flex items-center justify-between">
        <div
          onClick={() => setIsOpen(true)}
          className="flex cursor-pointer items-center gap-2 md:w-max md:px-5 lg:hidden"
        >
          <img
            className="w-4 md:w-6"
            src="/icons/filter.svg"
            alt="필터 아이콘"
          />
          <h1 className="text-1.125-semibold md:text-1.25-semibold text-neutral-40">
            필터
          </h1>
        </div>
        {/* 모바일: 초기화 버튼 */}
        <div
          onClick={resetFilter}
          className="flex cursor-pointer items-center gap-2 md:hidden"
        >
          <img className="w-4" src="/icons/redo.svg" alt="필터 초기화 아이콘" />
          <span className="text-0.75-medium w-9 text-neutral-40">초기화</span>
        </div>
      </div>
      <div className="mx-auto flex h-fit w-full items-center gap-4 overflow-auto py-4 md:min-h-[4.6rem] md:rounded-lg md:bg-neutral-90 md:px-5 md:py-2">
        {/* 초기화 버튼 */}
        <div
          onClick={resetFilter}
          className="hidden min-w-max cursor-pointer items-center gap-2 md:flex"
        >
          <img className="w-5" src="/icons/redo.svg" alt="필터 초기화 아이콘" />
          <div className="text-0.875-semibold text-neutral-40">초기화</div>
        </div>
        {/* 파라미터에 따라 필터 표시 */}
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
        {searchParams.getAll(PROGRAM_QUERY_KEY.STATUS).map((item) => (
          <FilterItem
            programType={PROGRAM_QUERY_KEY.STATUS}
            handleClick={cancelFilter}
            key={item}
            caption={PROGRAM_FILTER_STATUS[item as filterStatuskey]}
          />
        ))}
      </div>
    </section>
  );
};

const ProgramContent = ({
  pageable,
  setPageable,
}: {
  pageable: IPageable;
  setPageable: Dispatch<SetStateAction<IPageable>>;
}) => {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  const {
    isSuccess,
    isFetching,
    isLoading,
    isError,
    data: programData,
  } = useUserProgramQuery({ pageable, searchParams });

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      setPageable((prev) => ({ ...prev, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (isLoading || isFetching) setLoading(true);
    setPageInfo(programData?.pageInfo || initialPageInfo);
  }, [isLoading, isFetching, setLoading, setPageInfo, programData?.pageInfo]);

  useEffect(() => {
    const LOADING_DELAY_MS = 300;
    if (loading) {
      const timer = setTimeout(() => setLoading(false), LOADING_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (isError) {
    return <p className="whitespace-pre-line text-center">{ERROR_MESSAGE}</p>;
  }

  if (loading || isLoading || isFetching) {
    return <LoadingContainer text="프로그램 조회 중" />;
  }

  if (isSuccess && programData && programData.programList.length < 1) {
    return (
      <>
        <p className="text-1 py-2 text-center text-neutral-0/40">
          혹시, 찾으시는 프로그램이 없으신가요?
          <span className="flex flex-col md:flex-row md:justify-center md:gap-1">
            <span>
              출시 알림 신청을 통해 가장 먼저 신규 프로그램 소식을 받아보세요.
            </span>
          </span>
        </p>
        <section className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 md:gap-4">
          <EmptyCardList />
        </section>
      </>
    );
  }

  return (
    <>
      <section className="min-h-2/4 mb-4 grid grid-cols-2 gap-x-4 gap-y-5 md:mb-0 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        {programData?.programList.map((program) => (
          <ProgramCard
            key={program.programInfo.programType + program.programInfo.id}
            program={program}
          />
        ))}
      </section>
      <MuiPagination
        page={pageable.page}
        pageInfo={pageInfo}
        onChange={handlePageChange}
      />
    </>
  );
};

const Programs = () => {
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [pageable, setPageable] = useState(initialPageable);

  const [filterClassification, classificationDispatch] = useReducer(
    filterClassificationReducer,
    null,
    setFilterClassification,
  ); // 커리어 단계

  const [filterType, typeDispatch] = useReducer(
    filterTypeReducer,
    null,
    setFilterType,
  ); // 프로그램

  const [filterStatus, statusDispatch] = useReducer(
    filterStatusReducer,
    null,
    setFilterStatus,
  ); // 모집 현황

  // 필터  초기화 (URL 기준 필터 설정)
  function setFilterClassification() {
    const initial = { ...initialFilterClassification };
    searchParams.getAll(PROGRAM_QUERY_KEY.CLASSIFICATION).forEach((item) => {
      initial[item as filterClassificationkey] = true;
    });
    return initial;
  }

  function setFilterType() {
    const initial = { ...initialFilterType };
    searchParams.getAll(PROGRAM_QUERY_KEY.TYPE).forEach((item) => {
      initial[item as filterTypekey] = true;
    });
    return initial;
  }

  function setFilterStatus() {
    const initial = { ...initialFilterStatus };
    searchParams.getAll(PROGRAM_QUERY_KEY.STATUS).forEach((item) => {
      initial[item as filterStatuskey] = true;
    });
    return initial;
  }

  const resetPageable = () => {
    setPageable(initialPageable);
  };

  // 필터링 체크박스 클릭 이벤트
  const handleClickCheckbox = useCallback(
    (programType: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // 파라미터 하나 삭제
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
          // 체크된 상태일 때
          if (filterClassification[filterKey as filterClassificationkey]) {
            classificationDispatch({ type: 'uncheck', value: filterKey });
            deleteParam(filterKey as string, PROGRAM_QUERY_KEY.CLASSIFICATION);
          } else {
            // 체크가 안된 상태일 때
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

        case PROGRAM_QUERY_KEY.STATUS: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_STATUS, value);
          const isChecked = filterStatus[filterKey as filterStatuskey];
          // 체크된 상태일 때
          if (isChecked) {
            statusDispatch({ type: 'uncheck', value: filterKey });
            deleteParam(filterKey as string, PROGRAM_QUERY_KEY.STATUS);
          } else {
            // 체크가 안된 상태일 때
            params.append(PROGRAM_QUERY_KEY.STATUS, filterKey as string);
            statusDispatch({ type: 'check', value: filterKey });
          }
          break;
        }
      }
      resetPageable();
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    },
    [
      filterClassification,
      filterStatus,
      filterType,
      searchParams,
    ],
  );

  useEffect(() => {
    // 필터 초기화
    typeDispatch({ type: 'init' });
    classificationDispatch({ type: 'init' });
    statusDispatch({ type: 'init' });

    // URL 파라미터로 필터 설정
    searchParams.getAll(PROGRAM_QUERY_KEY.CLASSIFICATION).forEach((item) => {
      classificationDispatch({ type: 'check', value: item });
    });
    searchParams.getAll(PROGRAM_QUERY_KEY.TYPE).forEach((item) => {
      typeDispatch({ type: 'check', value: item });
    });
    searchParams.getAll(PROGRAM_QUERY_KEY.STATUS).forEach((item) => {
      statusDispatch({ type: 'check', value: item });
    });
  }, [searchParams]);

  return (
    <div className={clsx('flex', { 'overflow-hidden': isOpen })}>
      <FilterSideBar
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleClick={handleClickCheckbox}
        filterType={filterType}
        filterClassification={filterClassification}
        filterStatus={filterStatus}
      />

      <main
        className={clsx(
          'flex w-full flex-col items-center gap-4 px-5 py-8 md:gap-16 md:px-10 lg:px-[10%]',
        )}
      >
        {/* 상단 필터 */}
        <FilterBar
          setIsOpen={setIsOpen}
          setPageable={setPageable}
          classificationDispatch={classificationDispatch}
          typeDispatch={typeDispatch}
          statusDispatch={statusDispatch}
        />
        <ProgramContent pageable={pageable} setPageable={setPageable} />
        <Banner />
      </main>
    </div>
  );
};

export default Programs;
