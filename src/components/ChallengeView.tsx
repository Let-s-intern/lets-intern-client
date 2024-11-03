import { useEffect, useMemo } from 'react';

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
import SuperTitle from './common/program/program-detail/SuperTitle';
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
};

const ChallengeView: React.FC<{ challenge: ChallengeIdSchema }> = ({
  challenge,
}) => {
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

    switch (challenge.challengeType) {
      case PERSONAL_STATEMENT:
        primary = '#14BCFF';
        secondary = '#FF9C34';
        primaryLight = '#EEFAFF';
        secondaryLight = '#FFF7EF';
        break;
      case PORTFOLIO:
        primary = '#4A76FF';
        secondary = '#F8AE00';
        primaryLight = '#F0F4FF';
        secondaryLight = '#FFF9EA';
        break;
      default:
        primary = '#4D55F5';
        secondary = '#E45BFF';
        primaryLight = '#F3F4FF';
        secondaryLight = '#FDF6FF';
    }
    return { primary, primaryLight, secondary, secondaryLight };
  }, [challenge.challengeType]);

  // TODO: 운영 배포 시 제거
  useEffect(() => {
    console.log('receivedContent', receivedContent);
  }, [receivedContent]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1200px] flex-col px-5 md:px-10">
          <Header programTitle={challenge.title ?? ''} />
          <ChallengeBasicInfo challenge={challenge} />
        </div>

        <ProgramDetailNavigation programType="challenge" />
        <div className="flex w-full max-w-[1200px] flex-col overflow-x-hidden">
          <div id={PROGRAM_INTRO_ID} className="flex w-full flex-col px-5">
            <section className="py-16 lg:py-48">
              <SuperTitle className="mb-6 text-neutral-45 lg:mb-10">
                프로그램 소개
              </SuperTitle>
              <ChallengePointView
                colors={colors}
                challengeType={challenge.challengeType}
                point={receivedContent.challengePoint}
                challengeTitle={challenge.title ?? ''}
                startDate={challenge.startDate ?? dayjs()}
                endDate={challenge.endDate ?? dayjs()}
              />
            </section>

            {/* 특별 챌린지, 합격자 후기 */}
            {receivedContent.mainDescription?.root && (
              <LexicalContent node={receivedContent.mainDescription?.root} />
            )}

            <section className="md:py-50 flex flex-col gap-20 py-16 md:gap-52">
              {challenge.challengeType === PERSONAL_STATEMENT ? (
                <ChallengeIntroPersonalStatement />
              ) : challenge.challengeType === PORTFOLIO ? (
                <ChallengeIntroPortfolio />
              ) : (
                <ChallengeIntroCareerStart />
              )}
              <ChallengeCheckList
                colors={colors}
                challengeType={challenge.challengeType}
              />
              <ChallengeResult
                challengeType={challenge.challengeType}
                colors={colors}
              />
            </section>
          </div>

          {receivedContent.curriculum &&
          receivedContent.curriculum.length > 0 ? (
            <div
              id={PROGRAM_CURRICULUM_ID}
              className="flex w-full flex-col px-5 md:px-10"
            >
              <ChallengeCurriculum
                curriculum={receivedContent.curriculum}
                colors={colors}
              />
            </div>
          ) : null}

          <div
            id={CHALLENGE_DIFFERENT_ID}
            className="flex w-full flex-col px-5 md:px-10"
          >
            <div>
              이 모든 고민을 한번에 해결! 서류 합격률을 300% 높일 수 있는
              렛츠커리어 챌린지
            </div>
            <ChallengeDifferent />
            <ChallengeBrand />
          </div>

          <div id={PROGRAM_REVIEW_ID} className="flex w-full flex-col">
            <ProgramBestReviewSection
              type="challenge"
              reviews={receivedContent.challengeReview}
            />

            {receivedContent.blogReview ? (
              <ProgramDetailBlogReviewSection
                review={receivedContent.blogReview}
                programType="challenge"
              />
            ) : null}
          </div>

          <div
            id={PROGRAM_FAQ_ID}
            className="flex w-full flex-col px-5 md:px-10"
          >
            <ChallengeFaq colors={colors} />
            <ChallengeInfoBottom challenge={challenge} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
