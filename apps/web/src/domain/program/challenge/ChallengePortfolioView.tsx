'use client';

import ChallengeCurriculum from '@/domain/program/challenge/challenge-view/ChallengeCurriculum';
import ChallengeFaq from '@/domain/program/challenge/challenge-view/ChallengeFaq';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ChallengeIdPrimitive } from '@/schema';
import Image from 'next/image';
import {
  PROGRAM_CURRICULUM_ID,
  PROGRAM_INTRO_ID,
  PROGRAM_REVIEW_ID,
} from '../../program/ProgramDetailNavigation';
import ProgramBestReviewSection from '../ProgramBestReviewSection';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import ChallengeBrand from './challenge-view/ChallengeBrand';
import ChallengeInfoBottom from './challenge-view/ChallengeInfoBottom';
import ChallengeIntroEditorContent from './challenge-view/ChallengeIntroEditorContent';
import ChallengeIntroPortfolio from './challenge-view/ChallengeIntroPortfolio';
import ChallengePricePlanSection from './challenge-view/ChallengePricePlanSection';
import ChallengeResult from './challenge-view/ChallengeResult';
import FreeTemplateLayout from './challenge-view/FreeTemplateLayout';
import PortfolioFeedbackInfo from './portfolio-view/PortfolioFeedbackInfo';
import PortfolioIntroCheckList from './portfolio-view/PortfolioIntroCheckList';
import PortfolioOneOnOne from './portfolio-view/PortfolioOneOnOne';
import Portfolio다른프로그램추천 from './portfolio-view/Portfolio다른프로그램추천';
import ProgramChallengePortfolioDetailBlogReviewSection from './portfolio-view/ProgramChallengePortfolioDetailBlogReviewSection';
import ProgramChallengePortfolioDetailNavigation, {
  CHALLENGE_PRICE_ID,
} from './portfolio-view/ProgramChallengePortfolioDetailNavigation';
import PortfolioIntroWhySection from './portfolio-view/challenge-portfolio-view/PortfolioIntroWhySection';
import PortfolioWorriesSection from './portfolio-view/challenge-portfolio-view/PortfolioWorriesSection';
import { useChallengeDetailView } from './useChallengeDetailView';

