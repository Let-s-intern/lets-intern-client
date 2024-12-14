import { useUserProgramQuery } from '@/api/program';
import { ReportPersonalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
import { ProgramInfo } from '@/schema';
import { ReportProgramRecommend } from '@/types/interface';
import {
  PROGRAM_QUERY_KEY,
  PROGRAM_STATUS_KEY,
  PROGRAM_TYPE,
} from '@/utils/programConst';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Heading2 from '../ui/Heading2';
import ProgramRecommendSlider from '../ui/ProgramRecommendSlider';
import SuperTitle from './SuperTitle';

interface ReportProgramRecommendSliderProps {
  colors: ReportPersonalStatementColors;
  reportProgramRecommend: ReportProgramRecommend;
}

const ReportProgramRecommendSlider = ({
  colors,
  reportProgramRecommend,
}: ReportProgramRecommendSliderProps) => {
  const superTitleStyle = {
    color: colors.title,
  };

  const [challengeSearchParams, setChallengeSearchParams] = useSearchParams();
  const [vodSearchParams, setVodSearchParams] = useSearchParams();
  const [liveSearchParams, setLiveSearchParams] = useSearchParams();

  // '챌린지 구분' 속성 필요
  const { data: challenges } = useUserProgramQuery({
    pageable: { page: 1, size: 8 },
    searchParams: challengeSearchParams,
  });
  const { data: vods } = useUserProgramQuery({
    pageable: { page: 1, size: 3 },
    searchParams: vodSearchParams,
  });
  const { data: lives } = useUserProgramQuery({
    pageable: { page: 1, size: 3 },
    searchParams: liveSearchParams,
  });

  const slideList = useMemo(() => {
    const list = [];

    if ((lives?.programList ?? []).length > 0) {
      const live = sortByDeadline(lives?.programList ?? [])[0];

      list.push({
        id: live?.programInfo.id,
        backgroundImage: live?.programInfo.thumbnail ?? '',
        title:
          reportProgramRecommend.live?.title ??
          live.programInfo.title ??
          '렛츠커리어 라이브',
        cta: reportProgramRecommend.live?.cta ?? '라이브 참여하러 가기',
        onClickButton: () => console.log('click live'),
      });
    }

    if ((vods?.programList ?? []).length > 0) {
      const vod = sortByDeadline(vods?.programList ?? [])[0];

      list.push({
        id: vod?.programInfo.id,
        backgroundImage: vod?.programInfo.thumbnail ?? '',
        title:
          reportProgramRecommend.vod?.title ??
          vod?.programInfo.title ??
          '렛츠커리어 VOD',
        cta: reportProgramRecommend.vod?.cta ?? 'VOD 참여하러 가기',
        onClickButton: () => console.log('click vod'),
      });
    }

    return list;
  }, [lives, vods, reportProgramRecommend]);

  function sortByDeadline(programList: ProgramInfo[]) {
    return programList.toSorted((a, b) => {
      const dateA = new Date(a.programInfo.deadline ?? 0);
      const dateB = new Date(b.programInfo.deadline ?? 0);
      return dateA.getTime() - dateB.getTime();
    });
  }

  // 검색 파라미터 설정
  useEffect(() => {
    challengeSearchParams.set(PROGRAM_QUERY_KEY.TYPE, PROGRAM_TYPE.CHALLENGE);
    challengeSearchParams.set(
      PROGRAM_QUERY_KEY.STATUS,
      PROGRAM_STATUS_KEY.PROCEEDING,
    );
    vodSearchParams.set(PROGRAM_QUERY_KEY.TYPE, PROGRAM_TYPE.VOD);
    vodSearchParams.set(
      PROGRAM_QUERY_KEY.STATUS,
      PROGRAM_STATUS_KEY.PROCEEDING,
    );
    liveSearchParams.set(PROGRAM_QUERY_KEY.TYPE, PROGRAM_TYPE.LIVE);
    liveSearchParams.set(
      PROGRAM_QUERY_KEY.STATUS,
      PROGRAM_STATUS_KEY.PROCEEDING,
    );
    setChallengeSearchParams(challengeSearchParams);
    setVodSearchParams(vodSearchParams);
    setLiveSearchParams(liveSearchParams);
  }, []);

  return (
    <div>
      <SuperTitle style={superTitleStyle}>
        서류 작성, 아직 고민이 남아있나요?
      </SuperTitle>
      <Heading2>합격률을 2배 올려주는 맞춤형 챌린지를 추천해요</Heading2>

      <section>
        <ProgramRecommendSlider
          className="mx-5 mt-8 max-w-[1000px] px-5 md:mx-auto md:mt-16 lg:px-0"
          list={slideList}
        />
      </section>
    </div>
  );
};

export default ReportProgramRecommendSlider;
