import { useEffect, useMemo } from 'react';

import { twMerge } from '@/lib/twMerge';
import { ChallengeIdSchema, challengeTypeSchema } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import ChallengeCheckList from '@components/challenge-view/ChallengeCheckList';
import ChallengeCurriculum from '@components/challenge-view/ChallengeCurriculum';
import ChallengeFaq from '@components/challenge-view/ChallengeFaq';
import ChallengeResult from '@components/challenge-view/ChallengeResult';
import Header from '@components/common/program/program-detail/header/Header';
import dayjs from 'dayjs';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import ChallengeBrand from './challenge-view/ChallengeBrand';
import ChallengeDifferent from './challenge-view/ChallengeDifferent';
import ChallengeInfoBottom from './challenge-view/ChallengeInfoBottom';
import ChallengeIntroCareerStart from './challenge-view/ChallengeIntroCareerStart';
import ChallengeIntroPersonalStatement from './challenge-view/ChallengeIntroPersonalStatement';
import ChallengeIntroPortfolio from './challenge-view/ChallengeIntroPortfolio';
import ChallengePointView from './challenge-view/ChallengePointView';
import LexicalContent from './common/blog/LexicalContent';
import ProgramBestReviewSection from './ProgramBestReviewSection';
import ProgramDetailBlogReviewSection from './ProgramDetailBlogReviewSection';
import ProgramDetailNavigation, {
  CHALLENGE_DIFFERENT_ID,
  PROGRAM_CURRICULUM_ID,
  PROGRAM_FAQ_ID,
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
    let gradient = '';
    let dark = '';

    let subTitle = '';
    let subBg = '';
    let gradientBg = '';
    let curriculumBg = '';

    switch (challenge.challengeType) {
      case PERSONAL_STATEMENT:
        primary = '#14BCFF';
        secondary = '#FF9C34';
        primaryLight = '#EEFAFF';
        secondaryLight = '#FFF7EF';
        gradient = '#39DEFF'; // After 배지 배경색에 사용
        dark = '#20304F'; // 진행방식,결과물 배경색

        subTitle = '#FF9C34';
        subBg = '#FFF7EF';
        gradientBg =
          'linear-gradient(180deg,#222A7E 0%,#111449 50%,#111449 100%)'; // ??
        curriculumBg = '#EFF4F7';
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
    };
  }, [challenge.challengeType]);

  // TODO: 운영 배포 시 제거
  useEffect(() => {
    console.log('receivedContent', receivedContent);
  }, [receivedContent]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
          <Header programTitle={challenge.title ?? ''} />
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
              />
            </section>

            {/* 특별 챌린지, 합격자 후기 */}
            {receivedContent.mainDescription?.root && (
              <section className="flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
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
            className="challenge_review flex w-full flex-col items-center bg-neutral-95 py-16 md:pb-32 md:pt-28"
          >
            <ProgramBestReviewSection
              type="challenge"
              reviews={receivedContent.challengeReview}
              colors={colors}
            />
          </section>

          <div className="challenge_faq flex w-full flex-col gap-20 px-5 pb-8 pt-16 md:items-center md:gap-40 md:px-10 md:pb-32 md:pt-36">
            {receivedContent.blogReview ? (
              <ProgramDetailBlogReviewSection
                review={receivedContent.blogReview}
                programType="challenge"
              />
            ) : null}
            <section id={PROGRAM_FAQ_ID} className="w-full">
              <ChallengeFaq colors={colors} />
            </section>
            <ChallengeInfoBottom challenge={challenge} colors={colors} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
