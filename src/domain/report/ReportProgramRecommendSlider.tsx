import { useGetProgramRecommend } from '@/api/program';
import { ReportType } from '@/api/report';
import { personalStatementColors } from '@/domain/report/ReportPersonalStatementPage';
import { resumeColors } from '@/domain/report/ReportResumePage';
import dayjs from '@/lib/dayjs';
import { ReportProgramRecommend } from '@/types/interface';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import ProgramRecommendSlider from '../program-recommend/ProgramRecommendSlider';
import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

const SUPER_TITLE = '서류 작성, 아직 고민이 남아있나요?';
const HEADING = '합격률을 2배 올려주는\n맞춤형 챌린지를 추천해요';

interface ReportProgramRecommendSliderProps {
  reportType: ReportType;
  reportProgramRecommend: ReportProgramRecommend;
}

const ReportProgramRecommendSlider = ({
  reportType,
  reportProgramRecommend,
}: ReportProgramRecommendSliderProps) => {
  const subHeaderStyle = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const buttonStyle = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
    border: `1px solid ${reportType === 'PERSONAL_STATEMENT' ? personalStatementColors.C34AFF : resumeColors._4FDA46}`,
  };

  const router = useRouter();

  const { data: recommendData } = useGetProgramRecommend();

  const slideList = useMemo(() => {
    const list = [];
    // 어드민에서 추천 제목을 입력했을 경우에만  표시

    /* 추천 챌린지 저장 */
    if ((recommendData?.challengeList ?? []).length > 0) {
      const careerStart = recommendData?.challengeList.find(
        (item) => item.challengeType === 'CAREER_START',
      );

      if (careerStart && reportProgramRecommend.challengeCareerStart?.title) {
        list.push({
          id: 'CHALLENGE' + careerStart.id,
          backgroundImage: careerStart.thumbnail ?? '',
          title: reportProgramRecommend.challengeCareerStart?.title,
          cta:
            reportProgramRecommend.challengeCareerStart?.cta ??
            '경험정리 하러 가기',
          to: `/program/challenge/${careerStart.id}`,
          onClickButton: () =>
            router.push(`/program/challenge/${careerStart.id}`),
        });
      }

      const personalStatement = recommendData?.challengeList.find(
        (item) => item.challengeType === 'PERSONAL_STATEMENT',
      );

      if (
        personalStatement &&
        reportProgramRecommend.challengePersonalStatement?.title
      ) {
        list.push({
          id: 'CHALLENGE' + personalStatement.id,
          backgroundImage: personalStatement.thumbnail ?? '',
          title: reportProgramRecommend.challengePersonalStatement?.title,
          cta:
            reportProgramRecommend.challengePersonalStatement?.cta ??
            '자소서 완성하러 가기',
          to: `/program/challenge/${personalStatement.id}`,
          onClickButton: () =>
            router.push(`/program/challenge/${personalStatement.id}`),
        });
      }

      const portfolio = recommendData?.challengeList.find(
        (item) => item.challengeType === 'PORTFOLIO',
      );

      if (portfolio && reportProgramRecommend.challengePortfolio?.title) {
        list.push({
          id: 'CHALLENGE' + portfolio.id,
          backgroundImage: portfolio.thumbnail ?? '',
          title: reportProgramRecommend.challengePortfolio?.title,
          cta:
            reportProgramRecommend.challengePortfolio?.cta ??
            '포폴 완성하러 가기',
          to: `/program/challenge/${portfolio.id}`,
          onClickButton: () =>
            router.push(`/program/challenge/${portfolio.id}`),
        });
      }
    }

    /* 추천 라이브 저장 */
    const live = recommendData?.live;

    if (live && reportProgramRecommend.live?.title) {
      list.push({
        id: 'LIVE' + live?.id,
        backgroundImage: live?.thumbnail ?? '',
        title: reportProgramRecommend.live?.title,
        cta: reportProgramRecommend.live?.cta ?? '라이브 참여하러 가기',
        to: `/program/live/${live?.id}`,
        onClickButton: () => router.push(`/program/live/${live?.id}`),
      });
    }

    /* 추천 vod 저장 */
    if (
      (recommendData?.vodList ?? []).length > 0 &&
      reportProgramRecommend.vod?.title
    ) {
      // 최근에 개설한 vod 하나 가져오기
      const vod = recommendData?.vodList[recommendData?.vodList.length - 1];

      list.push({
        id: 'VOD' + vod?.id,
        backgroundImage: vod?.thumbnail ?? '',
        title: reportProgramRecommend.vod?.title,
        cta: reportProgramRecommend.vod?.cta ?? 'VOD 참여하러 가기',
        to: `/program/live/${vod?.link}`,
        onClickButton: () => router.push(`/program/live/${vod?.link}`),
      });
    }

    const totalReportList =
      recommendData?.reportList.filter(
        (item) =>
          item.isVisible === true &&
          item.visibleDate !== null &&
          (dayjs(item.visibleDate).isSame() ||
            dayjs(item.visibleDate).isBefore(dayjs())),
      ) ?? [];

    // 활성화된 서류 진단 없으면 종료
    if (totalReportList.length === 0) return list;

    /* 추천 서류 진단 저장 */
    const resumeReport = totalReportList.find(
      (item) => item.reportType === 'RESUME',
    );

    if (resumeReport && reportProgramRecommend.reportResume?.title) {
      list.push({
        id: 'RESUME' + resumeReport.id,
        backgroundImage: '/images/report/thumbnail-resume.svg',
        title: reportProgramRecommend.reportResume?.title,
        cta:
          reportProgramRecommend.reportResume?.cta ?? '이력서 진단받으러 가기',
        to: '/report/landing/resume',
        onClickButton: () => router.push('/report/landing/resume'),
      });
    }

    const personalStatementReport = totalReportList.find(
      (item) => item.reportType === 'PERSONAL_STATEMENT',
    );

    if (
      personalStatementReport &&
      reportProgramRecommend.reportPersonalStatement?.title
    ) {
      list.push({
        id: 'PERSONAL_STATEMENT' + personalStatementReport.id,
        backgroundImage: '/images/report/thumbnail-personal-statement.svg',
        title: reportProgramRecommend.reportPersonalStatement?.title,
        cta:
          reportProgramRecommend.reportPersonalStatement?.cta ??
          '자기소개서 진단받으러 가기',
        to: '/report/landing/personal-statement',
        onClickButton: () => router.push('/report/landing/personal-statement'),
      });
    }

    const portfolioReport = totalReportList.find(
      (item) => item.reportType === 'PORTFOLIO',
    );

    if (portfolioReport && reportProgramRecommend.reportPortfolio?.title) {
      list.push({
        id: 'PORTFOLIO' + portfolioReport.id,
        backgroundImage: '/images/report/thumbnail-portfolio.svg',
        title: reportProgramRecommend.reportPortfolio?.title,
        cta:
          reportProgramRecommend.reportPortfolio?.cta ??
          '포트폴리오 진단받으러 가기',
        to: '/report/landing/portfolio',
        onClickButton: () => router.push('/report/landing/portfolio'),
      });
    }

    return list;
  }, [
    recommendData?.challengeList,
    recommendData?.live,
    recommendData?.reportList,
    recommendData?.vodList,
    reportProgramRecommend.challengeCareerStart?.cta,
    reportProgramRecommend.challengeCareerStart?.title,
    reportProgramRecommend.challengePersonalStatement?.cta,
    reportProgramRecommend.challengePersonalStatement?.title,
    reportProgramRecommend.challengePortfolio?.cta,
    reportProgramRecommend.challengePortfolio?.title,
    reportProgramRecommend.live?.cta,
    reportProgramRecommend.live?.title,
    reportProgramRecommend.reportPersonalStatement?.cta,
    reportProgramRecommend.reportPersonalStatement?.title,
    reportProgramRecommend.reportPortfolio?.cta,
    reportProgramRecommend.reportPortfolio?.title,
    reportProgramRecommend.reportResume?.cta,
    reportProgramRecommend.reportResume?.title,
    reportProgramRecommend.vod?.cta,
    reportProgramRecommend.vod?.title,
    router,
  ]);

  return (
    <section
      data-section="recommend"
      className="w-full bg-neutral-95 px-5 py-16 md:py-24 lg:px-0"
    >
      <SubHeader className="mb-1 md:mb-3" style={subHeaderStyle}>
        {SUPER_TITLE}
      </SubHeader>
      <MainHeader>{HEADING}</MainHeader>

      <ProgramRecommendSlider
        className="-mx-5 mt-8 max-w-[1000px] px-5 md:mt-14 lg:mx-auto lg:px-0"
        list={slideList}
        buttonClassName="bg-white font-semibold"
        buttonStyle={buttonStyle}
      />
    </section>
  );
};

export default ReportProgramRecommendSlider;
