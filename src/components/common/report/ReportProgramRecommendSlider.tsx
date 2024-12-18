import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetProgramRecommend } from '@/api/program';
import { ReportColors, ReportProgramRecommend } from '@/types/interface';
import ProgramRecommendSlider from '../ui/ProgramRecommendSlider';
import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

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
  const subHeaderStyle = {
    color: colors.primary.DEFAULT,
  };

  const navigate = useNavigate();

  const { data: recommendData } = useGetProgramRecommend();

  const slideList = useMemo(() => {
    const list = [];

    /* 추천 챌린지 저장 */
    if ((recommendData?.challengeList ?? []).length > 0) {
      const careerStart = recommendData?.challengeList.find(
        (item) => item.challengeType === 'CAREER_START',
      );

      if (careerStart) {
        list.push({
          id: 'CHALLENGE' + careerStart.id,
          backgroundImage: careerStart.thumbnail ?? '',
          title:
            reportProgramRecommend.challengeCareerStart?.title ??
            careerStart.title ??
            '챌린지 커리어 시작 프로그램',
          cta: reportProgramRecommend.reportResume?.cta ?? '경험정리 하러 가기',
          onClickButton: () => navigate(`/program/challenge/${careerStart.id}`),
        });
      }

      const personalStatement = recommendData?.challengeList.find(
        (item) => item.challengeType === 'PERSONAL_STATEMENT',
      );

      if (personalStatement) {
        list.push({
          id: 'CHALLENGE' + personalStatement.id,
          backgroundImage: personalStatement.thumbnail ?? '',
          title:
            reportProgramRecommend.challengeCareerStart?.title ??
            personalStatement.title ??
            '챌린지 자기소개서 프로그램',
          cta:
            reportProgramRecommend.reportResume?.cta ?? '자소서 완성하러 가기',
          onClickButton: () =>
            navigate(`/program/challenge/${personalStatement.id}`),
        });
      }

      const portfolio = recommendData?.challengeList.find(
        (item) => item.challengeType === 'PORTFOLIO',
      );

      if (portfolio) {
        list.push({
          id: 'CHALLENGE' + portfolio.id,
          backgroundImage: portfolio.thumbnail ?? '',
          title:
            reportProgramRecommend.challengeCareerStart?.title ??
            portfolio.title ??
            '챌린지 포트폴리오 프로그램',
          cta: reportProgramRecommend.reportResume?.cta ?? '포폴 완성하러 가기',
          onClickButton: () => navigate(`/program/challenge/${portfolio.id}`),
        });
      }
    }

    /* 추천 라이브 저장 */
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

    /* 추천 vod 저장 */
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

    /* 추천 서류 진단 저장 */
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
  }, [recommendData, navigate, reportProgramRecommend]);

  return (
    <div className="bg-neutral-95 px-5 py-16 md:py-24">
      <SubHeader className="mb-1 md:mb-3" style={subHeaderStyle}>
        {SUPER_TITLE}
      </SubHeader>
      <MainHeader>{HEADING}</MainHeader>

      <ProgramRecommendSlider
        className="-mx-5 mt-8 max-w-[1000px] px-5 md:mt-14 lg:mx-auto lg:px-0"
        list={slideList}
        buttonClassName="bg-white font-semibold"
        buttonStyle={{
          color: colors.primary.DEFAULT,
          border: `1px solid ${colors.primary[300]}`,
        }}
      />
    </div>
  );
};

export default ReportProgramRecommendSlider;
