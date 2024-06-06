import { useCallback, useEffect, useReducer, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';

import {
  PROGRAM_FILTER_CLASSIFICATION,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_QUERY_KEY,
} from '../../../utils/programConst';
import axios from '../../../utils/axios';
import {
  IProgram,
  filterClassificationkey,
  filterStatuskey,
  filterTypekey,
} from '../../../interfaces/interface';
import ProgramCard from '../../../components/common/program/programs/card/ProgramCard';
import Banner from '../../../components/common/program/banner/Banner';
import FilterItem from '../../../components/common/program/filter/FilterItem';
import FilterSideBar from '../../../components/common/program/filter/FilterSideBar';
import {
  filterTypeReducer,
  initialFilterType,
  filterStatusReducer,
  initialFilterStatus,
  filterClassificationReducer,
  initialFilterClassification,
} from '../../../reducers/filterReducer';
import { getKeyByValue } from '../../../utils/convert';
import MuiPagination from '../../../components/common/program/pagination/MuiPagination';
import EmptyCardList from '../../../components/common/program/programs/card/EmptyCardList';

const initialPageable = { page: 0, size: 12 };
const initialPageInfo = {
  pageNum: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};

const Programs = () => {
  // 필터링 상태 관리
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filterClassification, classificationDispatch] = useReducer(
    filterClassificationReducer,
    initialFilterClassification,
  ); // 커리어 단계
  const [filterType, typeDispatch] = useReducer(
    filterTypeReducer,
    initialFilterType,
  ); // 프로그램
  const [filterStatus, statusDispatch] = useReducer(
    filterStatusReducer,
    initialFilterStatus,
  ); // 모집 현황

  // 필터에 따라 검색 파라미터 설정
  useEffect(() => {
    searchParams.delete(PROGRAM_QUERY_KEY.CLASSIFICATION);
    Object.entries(filterClassification).forEach(([key, value]) => {
      if (value === true)
        searchParams.append(PROGRAM_QUERY_KEY.CLASSIFICATION, key);
    });
    setSearchParams(searchParams);
  }, [filterClassification]);
  useEffect(() => {
    searchParams.delete(PROGRAM_QUERY_KEY.TYPE);
    for (const [key, value] of Object.entries(filterType)) {
      if (value === true) {
        searchParams.set(PROGRAM_QUERY_KEY.TYPE, key);
        break;
      }
    }
    setSearchParams(searchParams);
  }, [filterType]);
  useEffect(() => {
    searchParams.delete(PROGRAM_QUERY_KEY.STATUS);
    Object.entries(filterStatus).forEach(([key, value]) => {
      if (value === true) searchParams.append(PROGRAM_QUERY_KEY.STATUS, key);
    });
    setSearchParams(searchParams);
  }, [filterStatus]);

  // 필터링 체크박스 클릭 이벤트
  const handleClickCheckbox = useCallback(
    (programType: string, value: string) => {
      switch (programType) {
        case PROGRAM_QUERY_KEY.CLASSIFICATION: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_CLASSIFICATION, value);
          classificationDispatch({
            type: 'toggle',
            value: filterKey,
          });
          break;
        }
        case PROGRAM_QUERY_KEY.TYPE: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_TYPE, value);
          type keyType = keyof typeof filterType;
          typeDispatch({ type: 'init' });
          typeDispatch({
            type: filterType[filterKey as keyType] ? 'uncheck' : 'check',
            value: filterKey,
          });
          break;
        }
        case PROGRAM_QUERY_KEY.STATUS: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_STATUS, value);
          statusDispatch({
            type: 'toggle',
            value: filterKey,
          });
          break;
        }
      }
    },
    [filterType, filterClassification, filterStatus],
  );

  // 필터링 초기화
  const resetFilter = useCallback(() => {
    typeDispatch({ type: 'init' });
    classificationDispatch({ type: 'init' });
    statusDispatch({ type: 'init' });
    searchParams.delete(PROGRAM_QUERY_KEY.CLASSIFICATION);
    searchParams.delete(PROGRAM_QUERY_KEY.TYPE);
    searchParams.delete(PROGRAM_QUERY_KEY.STATUS);
    setSearchParams(searchParams);
  }, []);

  const cancelFilter = useCallback((key: string, value: string) => {
    switch (key) {
      case PROGRAM_QUERY_KEY.CLASSIFICATION: {
        const filterKey = getKeyByValue(PROGRAM_FILTER_CLASSIFICATION, value);
        classificationDispatch({ type: 'uncheck', value: filterKey });
        break;
      }
      case PROGRAM_QUERY_KEY.TYPE: {
        const filterKey = getKeyByValue(PROGRAM_FILTER_TYPE, value);
        typeDispatch({ type: 'uncheck', value: filterKey });
        break;
      }
      case PROGRAM_QUERY_KEY.STATUS: {
        const filterKey = getKeyByValue(PROGRAM_FILTER_STATUS, value);
        statusDispatch({ type: 'uncheck', value: filterKey });
        break;
      }
    }
  }, []);

  // 페이지 상태 관리
  const [pageable, setPageable] = useState(initialPageable);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  // 프로그램 리스트 싱태 관리
  const [programList, setProgramList] = useState<IProgram[]>([]);

  // 프로그램 리스트 가져오기
  const getProgramList = async () => {
    const pageableQuery = Object.entries({
      ...pageable,
    })?.map(([key, value]) => `${key}=${value}`);
    try {
      const res = await axios.get(
        `/program?${pageableQuery.join('&')}&${searchParams.toString()}`,
      );
      if (res.status === 200) {
        setProgramList(res.data.data.programList);
        setPageInfo(res.data.data.pageInfo);
        return res.data;
      }
      throw new Error(`${res.status} ${res.statusText}`);
    } catch (error) {
      console.error(error);
    }
  };
  const { isLoading } = useQuery({
    queryKey: ['program', pageable.page, searchParams.toString()],
    queryFn: getProgramList,
  });

  return (
    <div className="flex">
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
          'flex w-full max-w-[99vw] flex-col gap-16 px-5 py-8 md:px-10 lg:px-[10%]',
        )}
      >
        {/* 상단 필터 */}
        <section className="flex flex-col gap-3 md:flex-row">
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
              <span className="text-0.75-medium text-neutral-40">초기화</span>
            </div>
          </div>
          <div className="flex h-auto w-full flex-nowrap items-center gap-4 overflow-scroll py-2 md:h-20 md:overflow-auto md:rounded-lg md:bg-neutral-90 md:px-5 md:py-2">
            {/* 초기화 버튼 */}
            <div
              onClick={resetFilter}
              className="hidden cursor-pointer items-center gap-2 md:flex"
            >
              <img
                className="w-6"
                src="/icons/redo.svg"
                alt="필터 초기화 아이콘"
              />
              <span className="text-0.875-semibold text-neutral-40">
                초기화
              </span>
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

        {/* 프로그램 리스트 없을 때 */}
        {!isLoading && programList.length === 0 && (
          <p className="text-1 py-2 text-center text-neutral-0/40">
            찾으시는 프로그램이 아직 없어요ㅜㅡㅜ
            <span className="flex flex-col md:flex-row md:justify-center md:gap-1">
              <span>알림 신청을 통해</span>
              <span>가장 먼저 신규 프로그램 소식을 받아보세요!</span>
            </span>
          </p>
        )}
        {!isLoading && programList.length === 0 && (
          <section className="lg:xl-[10%] grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 md:gap-4">
            <EmptyCardList />
          </section>
        )}

        <section className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
          {/* 전체 프로그램 리스트 */}
          {isLoading ? (
            <></>
          ) : (
            programList.map((program: IProgram) => (
              <ProgramCard
                key={program.programInfo.programType + program.programInfo.id}
                program={program}
              />
            ))
          )}
        </section>

        <MuiPagination pageInfo={pageInfo} setPageable={setPageable} />
        <Banner />
      </main>
    </div>
  );
};

export default Programs;
