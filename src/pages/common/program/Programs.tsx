import { useCallback, useReducer, useState } from 'react';
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
import { IProgram } from '../../../interfaces/interface';
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
  const [searchParams, setSearchParams] = useSearchParams({});
  const [isOpen, setIsOpen] = useState(false);
  const [filterClassification, classificationDispatch] = useReducer(
    filterClassificationReducer,
    initialFilterClassification,
  );
  const [filterType, typeDispatch] = useReducer(
    filterTypeReducer,
    initialFilterType,
  );
  const [filterStatus, statusDispatch] = useReducer(
    filterStatusReducer,
    initialFilterStatus,
  );

  // 필터링 체크박스 클릭 이벤트
  const handleClickCheckbox = useCallback(
    (programType: string, value: string) => {
      switch (programType) {
        case PROGRAM_QUERY_KEY.CLASSIFICATION: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_CLASSIFICATION, value);
          type keyType = keyof typeof filterClassification;
          classificationDispatch({ type: 'init' });
          classificationDispatch({
            type: filterClassification[filterKey as keyType]
              ? 'uncheck'
              : 'check',
            value: filterKey,
          });
          searchParams.set(programType, filterKey as string);
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
          searchParams.set(programType, filterKey as string);
          break;
        }
        case PROGRAM_QUERY_KEY.STATUS: {
          const filterKey = getKeyByValue(PROGRAM_FILTER_STATUS, value);
          type keyType = keyof typeof filterStatus;
          statusDispatch({ type: 'init' });
          statusDispatch({
            type: filterStatus[filterKey as keyType] ? 'uncheck' : 'check',
            value: filterKey,
          });
          searchParams.set(programType, filterKey as string);
          break;
        }
      }
      setSearchParams(searchParams);
    },
    [
      filterType,
      filterClassification,
      filterStatus,
      searchParams,
      setSearchParams,
    ],
  );

  // 필터링 초기화
  const resetFilter = () => {
    typeDispatch({ type: 'init' });
    classificationDispatch({ type: 'init' });
    statusDispatch({ type: 'init' });
  };

  const cancelFilter = useCallback(
    (key: string, value: string) => {
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
      searchParams.delete(key);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

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
    queryKey: ['program', pageable, searchParams.toString(), isOpen],
    queryFn: getProgramList,
  });

  if (isLoading) return <></>;

  return (
    <div>
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
        className={clsx('flex flex-col gap-16 px-5 py-8', {
          hidden: isOpen,
        })}
      >
        {/* 상단 필터 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2"
            >
              <img src="/icons/filter.svg" alt="필터 아이콘" />
              <h1 className="text-1.125-bold text-neutral-40">필터</h1>
            </div>
            <div onClick={resetFilter} className="flex items-center gap-2">
              <img src="/icons/redo.svg" alt="필터 초기화 아이콘" />
              <span className="text-0.75-medium text-neutral-40">초기화</span>
            </div>
          </div>
          <div className="flex flex-nowrap items-center gap-4 overflow-scroll py-2">
            {/* 파라미터에 따라 필터 표시 */}
            {searchParams.get(PROGRAM_QUERY_KEY.CLASSIFICATION) && (
              <FilterItem
                programType={PROGRAM_QUERY_KEY.CLASSIFICATION}
                handleClick={cancelFilter}
                key={PROGRAM_QUERY_KEY.CLASSIFICATION}
                caption={
                  PROGRAM_FILTER_CLASSIFICATION[
                    searchParams.get(
                      PROGRAM_QUERY_KEY.CLASSIFICATION,
                    )! as keyof typeof PROGRAM_FILTER_CLASSIFICATION
                  ]
                }
              />
            )}
            {searchParams.get(PROGRAM_QUERY_KEY.TYPE) && (
              <FilterItem
                programType={PROGRAM_QUERY_KEY.TYPE}
                handleClick={cancelFilter}
                key={PROGRAM_QUERY_KEY.TYPE}
                caption={
                  PROGRAM_FILTER_TYPE[
                    searchParams.get(
                      PROGRAM_QUERY_KEY.TYPE,
                    )! as keyof typeof PROGRAM_FILTER_TYPE
                  ]
                }
              />
            )}
            {searchParams.get(PROGRAM_QUERY_KEY.STATUS) && (
              <FilterItem
                programType={PROGRAM_QUERY_KEY.STATUS}
                handleClick={cancelFilter}
                key={PROGRAM_QUERY_KEY.STATUS}
                caption={
                  PROGRAM_FILTER_STATUS[
                    searchParams.get(
                      PROGRAM_QUERY_KEY.STATUS,
                    )! as keyof typeof PROGRAM_FILTER_STATUS
                  ]
                }
              />
            )}
          </div>
        </section>

        {/* 프로그램 리스트 없을 때 */}
        {programList.length === 0 && (
          <p className="text-1 py-2 text-center text-neutral-0/40">
            찾으시는 프로그램이 아직 없어요ㅜㅡㅜ
            <br />
            알림 신청을 통해
            <br />
            가장 먼저 신규 프로그램 소식을 받아보세요!
          </p>
        )}

        <section className="grid min-h-[40vh] grid-cols-2 gap-x-4 gap-y-5">
          {/* 전체 프로그램 리스트 */}
          {programList?.map((program: IProgram) => (
            <ProgramCard
              key={program.programInfo.id}
              program={program.programInfo}
            />
          ))}

          {/* 프로그램 리스트 없을 때 */}
          {programList.length === 0 && <EmptyCardList />}
        </section>

        <MuiPagination pageInfo={pageInfo} setPageable={setPageable} />
        <Banner />
      </main>
    </div>
  );
};

export default Programs;
