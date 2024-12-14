import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useUserProgramQuery } from '@/api/program';
import { ReportType, useGetActiveReports } from '@/api/report';
import { ProgramInfo } from '@/schema';
import { ReportColors, ReportProgramRecommend } from '@/types/interface';
import {
  PROGRAM_QUERY_KEY,
  PROGRAM_STATUS_KEY,
  PROGRAM_TYPE,
} from '@/utils/programConst';
import Heading2 from '../ui/Heading2';
import ProgramRecommendSlider from '../ui/ProgramRecommendSlider';
import SuperTitle from './SuperTitle';

const SUPER_TITLE = '서류 작성, 아직 고민이 남아있나요?';
const HEADING = '합격률을 2배 올려주는\n맞춤형 챌린지를 추천해요';

interface ReportProgramRecommendSliderProps {
  colors: ReportColors;
  reportProgramRecommend: ReportProgramRecommend;
  reportType: ReportType;
}

const ReportProgramRecommendSlider = ({
  colors,
  reportProgramRecommend,
  reportType,
}: ReportProgramRecommendSliderProps) => {
  const superTitleStyle = {
    color: colors.primary.DEFAULT,
  };

  const [challengeSearchParams, setChallengeSearchParams] = useSearchParams();
  const [vodSearchParams, setVodSearchParams] = useSearchParams();
  const [liveSearchParams, setLiveSearchParams] = useSearchParams();

  // '챌린지 구분' 속성 필요 -> challenge 목록 조회 API 사용하기
  // const { data: challenges } = useUserProgramQuery({
  //   pageable: { page: 1, size: 8 },
  //   searchParams: challengeSearchParams,
  // });
  const { data: vods } = useUserProgramQuery({
    pageable: { page: 1, size: 3 },
    searchParams: vodSearchParams,
  });
  const { data: lives } = useUserProgramQuery({
    pageable: { page: 1, size: 3 },
    searchParams: liveSearchParams,
  });
  const { data: reports } = useGetActiveReports();

  const slideList = useMemo(() => {
    const list = [];

    if ((lives?.programList ?? []).length > 0) {
      const live = sortByDeadline(lives?.programList ?? [])[0];

      list.push({
        id: 'LIVE' + live?.programInfo.id,
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
        id: 'VOD' + vod?.programInfo.id,
        backgroundImage: vod?.programInfo.thumbnail ?? '',
        title:
          reportProgramRecommend.vod?.title ??
          vod?.programInfo.title ??
          '렛츠커리어 VOD',
        cta: reportProgramRecommend.vod?.cta ?? 'VOD 참여하러 가기',
        onClickButton: () => console.log('click vod'),
      });
    }

    if (reportType !== 'RESUME' && reports?.resumeInfo) {
      list.push({
        id: 'RESUME' + reports?.resumeInfo.reportId,
        backgroundImage: '',
        title:
          reportProgramRecommend.reportResume?.title ??
          reports?.resumeInfo.title ??
          '렛츠커리어 이력서 진단 프로그램',
        cta:
          reportProgramRecommend.reportResume?.cta ?? '이력서 진단받으러 가기',
        onClickButton: () => console.log('click resume'),
      });
    }

    if (reportType !== 'PERSONAL_STATEMENT' && reports?.personalStatementInfo) {
      list.push({
        id: 'PERSONAL_STATEMENT' + reports?.personalStatementInfo.reportId,
        backgroundImage: '',
        title:
          reportProgramRecommend.reportPersonalStatement?.title ??
          reports?.personalStatementInfo.title ??
          '렛츠커리어 자기소개서 진단 프로그램',
        cta:
          reportProgramRecommend.reportPersonalStatement?.cta ??
          '자기소개서 진단받으러 가기',
        onClickButton: () => console.log('click personal statement'),
      });
    }

    if (reportType !== 'PORTFOLIO' && reports?.portfolioInfo) {
      list.push({
        id: 'PORTFOLIO' + reports?.portfolioInfo.reportId,
        backgroundImage: '',
        title:
          reportProgramRecommend.reportPortfolio?.title ??
          reports?.portfolioInfo.title ??
          '렛츠커리어 포트폴리오 진단 프로그램',
        cta:
          reportProgramRecommend.reportPortfolio?.cta ??
          '포트폴리오 진단받으러 가기',
        onClickButton: () => console.log('click portfolio'),
      });
    }

    return list;
  }, [lives, vods, reportProgramRecommend, reports]);

  function sortByDeadline(programList: ProgramInfo[]) {
    return programList.toSorted((a, b) => {
      const dateA = new Date(a.programInfo.deadline ?? 0);
      const dateB = new Date(b.programInfo.deadline ?? 0);
      return dateA.getTime() - dateB.getTime();
    });
  }

  // 검색 파라미터 설정
  useEffect(() => {
    // challengeSearchParams.set(PROGRAM_QUERY_KEY.TYPE, PROGRAM_TYPE.CHALLENGE);
    // challengeSearchParams.set(
    //   PROGRAM_QUERY_KEY.STATUS,
    //   PROGRAM_STATUS_KEY.PROCEEDING,
    // );
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
    //setChallengeSearchParams(challengeSearchParams);
    setVodSearchParams(vodSearchParams);
    setLiveSearchParams(liveSearchParams);
  }, []);

  return (
    <>
      <SuperTitle className="mb-1 md:mb-3" style={superTitleStyle}>
        {SUPER_TITLE}
      </SuperTitle>
      <Heading2>{HEADING}</Heading2>

      <ProgramRecommendSlider
        className="-mx-5 mt-8 max-w-[1000px] px-5 md:mt-14 lg:mx-0 lg:px-0"
        list={slideList}
      />
    </>
  );
};

export default ReportProgramRecommendSlider;
