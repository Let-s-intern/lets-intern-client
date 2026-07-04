import {
  useGetActiveChallenge,
  useGetChallengeFaq,
} from '@/api/challenge/challenge';
import dayjs from '@/lib/dayjs';
import {
  ChallengeIdPrimitive,
  ChallengeIdSchema,
  challengeTypeSchema,
} from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import { ChallengeContent } from '@/types/interface';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { challengeColors } from './challengeColors';

const {
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

/**
 * ChallengeView / ChallengePortfolioView 가 공유하던 파생 로직.
 * 두 뷰 컴포넌트에 동일 코드가 중복돼 있어 하나의 훅으로 통합한다.
 */
export function useChallengeDetailView(challenge: ChallengeIdPrimitive) {
  const { id } = useParams<{ id: string }>();

  const isResumeTemplate = useMemo(() => {
    return Number(id) >= 143 && challenge.challengeType === CAREER_START;
  }, [challenge.challengeType, id]);

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

  const weekText = receivedContent.challengePoint?.weekText ?? '2주';

  const hasChallengeReviews =
    (receivedContent.challengeReview ?? []).length > 0;
  const hasBlogReviews =
    (receivedContent.blogReview?.list ?? []).length > 0 ||
    (receivedContent.externalBlogReviews ?? []).length > 0;
  const reviewExists = hasChallengeReviews || hasBlogReviews;

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

  return {
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
  };
}
