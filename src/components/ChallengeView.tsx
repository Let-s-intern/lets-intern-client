'use client';

import { useGetActiveChallenge, useGetChallengeFaq } from '@/api/challenge';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import {
  ChallengeIdPrimitive,
  ChallengeIdSchema,
  challengeTypeSchema,
} from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import { ChallengeContent } from '@/types/interface';
import ChallengeCheckList from '@components/challenge-view/ChallengeCheckList';
import ChallengeCurriculum from '@components/challenge-view/ChallengeCurriculum';
import ChallengeFaq from '@components/challenge-view/ChallengeFaq';
import ChallengeResult from '@components/challenge-view/ChallengeResult';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import ChallengeBrand from './challenge-view/ChallengeBrand';
import ChallengeDifferent from './challenge-view/ChallengeDifferent';
import ChallengeInfoBottom from './challenge-view/ChallengeInfoBottom';
import ChallengeIntroCareerStart from './challenge-view/ChallengeIntroCareerStart';
import ChallengeIntroExpericeSummary from './challenge-view/ChallengeIntroExpericeSummary';
import ChallengeIntroPersonalStatement from './challenge-view/ChallengeIntroPersonalStatement';
import ChallengeIntroPortfolio from './challenge-view/ChallengeIntroPortfolio';
import ChallengePointView from './challenge-view/ChallengePointView';
import LexicalContent from './common/blog/LexicalContent';
import MoreReviewButton from './common/review/MoreReviewButton';
import NextBackHeader from './common/ui/NextBackHeader';
import ProgramBestReviewSection from './ProgramBestReviewSection';
import ProgramDetailBlogReviewSection from './ProgramDetailBlogReviewSection';
import ProgramDetailNavigation, {
  CHALLENGE_DIFFERENT_ID,
  PROGRAM_CURRICULUM_ID,
  PROGRAM_INTRO_ID,
  PROGRAM_REVIEW_ID,
} from './ProgramDetailNavigation';

