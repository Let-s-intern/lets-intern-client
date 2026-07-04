'use client';

import ChallengeCheckList from '@/domain/program/challenge/challenge-view/ChallengeCheckList';
import ChallengeCurriculum from '@/domain/program/challenge/challenge-view/ChallengeCurriculum';
import ChallengeFaq from '@/domain/program/challenge/challenge-view/ChallengeFaq';
import ChallengeResult from '@/domain/program/challenge/challenge-view/ChallengeResult';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ChallengeIdPrimitive, challengeTypeSchema } from '@/schema';

import LexicalContent from '@/common/lexical/LexicalContent';
import MoreReviewButton from '@/domain/review/ui/MoreReviewButton';
import ChallengeDetailBlogReviewSection from './ChallengeDetailBlogReviewSection';
import ProgramDetailNavigation, {
  CHALLENGE_DIFFERENT_ID,
  PROGRAM_CURRICULUM_ID,
  PROGRAM_INTRO_ID,
  PROGRAM_REVIEW_ID,
} from '../../program/ProgramDetailNavigation';
import ProgramBestReviewSection from '../ProgramBestReviewSection';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import ChallengeBrand from './challenge-view/ChallengeBrand';
import ChallengeDifferent from './challenge-view/ChallengeDifferent';
import ChallengeFeedbackUI from './challenge-view/ChallengeFeedback';
import ChallengeInfoBottom from './challenge-view/ChallengeInfoBottom';
import ChallengeIntroCareerStart from './challenge-view/ChallengeIntroCareerStart';
import ChallengeIntroExpericeSummary from './challenge-view/ChallengeIntroExpericeSummary';
import ChallengeIntroPersonalStatement from './challenge-view/ChallengeIntroPersonalStatement';
import ChallengeIntroPortfolio from './challenge-view/ChallengeIntroPortfolio';
import ChallengePointView from './challenge-view/ChallengePointView';
import ChallengePricePlanSection from './challenge-view/ChallengePricePlanSection';
import ChallengeSummarySection from './challenge-view/ChallengeSummarySection';
import FreeTemplateLayout from './challenge-view/FreeTemplateLayout';
import { useChallengeDetailView } from './useChallengeDetailView';

const { CAREER_START, PORTFOLIO, PERSONAL_STATEMENT, EXPERIENCE_SUMMARY, ETC } =
  challengeTypeSchema.enum;

