import { useCallback, useEffect, useReducer, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';

import {
  CHALLENGE_ARTICLE,
  LIVE_ARTICLE,
  PROGRAM_FILTER_NAME,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_NAME_KEY,
  PROGRAM_TYPE,
  VOD_ARTICLE,
} from '../../../utils/programConst';
import axios from '../../../utils/axios';
import {
  IChallenge,
  ILive,
  IPageable,
  IProgram,
  IVod,
  filterNamekey,
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
  filterNameReducer,
  initialFilterName,
  filterStatusReducer,
  initialFilterStatus,
} from '../../../reducers/filterReducer';
import { getKeyByValue } from '../../../utils/convert';
import MuiPagination from '../../../components/common/program/pagination/MuiPagination';
import EmptyCard from '../../../components/common/program/programs/card/EmptyCard';

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

  // 필터링 체크박스 클릭 이벤트
  const handleClickCheckbox = useCallback(
    (programType: string, value: string) => {
      switch (programType) {
        case 'type': {
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
        case 'name': {
          const filterKey = getKeyByValue(PROGRAM_FILTER_NAME, value);
          type keyType = keyof typeof filterName;
          nameDispatch({ type: 'init' });
          nameDispatch({
            type: filterName[filterKey as keyType] ? 'uncheck' : 'check',
            value: filterKey,
          });
          searchParams.set(programType, filterKey as string);
          break;
        }
        case 'status': {
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
    [filterType, filterName, filterStatus, searchParams, setSearchParams],
  );

  // 필터링 초기화
  const resetFilter = () => {
    typeDispatch({ type: 'init' });
    nameDispatch({ type: 'init' });
    statusDispatch({ type: 'init' });
  };

  const cancelFilter = useCallback((key: string, value: string) => {
    switch (key) {
      case 'type': {
        const filterKey = getKeyByValue(PROGRAM_FILTER_TYPE, value);
        typeDispatch({ type: 'uncheck', value: filterKey });
        break;
      }
      case 'name': {
        const filterKey = getKeyByValue(PROGRAM_FILTER_NAME, value);
        nameDispatch({ type: 'uncheck', value: filterKey });
        break;
      }
      case 'status': {
        const filterKey = getKeyByValue(PROGRAM_FILTER_STATUS, value);
        statusDispatch({ type: 'uncheck', value: filterKey });
        break;
      }
    }
    searchParams.delete(key);
    setSearchParams(searchParams);
  }, []);

  // 페이지 상태 관리
  const [pageable, setPageable] = useState(initialPageable);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  // 프로그램 전체 보기 (name 필터링 없는 상태)
  const [isAll, setIsAll] = useState(true);
  useEffect(() => {
    if (searchParams.get('name')) setIsAll(false);
    else setIsAll(true);
  }, [searchParams]);

  // 프로그램 리스트 싱태 관리
  const [programList, setProgramList] = useState<IProgram[]>([]);
  // const [challengeList, setChallengeList] = useState<IChallenge[]>([]);
  // const [vodList, setVodList] = useState<IVod[]>([]);
  // const [liveList, setLiveList] = useState<ILive[]>([]);

  // const getProgramList = async <T,>(
  //   type: string,
  //   setState: React.Dispatch<React.SetStateAction<T[]>>,
  //   pageable: IPageable,
  // ) => {
  //   const queryList = Object.entries({ ...pageable, sort: 'string' })?.map(
  //     ([key, value]) => `${key}=${value}`,
  //   );
  //   try {
  //     const res = await axios.get(`/${type}?${queryList.join('&')}`);
  //     if (res.status === 200) {
  //       setState(res.data.data.programList);
  //       return res.data;
  //     }
  //     throw new Error(`${res.status} ${res.statusText}`);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const calculateDuration = () => {
    const currentDate = new Date();
    const startDate = currentDate;
    const endDate = currentDate;
    startDate.setMonth(currentDate.getMonth() - 3);
    endDate.setMonth(currentDate.getMonth() + 3);

    return { startDate, endDate };
  };

  // 프로그램 리스트 가져오기
  // const { isLoading } = useQuery({
  //   queryKey: ['program', pageable],
  //   queryFn: async () => {
  //     const { startDate, endDate } = calculateDuration();
  //     const queryList = Object.entries({
  //       ...pageable,
  //       sort: 'string',
  //       startDate,
  //       endDate,
  //     })?.map(([key, value]) => `${key}=${value}`);
  //     try {
  //       const res = await axios.get(`/program/duration?${queryList.join('&')}`);
  //       if (res.status === 200) {
  //         console.log(res.data.data);
  //         setProgramList(res.data.data.programList);
  //         return res.data;
  //       }
  //       throw new Error(`${res.status} ${res.statusText}`);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  // });

  // const { isLoading: isChallengeLoading } = useQuery({
  //   queryKey: ['challenge', challengePageable],
  //   queryFn: async () =>
  //     await getProgramList<IChallenge>(
  //       'challenge',
  //       setChallengeList,
  //       challengePageable,
  //     ),
  // });
  // const { isLoading: isVodLoading } = useQuery({
  //   queryKey: ['vod', vodPageable],
  //   queryFn: async () =>
  //     await getProgramList<IVod>('vod', setVodList, vodPageable),
  // });
  // const { isLoading: isLiveLoading } = useQuery({
  //   queryKey: ['live', livePageable],
  //   queryFn: async () =>
  //     await getProgramList<ILive>('live', setLiveList, livePageable),
  // });

  // const isLoading = isChallengeLoading || isVodLoading || isLiveLoading;

  // if (isLoading) return <></>;

  return (
    <div>
      {/* 필터링 사이드바 */}
      <FilterSideBar
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleClick={handleClickCheckbox}
        filterType={filterType}
        filterName={filterName}
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
            {Object.entries(filterType).map(([key, value]) =>
              value ? (
                <FilterItem
                  programType="type"
                  handleClick={cancelFilter}
                  key={key}
                  caption={PROGRAM_FILTER_TYPE[key as filterTypekey]}
                />
              ) : null,
            )}
            {Object.entries(filterName).map(([key, value]) =>
              value ? (
                <FilterItem
                  programType="name"
                  handleClick={cancelFilter}
                  key={key}
                  caption={PROGRAM_FILTER_NAME[key as filterNamekey]}
                />
              ) : null,
            )}
            {Object.entries(filterStatus).map(([key, value]) =>
              value ? (
                <FilterItem
                  programType="status"
                  handleClick={cancelFilter}
                  key={key}
                  caption={PROGRAM_FILTER_STATUS[key as filterStatuskey]}
                />
              ) : null,
            )}
          </div>
        </section>

        {programList.length === 0 && (
          <p className="text-1 py-2 text-center text-neutral-0/40">
            찾으시는 프로그램이 아직 없어요ㅜㅡㅜ
            <br />
            알림 신청을 통해
            <br />
            가장 먼저 신규 프로그램 소식을 받아보세요!
          </p>
        )}
        {/* 프로그램 리스트 */}
        <section className="grid min-h-[40vh] grid-cols-2 gap-x-4 gap-y-5">
          {programList?.map((program: IProgram) => (
            <ProgramCard
              programType={program.programType}
              key={program.id}
              program={program}
            />
          ))}
          <EmptyCard />
        </section>

        <MuiPagination pageInfo={pageInfo} />
        <Banner />
      </main>
    </div>
  );
};

export default Programs;
