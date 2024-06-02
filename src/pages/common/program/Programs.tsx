import { useCallback, useReducer, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';

import {
  CHALLENGE_ARTICLE,
  LIVE_ARTICLE,
  PROGRAM_FILTER_NAME,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
  PROGRAM_TYPE,
  VOD_ARTICLE,
} from '../../../utils/programConst';
import axios from '../../../utils/axios';
import {
  IChallenge,
  ILive,
  IVod,
  filterNamekey,
  filterStatuskey,
  filterTypekey,
} from '../../../interfaces/interface';
import ProgramArticle from '../../../components/common/program/programs/card/ProgramArticle';
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

const Programs = () => {
  // 페이지 상태 관리
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

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

  // 프로그램 싱태 관리
  const [challengeList, setChallengeList] = useState<IChallenge[]>([]);
  const [vodList, setVodList] = useState<IVod[]>([]);
  const [liveList, setLiveList] = useState<ILive[]>([]);

  const getProgramList = async <T,>(
    type: string,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    const pageable = { page: 0, size: 4, sort: 'string' };
    const queryList = Object.entries(pageable)?.map(
      ([key, value]) => `${key}=${value}`,
    );
    try {
      const res = await axios.get(`/${type}?${queryList.join('&')}`);
      if (res.status === 200) {
        setState(res.data.data.programList);
        return res.data;
      }
      throw new Error(`${res.status} ${res.statusText}`);
    } catch (error) {
      console.error(error);
    }
  };

  const { isLoading: isChallengeLoading } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () =>
      await getProgramList<IChallenge>('challenge', setChallengeList),
  });
  const { isLoading: isVodLoading } = useQuery({
    queryKey: ['vod'],
    queryFn: async () => await getProgramList<IVod>('vod', setVodList),
  });
  const { isLoading: isLiveLoading } = useQuery({
    queryKey: ['live'],
    queryFn: async () => await getProgramList<ILive>('live', setLiveList),
  });

  const isLoading = isChallengeLoading || isVodLoading || isLiveLoading;

  if (isLoading) return <></>;

  return (
    <div>
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
        <section className="flex flex-col gap-16">
          <ProgramArticle
            title={CHALLENGE_ARTICLE.TITLE}
            description={CHALLENGE_ARTICLE.DESCRIPTION}
          >
            {challengeList?.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                type={PROGRAM_TYPE.CHALLENGE}
              />
            ))}
          </ProgramArticle>
          <ProgramArticle
            title={VOD_ARTICLE.TITLE}
            description={VOD_ARTICLE.DESCRIPTION}
          >
            {vodList?.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                type={PROGRAM_TYPE.VOD}
              />
            ))}
          </ProgramArticle>
          <ProgramArticle
            title={LIVE_ARTICLE.TITLE}
            description={LIVE_ARTICLE.DESCRIPTION}
          >
            {liveList?.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                type={PROGRAM_TYPE.LIVE}
              />
            ))}
          </ProgramArticle>
        </section>
        <Banner />
      </main>
    </div>
  );
};

export default Programs;