const {
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

export const challengeColors = {
  _4D55F5: '#4D55F5',
  E45BFF: '#E45BFF',
  F3F4FF: '#F3F4FF',
  FDF6FF: '#FDF6FF',
  _763CFF: '#763CFF',
  _1A1D5F: '#1A1D5F',
  _757BFF: '#757BFF',
  _5C63FF: '#5C63FF',
  _222A7E: '#222A7E',
  _111449: '#111449',
  F2F2F5: '#F2F2F5',
  E8EAFF: '#E8EAFF',
  EDEEFE: '#EDEEFE',
  _4A76FF: '#4A76FF',
  F8AE00: '#F8AE00',
  F0F4FF: '#F0F4FF',
  FFF9EA: '#FFF9EA',
  _4A56FF: '#4A56FF',
  _1A2A5D: '#1A2A5D',
  F3F3F3: '#F3F3F3',
  DEE7FF: '#DEE7FF',
  FFF4DB: '#FFF4DB',
  _14BCFF: '#14BCFF',
  _32B750: '#32B750',
  FF9C34: '#FF9C34',
  EEFAFF: '#EEFAFF',
  FFF7EF: '#FFF7EF',
  _39DEFF: '#39DEFF',
  _20304F: '#20304F',
  EFF4F7: '#EFF4F7',
  F1FBFF: '#F1FBFF',
  DDF5FF: '#DDF5FF',
  E6F9DE: '#E6F9DE',
  F26646: '#F26646',
  FFF6F4: '#FFF6F4',
  EB7900: '#EB7900',
  FF8E36: '#FF8E36 ',
  FFC6B9: '#FFC6B9',
  FFF0ED: '#FFF0ED',
  FB8100: '#FB8100',
  _202776: '#202776',
  FFC8BC: '#FFC8BC',
  _261F1E: '#261F1E',
  ADC3FF: '#ADC3FF',
  B8BBFB: '#B8BBFB',
  A8E6FF: '#A8E6FF',
};

export type ChallengeColor = {
  primary: string;
  basicInfoPrimary?: string | null;
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
  thumbnailBg: string;
};

const ChallengeView: React.FC<{
  challenge: ChallengeIdPrimitive;
  isPreview?: boolean;
}> = ({ challenge, isPreview }) => {
  const { id } = useParams<{ id: string }>();

  const { initProgramApplicationForm } = useProgramStore();

  useEffect(() => {
    initProgramApplicationForm();
  }, [initProgramApplicationForm]);

  const { data: activeChallengeList } = useGetActiveChallenge(
    challenge.challengeType,
  );

  const { data: faqData, isLoading: faqIsLoading } = useGetChallengeFaq(
    id ?? '',
  );

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

  const reviewExists =
    (receivedContent.challengeReview ?? []).length > 0 &&
    receivedContent.blogReview;

  const challengeTransformed = useMemo<ChallengeIdSchema>(() => {
    return {
      ...challenge,
      startDate: challenge.startDate ? dayjs(challenge.startDate) : null,
      endDate: challenge.endDate ? dayjs(challenge.endDate) : null,
      beginning: challenge.beginning ? dayjs(challenge.beginning) : null,
      deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
      priceInfo: challenge.priceInfo.map((price) => ({
        ...price,
        deadline: price.deadline ? dayjs(price.deadline) : null,
      })),
    };
  }, [challenge]);

  const styles = useMemo(() => {
    switch (challenge.challengeType) {
      case CAREER_START:
        return {
          moreReviewMainColor: challengeColors._1A1D5F,
          moreReviewSubColor: challengeColors.E45BFF,
          curriculumBgColor: challengeColors.F2F2F5,
        };
      case PORTFOLIO:
        return {
          moreReviewMainColor: challengeColors._1A2A5D,
          moreReviewSubColor: challengeColors.F8AE00,
          curriculumBgColor: challengeColors.F3F3F3,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          moreReviewMainColor: challengeColors._20304F,
          moreReviewSubColor: challengeColors.FF9C34,
          curriculumBgColor: challengeColors.EFF4F7,
        };
      case EXPERIENCE_SUMMARY:
        return {
          moreReviewMainColor: challengeColors._202776,
          moreReviewSubColor: challengeColors.FB8100,
          curriculumBgColor: challengeColors.F2F2F5,
        };
      case ETC:
        return {
          moreReviewMainColor: challengeColors._202776,
          moreReviewSubColor: challengeColors.FB8100,
          curriculumBgColor: challengeColors.F2F2F5,
        };
      default:
        return {
          moreReviewMainColor: challengeColors._20304F,
          moreReviewSubColor: challengeColors.FF9C34,
          curriculumBgColor: challengeColors.EFF4F7,
        };
    }
  }, [challenge.challengeType]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
          <NextBackHeader hideBack to="/program">
            {challenge.title ?? ''}
          </NextBackHeader>
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
            <section className="flex w-full flex-col items-center pt-[70px] md:pt-40">
              <ChallengePointView
                challengeType={challenge.challengeType}
                point={receivedContent.challengePoint}
                startDate={dayjs(challenge.startDate)}
                endDate={dayjs(challenge.endDate)}
                challengeTitle={challenge.title ?? ''}
                programRecommend={receivedContent.programRecommend}
                deposit={challenge.priceInfo[0].refund ?? 0}
              />
            </section>

            {/* 특별 챌린지, 합격자 후기 */}
            {receivedContent.mainDescription?.root && (
              <section className="flex w-full max-w-[1000px] flex-col px-5 pt-20 md:px-10 md:pt-40 lg:px-0">
                <LexicalContent node={receivedContent.mainDescription?.root} />
              </section>
            )}

            <section className="flex w-full flex-col md:items-center">
              {challenge.challengeType === PORTFOLIO ? (
                <ChallengeIntroPortfolio />
              ) : challenge.challengeType === CAREER_START ? (
                <ChallengeIntroCareerStart
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
              )}
            </section>

            <ChallengeCheckList
              challengeType={challenge.challengeType}
              challengeTitle={challenge.title ?? ''}
            />

            <ChallengeResult
              challengeType={challenge.challengeType}
              challengeTitle={challenge.title ?? ''}
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
              challengeTitle={challenge.title ?? ''}
              challengeType={challenge.challengeType}
              deposit={challenge.priceInfo[0].refund ?? 0}
            />
            <ChallengeBrand challengeType={challenge.challengeType} />
          </div>

          {/* 후기 섹션 */}
          {reviewExists && (
            <section
              id={PROGRAM_REVIEW_ID}
              className="challenge_review flex w-full flex-col items-center gap-y-[70px] md:gap-y-40"
            >
              {(receivedContent.challengeReview ?? []).length > 0 &&
                receivedContent.blogReview && (
                  <div className="flex w-full flex-col items-center bg-neutral-95 py-[70px] md:py-[110px]">
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
              {receivedContent.blogReview && (
                <ProgramDetailBlogReviewSection
                  review={receivedContent.blogReview}
                  programType="challenge"
                />
              )}
            </section>
          )}
          <ChallengeFaq
            faqData={faqData}
            challengeType={challenge.challengeType}
            faqCategory={receivedContent.faqCategory}
          />
          <ChallengeInfoBottom challenge={challengeTransformed} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
