import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetProgramRecommend } from '@/api/program';
import { ReportColors, ReportProgramRecommend } from '@/types/interface';
import Heading2 from '../ui/Heading2';
import ProgramRecommendSlider from '../ui/ProgramRecommendSlider';
import SuperTitle from './SuperTitle';

const SUPER_TITLE = '서류 작성, 아직 고민이 남아있나요?';
const HEADING = '합격률을 2배 올려주는\n맞춤형 챌린지를 추천해요';

interface ReportProgramRecommendSliderProps {
  colors: ReportColors;
  reportProgramRecommend: ReportProgramRecommend;
}

const ReportProgramRecommendSlider = ({
  colors,
  reportProgramRecommend,
}: ReportProgramRecommendSliderProps) => {
  const superTitleStyle = {
    color: colors.primary.DEFAULT,
  };

  const navigate = useNavigate();

  const { data: recommendData } = useGetProgramRecommend();
  console.log('추천 프로그램:', recommendData);

  const slideList = useMemo(() => {
    const list = [];

    // 추천 라이브 저장
    const live = recommendData?.live;

    if (live) {
      list.push({
        id: 'LIVE' + live?.id,
        backgroundImage: live?.thumbnail ?? '',
        title:
          reportProgramRecommend.live?.title ??
          live?.title ??
          '렛츠커리어 라이브',
        cta: reportProgramRecommend.live?.cta ?? '라이브 참여하러 가기',
        onClickButton: () => navigate(`/program/live/${live?.id}`),
      });
    }

    // 추천 vod 저장
    if ((recommendData?.vodList ?? []).length > 0) {
      // 최근에 개설한 vod 하나 가져오기
      const vod = recommendData?.vodList[recommendData?.vodList.length - 1];

      list.push({
        id: 'VOD' + vod?.id,
        backgroundImage: vod?.thumbnail ?? '',
        title:
          reportProgramRecommend.vod?.title ?? vod?.title ?? '렛츠커리어 VOD',
        cta: reportProgramRecommend.vod?.cta ?? 'VOD 참여하러 가기',
        onClickButton: () => navigate(`/program/live/${vod?.link}`),
      });
    }

    // 활성화된 서류 진단 없으면 종료
    if ((recommendData?.reportList ?? []).length === 0) return list;

    // 추천 서류 진단 저장
    const resumeReport = recommendData?.reportList.find(
      (item) => item.reportType === 'RESUME',
    );

    if (resumeReport) {
      list.push({
        id: 'RESUME' + resumeReport.id,
        backgroundImage: '',
        title:
          reportProgramRecommend.reportResume?.title ??
          resumeReport.title ??
          '렛츠커리어 이력서 진단 프로그램',
        cta:
          reportProgramRecommend.reportResume?.cta ?? '이력서 진단받으러 가기',
        onClickButton: () => navigate('/report/landing/resume'),
      });
    }

    const personalStatementReport = recommendData?.reportList.find(
      (item) => item.reportType === 'PERSONAL_STATEMENT',
    );

    if (personalStatementReport) {
      list.push({
        id: 'PERSONAL_STATEMENT' + personalStatementReport.id,
        backgroundImage: '',
        title:
          reportProgramRecommend.reportPersonalStatement?.title ??
          personalStatementReport.title ??
          '렛츠커리어 자기소개서 진단 프로그램',
        cta:
          reportProgramRecommend.reportPersonalStatement?.cta ??
          '자기소개서 진단받으러 가기',
        onClickButton: () => navigate('/report/landing/personal-statement'),
      });
    }

    const portfolioReport = recommendData?.reportList.find(
      (item) => item.reportType === 'PORTFOLIO',
    );

    if (portfolioReport) {
      list.push({
        id: 'PORTFOLIO' + portfolioReport.id,
        backgroundImage: '',
        title:
          reportProgramRecommend.reportPortfolio?.title ??
          portfolioReport.title ??
          '렛츠커리어 포트폴리오 진단 프로그램',
        cta:
          reportProgramRecommend.reportPortfolio?.cta ??
          '포트폴리오 진단받으러 가기',
        onClickButton: () => navigate('/report/landing/portfolio'),
      });
    }

    return list;
  }, [recommendData]);

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
