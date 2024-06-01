import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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

const Programs = () => {
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
    <main className="flex flex-col gap-16 px-5 py-8">
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
    </main>
  );
};

export default Programs;
