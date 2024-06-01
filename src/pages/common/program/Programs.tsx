import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  CHALLENGE_ARTICLE,
  LIVE_ARTICLE,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TITLE,
  PROGRAM_FILTER_TYPE,
  PROGRAM_TYPE,
  VOD_ARTICLE,
} from '../../../utils/programConst';
import axios from '../../../utils/axios';
import { IChallenge, ILive, IVod } from '../../../interfaces/interface';
import ProgramArticle from '../../../components/common/program/programs/card/ProgramArticle';
import ProgramCard from '../../../components/common/program/programs/card/ProgramCard';
import Banner from '../../../components/common/program/banner/Banner';
import FilterItem from '../../../components/common/program/filter/FilterItem';
import FilterCheckbox from '../../../components/common/program/filter/FilterCheckbox';

const Programs = () => {
  const [typeChecked, setTypeChecked] = useState([false, false, false, false]);
  const [titleChekced, setTitleChecked] = useState([false, false, false]);
  const [statusChecked, setStatusChecked] = useState([false, false, false]);

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
      <div className="flex flex-col gap-5 bg-neutral-90 p-10">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icons/filter.svg" alt="필터 아이콘" />
            <h1 className="text-1.125-semibold text-neutral-40">필터</h1>
          </div>
          <img
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
              isChecked={typeChecked[i]}
              setIsChecked={setTypeChecked}
              caption={value}
              index={i}
            />
          ))}
        </section>
        <section>
          <h1 className="text-1-semibold mb-2">프로그램</h1>
          {Object.values(PROGRAM_FILTER_TITLE).map((value, i) => (
            <FilterCheckbox
              isChecked={titleChekced[i]}
              setIsChecked={setTitleChecked}
              caption={value}
              index={i}
            />
          ))}
        </section>
        <section>
          <h1 className="text-1-semibold mb-2">모집 현황</h1>
          {Object.values(PROGRAM_FILTER_STATUS).map((value, i) => (
            <FilterCheckbox
              isChecked={statusChecked[i]}
              setIsChecked={setStatusChecked}
              caption={value}
              index={i}
            />
          ))}
        </section>
      </div>
      <main className="flex flex-col gap-16 px-5 py-8">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/icons/filter.svg" alt="필터 아이콘" />
              <h1 className="text-1.125-bold text-neutral-40">필터</h1>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/redo.svg" alt="필터 초기화 아이콘" />
              <span className="text-0.75-medium text-neutral-40">초기화</span>
            </div>
          </div>
          <div className="flex flex-nowrap items-center gap-4 overflow-scroll py-2">
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
            <FilterItem caption="커리어 탐색" />
          </div>
        </section>
        <section className="flex flex-col gap-16">
          <ProgramArticle
            title={CHALLENGE_ARTICLE.TITLE}
            description={CHALLENGE_ARTICLE.DESCRIPTION}
          >
            {challengeList?.map((program) => (
              <ProgramCard program={program} type={PROGRAM_TYPE.CHALLENGE} />
            ))}
          </ProgramArticle>
          <ProgramArticle
            title={VOD_ARTICLE.TITLE}
            description={VOD_ARTICLE.DESCRIPTION}
          >
            {vodList?.map((program) => (
              <ProgramCard program={program} type={PROGRAM_TYPE.VOD} />
            ))}
          </ProgramArticle>
          <ProgramArticle
            title={LIVE_ARTICLE.TITLE}
            description={LIVE_ARTICLE.DESCRIPTION}
          >
            {liveList?.map((program) => (
              <ProgramCard program={program} type={PROGRAM_TYPE.LIVE} />
            ))}
          </ProgramArticle>
        </section>
        <Banner />
      </main>
    </div>
  );
};

export default Programs;
