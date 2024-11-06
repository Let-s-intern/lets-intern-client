import clsx from 'clsx';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

import { useUserProgramQuery } from '../../../api/program';
import Banner from '../../../components/common/program/banner/Banner';
import FilterItem from '../../../components/common/program/filter/FilterItem';
import FilterSideBar from '../../../components/common/program/filter/FilterSideBar';
import MuiPagination from '../../../components/common/program/pagination/MuiPagination';
import EmptyCardList from '../../../components/common/program/programs/card/EmptyCardList';
import ProgramCard from '../../../components/common/program/programs/card/ProgramCard';
import LoadingContainer from '../../../components/common/ui/loading/LoadingContainer';
import {
  filterClassificationReducer,
  filterStatusReducer,
  filterTypeReducer,
  initialFilterClassification,
  initialFilterStatus,
  initialFilterType,
} from '../../../reducers/filterReducer';
import {
  filterClassificationkey,
  filterStatuskey,
  filterTypekey,
} from '../../../types/interface';
import { getKeyByValue } from '../../../utils/convert';
import {
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_QUERY_KEY,
} from '../../../utils/programConst';

const initialPageable = { page: 1, size: 12 };
const initialPageInfo = {
  pageNum: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};
const ERROR_MESSAGE =
  "프로그램 조회 중 오류가 발생했습니다.\n새로고침 후에도 문제가 지속되면 아래 '채팅문의'를 통해 문의해주세요.";

