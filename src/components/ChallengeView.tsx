import dayjs from 'dayjs';
import { useMemo } from 'react';

import { twMerge } from '@/lib/twMerge';
import { ChallengeIdSchema, challengeTypeSchema } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import ChallengeCheckList from '@components/challenge-view/ChallengeCheckList';
import ChallengeCurriculum from '@components/challenge-view/ChallengeCurriculum';
import ChallengeFaq from '@components/challenge-view/ChallengeFaq';
import ChallengeResult from '@components/challenge-view/ChallengeResult';
import Header from '@components/common/program/program-detail/header/Header';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import ChallengeBrand from './challenge-view/ChallengeBrand';
import ChallengeDifferent from './challenge-view/ChallengeDifferent';
import ChallengeInfoBottom from './challenge-view/ChallengeInfoBottom';
import ChallengeIntroCareerStart from './challenge-view/ChallengeIntroCareerStart';
import ChallengeIntroPersonalStatement from './challenge-view/ChallengeIntroPersonalStatement';
import ChallengeIntroPortfolio from './challenge-view/ChallengeIntroPortfolio';
import ChallengePointView from './challenge-view/ChallengePointView';
import LexicalContent from './common/blog/LexicalContent';
import MoreReviewButton from './common/review/MoreReviewButton';
import ProgramBestReviewSection from './ProgramBestReviewSection';
import ProgramDetailBlogReviewSection from './ProgramDetailBlogReviewSection';
import ProgramDetailNavigation, {
  CHALLENGE_DIFFERENT_ID,
  PROGRAM_CURRICULUM_ID,
  PROGRAM_INTRO_ID,
  PROGRAM_REVIEW_ID,
} from './ProgramDetailNavigation';

const { PERSONAL_STATEMENT, PORTFOLIO } = challengeTypeSchema.enum;

export type ChallengeColor = {
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  gradient: string;
  dark: string;
  subTitle: string;
  subBg: string;
  gradientBg: string;
  curriculumBg: string;
  recommendBg: string;
  recommendLogo: string;
};

