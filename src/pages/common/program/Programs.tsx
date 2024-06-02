import { useCallback, useReducer, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import {
  CHALLENGE_ARTICLE,
  LIVE_ARTICLE,
  PROGRAM_TYPE,
  VOD_ARTICLE,
} from '../../../utils/programConst';
import axios from '../../../utils/axios';
import { IChallenge, ILive, IVod } from '../../../interfaces/interface';
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

const Programs = () => {
  // 필터링 상태 관리
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
    (key: string, value: string) => {
      switch (key) {
        case 'type': {
          typeDispatch({ type: 'init' });
          typeDispatch({
            type: filterType[value] ? 'uncheck' : 'check',
            value,
          });
          break;
        }
        case 'name': {
          nameDispatch({ type: 'init' });
          nameDispatch({
            type: filterName[value] ? 'uncheck' : 'check',
            value,
          });
          break;
        }
        case 'status': {
          statusDispatch({ type: 'init' });
          statusDispatch({
            type: filterStatus[value] ? 'uncheck' : 'check',
            value,
          });
          break;
        }
      }
    },
    [filterType, filterName, filterStatus],
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
        typeDispatch({ type: 'uncheck', value });
        break;
      }
      case 'name': {
        nameDispatch({ type: 'uncheck', value });
        break;
      }
      case 'status': {
        statusDispatch({ type: 'uncheck', value });
        break;
      }
    }
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
                  type="type"
                  handleClick={cancelFilter}
                  key={key}
                  caption={key}
                />
              ) : null,
            )}
            {Object.entries(filterName).map(([key, value]) =>
              value ? (
                <FilterItem
                  type="name"
                  handleClick={cancelFilter}
                  key={key}
                  caption={key}
                />
              ) : null,
            )}
            {Object.entries(filterStatus).map(([key, value]) =>
              value ? (
                <FilterItem
                  type="status"
                  handleClick={cancelFilter}
                  key={key}
                  caption={key}
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