const Programs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageable, setPageable] = useState(initialPageable);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  const {
    isSuccess,
    isFetching,
    isLoading,
    isError,
    data: programData,
  } = useUserProgramQuery({ pageable, searchParams });

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
      // 파라미터 하나 삭제
      const deleteParam = (target: string, key: string) => {
        const checkedList = [...searchParams.getAll(key)];
        searchParams.delete(key);
        checkedList.forEach((item) => {
          if (item !== target) searchParams.append(key, item);
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
            searchParams.append(
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

          // 파라미터 설정
          searchParams.delete(PROGRAM_QUERY_KEY.TYPE);
          typeDispatch({ type: 'init' });
          if (!isChecked) {
            searchParams.set(PROGRAM_QUERY_KEY.TYPE, filterKey as string);
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
            searchParams.append(PROGRAM_QUERY_KEY.STATUS, filterKey as string);
            statusDispatch({ type: 'check', value: filterKey });
          }
          break;
        }
      }
      resetPageable();
      setSearchParams(searchParams);
    },
    [
      filterClassification,
      filterStatus,
      filterType,
      searchParams,
      setSearchParams,
    ],
  );

  // 필터링 초기화
  const resetFilter = () => {
    typeDispatch({ type: 'init' });
    classificationDispatch({ type: 'init' });
    statusDispatch({ type: 'init' });
    searchParams.delete(PROGRAM_QUERY_KEY.CLASSIFICATION);
    searchParams.delete(PROGRAM_QUERY_KEY.TYPE);
    searchParams.delete(PROGRAM_QUERY_KEY.STATUS);
    setSearchParams(searchParams);
  };

  const cancelFilter = (key: string, value: string) => {
    // 파라미터 하나 삭제
    const deleteParam = (target: string, key: string) => {
      const checkedList = [...searchParams.getAll(key)];
      searchParams.delete(key);
      checkedList.forEach((item) => {
        if (item !== target) searchParams.append(key, item);
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
        searchParams.delete(PROGRAM_QUERY_KEY.TYPE);
        typeDispatch({ type: 'init' });
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
    setSearchParams(searchParams);
  };

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      setPageable((prev) => ({ ...prev, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
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

  useEffect(() => {
    if (isLoading || isFetching) setLoading(true);
    setPageInfo(programData?.pageInfo || initialPageInfo);
  }, [isLoading, isFetching]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (isError) alert(ERROR_MESSAGE);
  }, [isError]);

  return (
    <div className={clsx('flex', { 'overflow-hidden': isOpen })}>
      <Helmet>
        <meta name="robots" content="index,follow" />
        <title>프로그램 목록 | 렛츠커리어</title>
        <link rel="canonical" href={`${window.location.origin}/program`} />
        <meta
          name="description"
          content="렛츠커리어의 프로그램 목록 페이지입니다."
        />
        <meta property="og:title" content="프로그램 목록 | 렛츠커리어" />
        <meta property="og:url" content={`${window.location.origin}/program`} />
        <meta property="og:site_name" content="렛츠커리어" />
        <meta property="og:locale" content="ko-KR" />
        <meta
          property="og:description"
          content="렛츠커리어의 프로그램 목록 페이지입니다."
        />
        <meta name="twitter:title" content="프로그램 목록 | 렛츠커리어" />
        <meta
          name="twitter:url"
          content={`${window.location.origin}/program`}
        />
        <meta
          name="twitter:description"
          content="렛츠커리어의 프로그램 목록 페이지입니다."
        />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      {/* 필터링 사이드바 */}
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
              <img
                className="w-4"
                src="/icons/redo.svg"
                alt="필터 초기화 아이콘"
              />
              <span className="text-0.75-medium w-9 text-neutral-40">
                초기화
              </span>
            </div>
          </div>
          <div className="mx-auto flex h-fit w-full items-center gap-4 overflow-auto py-4 md:min-h-[4.6rem] md:rounded-lg md:bg-neutral-90 md:px-5 md:py-2">
            {/* 초기화 버튼 */}
            <div
              onClick={resetFilter}
              className="hidden min-w-max cursor-pointer items-center gap-2 md:flex"
            >
              <img
                className="w-5"
                src="/icons/redo.svg"
                alt="필터 초기화 아이콘"
              />
              <div className="text-0.875-semibold text-neutral-40">초기화</div>
            </div>
            {/* 파라미터에 따라 필터 표시 */}
            {searchParams
              .getAll(PROGRAM_QUERY_KEY.CLASSIFICATION)
              .map((item) => (
                <FilterItem
                  programType={PROGRAM_QUERY_KEY.CLASSIFICATION}
                  handleClick={cancelFilter}
                  key={item}
                  caption={
                    PROGRAM_FILTER_CLASSIFICATION[
                      item as filterClassificationkey
                    ]
                  }
                />
              ))}
            {searchParams.get(PROGRAM_QUERY_KEY.TYPE) && (
              <FilterItem
                programType={PROGRAM_QUERY_KEY.TYPE}
                handleClick={cancelFilter}
                key={PROGRAM_QUERY_KEY.TYPE}
                caption={
                  PROGRAM_FILTER_TYPE[
                    searchParams.get(PROGRAM_QUERY_KEY.TYPE)! as filterTypekey
                  ]
                }
              />
            )}
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
        {loading || isLoading || isFetching ? (
          <LoadingContainer text="프로그램 조회 중" />
        ) : (
          isSuccess &&
          programData &&
          (programData.programList.length < 1 ? (
            <>
              <p className="text-1 py-2 text-center text-neutral-0/40">
                혹시, 찾으시는 프로그램이 없으신가요?
                <span className="flex flex-col md:flex-row md:justify-center md:gap-1">
                  <span>
                    출시 알림 신청을 통해 가장 먼저 신규 프로그램 소식을
                    받아보세요.
                  </span>
                </span>
              </p>
              <section className="grid w-full grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 md:gap-4">
                <EmptyCardList />
              </section>
            </>
          ) : (
            <>
              <section className="min-h-2/4 mb-4 grid grid-cols-2 gap-x-4 gap-y-5 md:mb-0 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                {programData.programList.map((program) => (
                  <ProgramCard
                    key={
                      program.programInfo.programType + program.programInfo.id
                    }
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
          ))
        )}
        <Banner />
      </main>
    </div>
  );
};

export default Programs;
