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

  const colors = useMemo<ChallengeColor>(() => {
    let primary = '';
    let primaryLight = '';
    let secondary = '';
    let secondaryLight = '';
    let gradient = ''; // After 배지 배경색에 사용
    let dark = ''; // 진행방식,결과물 배경색
    let basicInfoPrimary = null; // 기본정보 기본색
    let subTitle = '';
    let subBg = '';
    let gradientBg = '';
    let curriculumBg = ''; // 커리큘럼 배경색
    let recommendBg = ''; // 프로그램 추천 배경색
    let recommendLogo = ''; // 프로그램 추천 로고색
    let thumbnailBg = ''; // 썸네일 배경색

    switch (challenge.challengeType) {
      case CAREER_START:
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
        recommendBg = '#F3F4FF';
        recommendLogo = '#E8EAFF';
        thumbnailBg = '#EDEEFE';
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
        thumbnailBg = '#FFF4DB';
        break;
      case PERSONAL_STATEMENT_LARGE_CORP:
        primary = '#14BCFF';
        basicInfoPrimary = '#32B750';
        secondary = '#FF9C34';
        primaryLight = '#EEFAFF';
        secondaryLight = '#FFF7EF';
        gradient = '#39DEFF';
        dark = '#20304F';

        subTitle = '#FF9C34';
        subBg = '#FFF7EF';
        gradientBg =
          'linear-gradient(180deg,#222A7E 0%,#111449 50%,#111449 100%)';
        curriculumBg = '#EFF4F7';
        recommendBg = '#F1FBFF';
        recommendLogo = '#DDF5FF';
        thumbnailBg = '#E6F9DE';
        break;
      case EXPERIENCE_SUMMARY:
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
        recommendBg = '#F3F4FF';
        recommendLogo = '#E8EAFF';
        thumbnailBg = '#EDEEFE';
        break;
      default: // 자소서, 마케팅
        primary = '#14BCFF';
        secondary = '#FF9C34';
        primaryLight = '#EEFAFF';
        secondaryLight = '#FFF7EF';
        gradient = '#39DEFF';
        dark = '#20304F';

        subTitle = '#FF9C34';
        subBg = '#FFF7EF';
        gradientBg =
          'linear-gradient(180deg,#222A7E 0%,#111449 50%,#111449 100%)';
        curriculumBg = '#EFF4F7';
        recommendBg = '#F1FBFF';
        recommendLogo = '#DDF5FF';
        thumbnailBg = '#EEFAFF';
    }
    return {
      primary,
      basicInfoPrimary,
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
      thumbnailBg,
    };
  }, [challenge.challengeType]);

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
              ) : challenge.challengeType === EXPERIENCE_SUMMARY ? (
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
                style={{ backgroundColor: colors.curriculumBg }}
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
              colors={colors}
              challengeType={challenge.challengeType}
              deposit={challenge.priceInfo[0].refund ?? 0}
            />
            <ChallengeBrand colors={colors} />
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
                      colors={colors}
                    />
                    <MoreReviewButton
                      type={'CHALLENGE'}
                      challengeType={challenge.challengeType}
                      mainColor={colors.dark}
                      subColor={colors.secondary}
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
            colors={colors}
            faqCategory={receivedContent.faqCategory}
          />
          <ChallengeInfoBottom
            challenge={challengeTransformed}
            colors={colors}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