const ChallengePortfolioView: React.FC<{
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
          <FreeTemplateLayout freeContent={receivedContent.freeContent} />
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

        <ProgramChallengePortfolioDetailNavigation
          challengeType={challenge.challengeType}
          programType="challenge"
          className={twMerge(isPreview && 'top-0 md:top-0 lg:top-0')}
          isReady={!faqIsLoading}
        />

        <div
          id={PROGRAM_INTRO_ID}
          className="flex w-full flex-col items-center overflow-x-hidden"
        >
          {/* LEXICAL */}
          {/* 상세설명 렉시컬에서 인트로 렉시컬로 변경 */}
          <ChallengeIntroEditorContent challenge={challenge} />

          <PortfolioIntroWhySection weekText={weekText} />

          <PortfolioIntroCheckList
            challengeId={Number(id)}
            isResumeTemplate={isResumeTemplate}
            challengeType={challenge.challengeType}
            challengeTitle={challenge.title ?? ''}
            weekText={weekText}
          />

          <section className="flex w-full flex-col items-center pt-[70px] md:pt-40">
            <Portfolio다른프로그램추천
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
        </div>

        <div
          id={PROGRAM_CURRICULUM_ID}
          className="flex w-full flex-col items-center overflow-x-hidden"
        >
          {/* 커리큘럼 */}
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

          {/* {(challenge.challengeType === PORTFOLIO ||
              challenge.challengeType === PERSONAL_STATEMENT) && (
              <ChallengeFeedbackUI challengeType={challenge.challengeType} />
            )} */}
          <section className="flex w-full flex-col md:items-center">
            {/* {challenge.challengeType === PORTFOLIO ? (
                
              ) : challenge.challengeType === CAREER_START ? (
                <ChallengeIntroCareerStart
                  isResumeTemplate={isResumeTemplate}
                  challengeType={challenge.challengeType}
                  challengeTitle={challenge.title ?? ''}
                  weekText={receivedContent.challengePoint.weekText}
                />
              ) : challenge.challengeType === EXPERIENCE_SUMMARY ||
                challenge.challengeType === ETC ? (
                <ChallengeIntroExpericeSummary
                  challengeType={challenge.challengeType}
                />
              ) : (
                <ChallengeIntroPersonalStatement />
              )} */}
            <ChallengeIntroPortfolio weekText={weekText} />
          </section>
        </div>

        <div
          className="flex w-full flex-col items-center"
          id={CHALLENGE_PRICE_ID}
        >
          {/* 가격 플랜 */}
          {challenge.priceInfo.length >= 2 && (
            <ChallengePricePlanSection
              challengeType={challenge.challengeType}
              priceInfoList={challenge.priceInfo}
            />
          )}

          {/* 이제 진짜 만들기 시작해야 하는데... */}
          <PortfolioWorriesSection />
          <Image
            src="/images/퍼렁블록-말꼬리표-322-60.svg"
            alt="퍼렁블록 말꼬리표 이미지"
            unoptimized
            width={322}
            height={60}
            className="mx-auto block object-cover"
          />

          <PortfolioOneOnOne
            isResumeTemplate={isResumeTemplate}
            challengeTitle={challenge.title ?? ''}
            challengeType={challenge.challengeType}
            deposit={challenge.priceInfo[0].refund ?? 0}
          />

          <PortfolioFeedbackInfo />

          <ChallengeResult
            isResumeTemplate={isResumeTemplate}
            challengeType={challenge.challengeType}
            challengeTitle={challenge.title ?? ''}
            weekText={weekText}
          />

          {hasBlogReviews && (
            <ProgramChallengePortfolioDetailBlogReviewSection
              review={receivedContent.blogReview}
              externalBlogReviews={receivedContent.externalBlogReviews}
              programType="challenge"
            />
          )}

          {/* <ChallengeSummarySection
              challengeType={challenge.challengeType}
              isResumeTemplate={isResumeTemplate}
            /> */}

          {/* 차별점 */}
          {/* <div
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
          </div> */}
        </div>

        {/* 후기 섹션 */}
        <div
          className="flex w-full flex-col items-center"
          id={PROGRAM_REVIEW_ID}
        >
          {hasChallengeReviews && (
            <section className="challenge_review flex w-full flex-col items-center">
              <div className="bg-neutral-95 flex w-full flex-col items-center py-[70px] md:py-[110px]">
                <ProgramBestReviewSection
                  type="challenge"
                  reviews={receivedContent.challengeReview}
                  challengeType={challenge.challengeType}
                />
              </div>
            </section>
          )}

          <section className="-mb-20 mt-10 flex w-full max-w-[1000px] flex-col items-center px-5 md:-mb-40 md:gap-y-40 md:px-10 lg:px-0">
            <ChallengeBrand challengeType={challenge.challengeType} />
          </section>

          {/* <div className="flex w-full flex-col items-center py-[70px] md:py-[110px]">
            <section className="flex w-full max-w-[1000px] flex-col items-center gap-y-[70px] px-5 md:gap-y-40 md:px-10 lg:px-0">
              <Heading2 className="text-small20 md:text-center md:text-xlarge28">
                취업 준비의 든든한 지원군,
                <Break />
                <span className="text-[#4A76FF]">렛츠커리어</span>와 함께 하세요
              </Heading2>
              <div className="grid w-full grid-cols-2 gap-16 md:grid-cols-3">
                {[
                  {
                    title: '누적 참여자 수',
                    point: '2,000+명',
                  },
                  {
                    title: '챌린지 평균 수료율',
                    point: '75+%',
                  },
                  {
                    title: '참여자 만족도',
                    point: '4.9점',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="border-t-[3px] border-[#4A76FF] pt-4"
                  >
                    <p className="mb-1 text-small18 font-semibold">
                      {item.title}
                    </p>
                    <p className="text-xlarge28 font-bold">{item.point}</p>
                  </div>
                ))}
              </div>
            </section>
          </div> */}
        </div>
        <ChallengeFaq
          faqData={faqData}
          challengeType={challenge.challengeType}
        />
        <ChallengeInfoBottom challenge={challengeTransformed} />
      </div>
    </div>
  );
};

export default ChallengePortfolioView;