const ChallengeView: React.FC<{
  challenge: ChallengeIdSchema;
  isPreview?: boolean;
}> = ({ challenge, isPreview }) => {
  const receivedContent = useMemo<ChallengeContent>(() => {
    if (!challenge?.desc) {
      return { initialized: false };
    }
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return { initialized: false };
    }
  }, [challenge.desc]);

  const colors = useMemo(() => {
    let primary = '';
    let primaryLight = '';
    let secondary = '';
    let secondaryLight = '';
    let gradient = ''; // After 배지 배경색에 사용
    let dark = ''; // 진행방식,결과물 배경색

    let subTitle = '';
    let subBg = '';
    let gradientBg = '';
    let curriculumBg = ''; // 커리큘럼 배경색
    let recommendBg = ''; // 프로그램 추천 배경색
    let recommendLogo = ''; // 프로그램 추천 로고색

    switch (challenge.challengeType) {
      case PERSONAL_STATEMENT:
        primary = '#14BCFF';
        secondary = '#FF9C34';
        primaryLight = '#EEFAFF';
        secondaryLight = '#FFF7EF';
        gradient = '#39DEFF';
        dark = '#20304F';

        subTitle = '#FF9C34';
        subBg = '#FFF7EF';
        gradientBg =
          'linear-gradient(180deg,#222A7E 0%,#111449 50%,#111449 100%)'; // ??
        curriculumBg = '#EFF4F7';
        recommendBg = '#F3F4F7';
        recommendLogo = '#DDF5FF';
        break;
      case PORTFOLIO:
        primary = '#4A76FF';
        secondary = '#F8AE00';
        primaryLight = '#F0F4FF';
        secondaryLight = '#FFF9EA';
        gradient = '#4A56FF';
        dark = '#1A2A5D';

        subTitle = '#F8AE00';
        subBg = '#FFF9EA';
        gradientBg =
          'linear-gradient(180deg,#222A7E 0%,#111449 50%,#111449 100%)';
        curriculumBg = '#F3F3F3';
        recommendBg = '#F0F4FF';
        recommendLogo = '#DEE7FF';
        break;
      default:
        primary = '#4D55F5';
        secondary = '#E45BFF';
        primaryLight = '#F3F4FF';
        secondaryLight = '#FDF6FF';
        gradient = '#763CFF';
        dark = '#1A1D5F';

        subTitle = '#757BFF';
        subBg = '#5C63FF';
        gradientBg =
          'linear-gradient(180deg,#222A7E 0%,#111449 50%,#111449 100%)';
        curriculumBg = '#F2F2F5';
        recommendBg = '#F3F4F7';
        recommendLogo = '#E8EAFF';
    }
    return {
      primary,
      primaryLight,
      secondary,
      secondaryLight,
      gradient,
      dark,
      subTitle,
      subBg,
      gradientBg,
      curriculumBg,
      recommendBg,
      recommendLogo,
    };
  }, [challenge.challengeType]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
          <Header to="/program" programTitle={challenge.title ?? ''} />
          <ChallengeBasicInfo colors={colors} challenge={challenge} />
        </div>

        <ProgramDetailNavigation
          color={colors}
          programType="challenge"
          className={twMerge(isPreview && 'top-0 md:top-0 lg:top-0')}
        />

        <div className="flex w-full flex-col items-center overflow-x-hidden">
          <div
            id={PROGRAM_INTRO_ID}
            className="challenge_program flex w-full flex-col items-center"
          >
            <section className="flex w-full flex-col items-center pt-[70px] md:pt-40">
              <ChallengePointView
                colors={colors}
                challengeType={challenge.challengeType}
                point={receivedContent.challengePoint}
                startDate={challenge.startDate ?? dayjs()}
                endDate={challenge.endDate ?? dayjs()}
                challengeTitle={challenge.title ?? ''}
                programRecommend={receivedContent.programRecommend}
              />
            </section>

            {/* 특별 챌린지, 합격자 후기 */}
            {receivedContent.mainDescription?.root && (
              <section className="flex w-full max-w-[1000px] flex-col px-5 pt-20 md:px-10 md:pt-40 lg:px-0">
                <LexicalContent node={receivedContent.mainDescription?.root} />
              </section>
            )}

            <section className="flex w-full flex-col md:items-center">
              {challenge.challengeType === PERSONAL_STATEMENT ? (
                <ChallengeIntroPersonalStatement />
              ) : challenge.challengeType === PORTFOLIO ? (
                <ChallengeIntroPortfolio />
              ) : (
                <ChallengeIntroCareerStart
                  colors={colors}
                  challengeTitle={challenge.title ?? ''}
                  weekText={receivedContent.challengePoint.weekText}
                />
              )}
            </section>

            <ChallengeCheckList
              colors={colors}
              challengeType={challenge.challengeType}
              challengeTitle={challenge.title ?? ''}
            />

            <ChallengeResult
              challengeType={challenge.challengeType}
              colors={colors}
              challengeTitle={challenge.title ?? ''}
            />
          </div>

          {receivedContent.curriculum &&
            receivedContent.curriculum.length > 0 && (
              <section
                id={PROGRAM_CURRICULUM_ID}
                className="challenge_curriculum flex w-full flex-col items-center"
                style={{ backgroundColor: colors.curriculumBg }}
              >
                <ChallengeCurriculum
                  challengeType={challenge.challengeType}
                  curriculum={receivedContent.curriculum}
                  challengeTitle={challenge.title ?? ''}
                  colors={colors}
                />
              </section>
            )}

          <div
            id={CHALLENGE_DIFFERENT_ID}
            className="challenge_difference flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0"
          >
            <ChallengeDifferent
              challengeTitle={challenge.title ?? ''}
              colors={colors}
              challengeType={challenge.challengeType}
            />
            <ChallengeBrand colors={colors} />
          </div>

          <section
            id={PROGRAM_REVIEW_ID}
            className="challenge_review flex w-full flex-col items-center gap-y-[70px] md:gap-y-40"
          >
            <div className="flex w-full flex-col items-center bg-neutral-95 py-[70px] md:py-[110px]">
              <ProgramBestReviewSection
                type="challenge"
                reviews={receivedContent.challengeReview}
                colors={colors}
              />
              <MoreReviewButton
                title={challenge.title ?? '-'}
                thumbnail={challenge.thumbnail ?? ''}
                startDate={challenge.startDate?.format('YYYY.MM.DD') ?? ''}
                endDate={challenge.endDate?.format('YYYY.MM.DD') ?? ''}
                deadline={challenge.deadline?.format('YYYY.MM.DD') ?? ''}
                type={
                  challenge.challengeType === 'PORTFOLIO' ||
                  challenge.challengeType === 'PERSONAL_STATEMENT'
                    ? 'REPORT'
                    : 'CHALLENGE'
                }
                mainColor={colors.dark}
                subColor={colors.secondary}
              />
            </div>
            {receivedContent.blogReview && (
              <ProgramDetailBlogReviewSection
                review={receivedContent.blogReview}
                programType="challenge"
              />
            )}
          </section>
          <ChallengeFaq
            colors={colors}
            faqCategory={receivedContent.faqCategory}
          />
          <ChallengeInfoBottom challenge={challenge} colors={colors} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