const ChallengeView: React.FC<{
  challenge: ChallengeIdPrimitive;
  isPreview?: boolean;
}> = ({ challenge, isPreview }) => {
  const {
    id,
    isResumeTemplate,
    activeChallengeList,
    faqData,
    faqIsLoading,
    receivedContent,
    weekText,
    hasChallengeReviews,
    hasBlogReviews,
    reviewExists,
    challengeTransformed,
    styles,
  } = useChallengeDetailView(challenge);

  if (receivedContent.isFreeTemplate) {
    return (
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full max-w-[1000px] flex-col px-5 pb-10 pt-6 md:gap-y-5 md:px-10 md:py-[60px] lg:px-0">
            <ChallengeBasicInfo
              challengeId={id}
              challenge={challengeTransformed}
              activeChallengeList={activeChallengeList?.challengeList}
            />
          </div>
          <div className="flex w-full flex-col items-center overflow-x-hidden">
            <FreeTemplateLayout freeContent={receivedContent.freeContent} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1000px] flex-col px-5 pb-10 pt-6 md:gap-y-5 md:px-10 md:py-[60px] lg:px-0">
          <ChallengeBasicInfo
            challengeId={id}
            challenge={challengeTransformed}
            activeChallengeList={activeChallengeList?.challengeList}
          />
        </div>

        <ProgramDetailNavigation
          challengeType={challenge.challengeType}
          programType="challenge"
          className={twMerge(isPreview && 'top-0 md:top-0 lg:top-0')}
          isReady={!faqIsLoading}
        />

        <div className="flex w-full flex-col items-center overflow-x-hidden">
          <div
            id={PROGRAM_INTRO_ID}
            className="challenge_program flex w-full flex-col items-center"
          >
            {/* 인트로 (최상단) */}
            {receivedContent.intro?.root &&
              typeof receivedContent.intro.root === 'object' &&
              'type' in receivedContent.intro.root && (
                <section className="mx-auto flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
                  <LexicalContent node={receivedContent.intro.root} />
                </section>
              )}
            <section className="flex w-full flex-col items-center pt-[70px] md:pt-40">
              <ChallengePointView
                challengeType={challenge.challengeType}
                point={receivedContent.challengePoint}
                startDate={dayjs(challenge.startDate)}
                endDate={dayjs(challenge.endDate)}
                challengeTitle={challenge.title ?? ''}
                programRecommend={receivedContent.programRecommend}
                curationCard={receivedContent.curationCard}
                deposit={challenge.priceInfo[0].refund ?? 0}
                challengeId={Number(id)}
                isResumeTemplate={isResumeTemplate}
              />
            </section>

            {(challenge.challengeType === PORTFOLIO ||
              challenge.challengeType === PERSONAL_STATEMENT) && (
              <ChallengeFeedbackUI challengeType={challenge.challengeType} />
            )}

            {/* 특별 챌린지, 합격자 후기 */}
            {receivedContent.mainDescription?.root &&
              typeof receivedContent.mainDescription.root === 'object' &&
              'type' in receivedContent.mainDescription.root && (
                <section className="flex w-full max-w-[1000px] flex-col px-5 pt-20 md:px-10 md:pt-40 lg:px-0">
                  <LexicalContent node={receivedContent.mainDescription.root} />
                </section>
              )}

            <section className="flex w-full flex-col md:items-center">
              {challenge.challengeType === PORTFOLIO ? (
                <ChallengeIntroPortfolio weekText={weekText} />
              ) : challenge.challengeType === CAREER_START ? (
                <ChallengeIntroCareerStart
                  isResumeTemplate={isResumeTemplate}
                  challengeType={challenge.challengeType}
                  challengeTitle={challenge.title ?? ''}
                  weekText={weekText}
                />
              ) : challenge.challengeType === EXPERIENCE_SUMMARY ||
                challenge.challengeType === ETC ? (
                <ChallengeIntroExpericeSummary
                  challengeType={challenge.challengeType}
                  weekText={weekText}
                />
              ) : (
                <ChallengeIntroPersonalStatement />
              )}
            </section>

            <ChallengeCheckList
              challengeId={Number(id)}
              isResumeTemplate={isResumeTemplate}
              challengeType={challenge.challengeType}
              challengeTitle={challenge.title ?? ''}
              weekText={weekText}
            />

            <ChallengeResult
              isResumeTemplate={isResumeTemplate}
              challengeType={challenge.challengeType}
              challengeTitle={challenge.title ?? ''}
              weekText={weekText}
            />

            <ChallengeSummarySection
              challengeType={challenge.challengeType}
              isResumeTemplate={isResumeTemplate}
              weekText={weekText}
            />
          </div>

          {receivedContent.curriculum &&
            receivedContent.curriculum.length > 0 && (
              <section
                id={PROGRAM_CURRICULUM_ID}
                className="challenge_curriculum flex w-full flex-col items-center"
                style={{ backgroundColor: styles.curriculumBgColor }}
              >
                <ChallengeCurriculum
                  challengeType={challenge.challengeType}
                  curriculum={receivedContent.curriculum}
                  challengeTitle={challenge.title ?? ''}
                />
              </section>
            )}

          {/* 차별점 */}
          <div
            id={CHALLENGE_DIFFERENT_ID}
            className="challenge_difference flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0"
          >
            <ChallengeDifferent
              isResumeTemplate={isResumeTemplate}
              challengeTitle={challenge.title ?? ''}
              challengeType={challenge.challengeType}
              deposit={challenge.priceInfo[0].refund ?? 0}
            />
            <ChallengeBrand challengeType={challenge.challengeType} />
          </div>

          {/* 가격 플랜 */}
          {challenge.priceInfo.length >= 2 && (
            <ChallengePricePlanSection
              challengeType={challenge.challengeType}
              priceInfoList={challenge.priceInfo}
            />
          )}

          {/* 후기 섹션 */}
          {reviewExists && (
            <section
              id={PROGRAM_REVIEW_ID}
              className="challenge_review flex w-full flex-col items-center"
            >
              {hasChallengeReviews && (
                <div className="bg-neutral-95 flex w-full flex-col items-center py-[70px] md:py-[110px]">
                  <ProgramBestReviewSection
                    type="challenge"
                    reviews={receivedContent.challengeReview}
                    challengeType={challenge.challengeType}
                  />
                  <MoreReviewButton
                    type="CHALLENGE"
                    challengeType={challenge.challengeType}
                    mainColor={styles.moreReviewMainColor}
                    subColor={styles.moreReviewSubColor}
                  />
                </div>
              )}
              {hasBlogReviews && (
                <ChallengeDetailBlogReviewSection
                  review={receivedContent.blogReview}
                  externalBlogReviews={receivedContent.externalBlogReviews}
                />
              )}
            </section>
          )}
          <ChallengeFaq
            faqData={faqData}
            challengeType={challenge.challengeType}
          />
          <ChallengeInfoBottom challenge={challengeTransformed} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
