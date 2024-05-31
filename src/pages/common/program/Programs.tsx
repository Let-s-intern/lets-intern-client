import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import ProgramMenu from '../../../components/common/program/programs/menu/ProgramMenu';
import {
  CHALLENGE_ARTICLE,
  LIVE_ARTICLE,
  PROGRAM_CATEGORY,
  PROGRAM_TYPE,
  VOD_ARTICLE,
} from '../../../utils/programConst';
import axios from '../../../utils/axios';
import { IChallenge, ILive, IVod } from '../../../interfaces/interface';
import ProgramArticle from '../../../components/common/program/programs/card/ProgramArticle';
import ProgramCard from '../../../components/common/program/programs/card/ProgramCard';

const Programs = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || PROGRAM_CATEGORY.ALL;
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
      console.log(res);
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
    queryFn: () => getProgramList<IChallenge>('challenge', setChallengeList),
  });
  const { isLoading: isVodLoading } = useQuery({
    queryKey: ['vod'],
    queryFn: () => getProgramList<IVod>('vod', setVodList),
  });
  const { isLoading: isLiveLoading } = useQuery({
    queryKey: ['live'],
    queryFn: () => getProgramList<ILive>('live', setLiveList),
  });

  const isLoading = isChallengeLoading || isVodLoading || isLiveLoading;

  if (isLoading) return <></>;

  return (
    <>
      <div>
        <main>
          <section className="sticky top-16 bg-static-100 px-5 pt-7 sm:top-24 lg:pt-8">
            <div className="flex justify-center">
              <ul className="flex w-full max-w-[60rem] items-center justify-between">
                <li className="w-4/12">
                  <ProgramMenu
                    selected={category === PROGRAM_CATEGORY.ALL}
                    to="/program"
                    category={PROGRAM_CATEGORY.ALL}
                    caption="전체보기"
                  />
                </li>
                <li className="w-4/12">
                  <ProgramMenu
                    selected={category === PROGRAM_CATEGORY.CHALLENGE}
                    to={`/program?category=${PROGRAM_CATEGORY.CHALLENGE}`}
                    category={PROGRAM_CATEGORY.CHALLENGE}
                    caption="렛츠 챌린지"
                  />
                </li>
                <li className="w-4/12">
                  <ProgramMenu
                    selected={category === PROGRAM_CATEGORY.CLASS}
                    to={`/program?category=${PROGRAM_CATEGORY.CLASS}`}
                    category={PROGRAM_CATEGORY.CLASS}
                    caption="렛츠 클래스"
                  />
                </li>
              </ul>
            </div>
          </section>
          <section className="px-5 py-8">
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
      </div>
    </>
  );
};

export default Programs;
