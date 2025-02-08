'use client';

import { useGetActiveChallenge } from '@/api/challenge';
import { programReviewParam, useGetProgramReview } from '@/api/review';
import { ActiveChallengeType, ChallengeType, PageInfo } from '@/schema';
import MuiPagination from '@components/common/program/pagination/MuiPagination';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import ReviewCard from '@components/ReviewCard';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MissionReviewContentSection = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const challengeType = searchParams.get('challenge')?.toUpperCase();

  const challengeTypeList = challengeType
    ?.split(',')
    .map((value) => value as ChallengeType);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProgramParams: programReviewParam = {
    types: ['MISSION_REVIEW'],
    challengeTypes: challengeTypeList,
    page: currentPage,
    size: 10,
  };

  const { data: reviewData, isLoading: reviewDataIsLoading } =
    useGetProgramReview(getProgramParams);

  const {
    data: careerStartChallenge,
    isLoading: careerStartChallengeIsLoading,
  } = useGetActiveChallenge('CAREER_START');
  const {
    data: documentPreparationChallenge,
    isLoading: documentPreparationChallengeIsLoading,
  } = useGetActiveChallenge('DOCUMENT_PREPARATION');
  const {
    data: meetingPreparationChallenge,
    isLoading: meetingPreparationChallengeIsLoading,
  } = useGetActiveChallenge('MEETING_PREPARATION');
  const { data: etcChallenge, isLoading: etcChallengeIsLoading } =
    useGetActiveChallenge('ETC');
  const {
    data: personalStatementChallenge,
    isLoading: personalStatementChallengeIsLoading,
  } = useGetActiveChallenge('PERSONAL_STATEMENT');
  const { data: portfolioChallenge, isLoading: portfolioChallengeIsLoading } =
    useGetActiveChallenge('PORTFOLIO');
  const { data: largeCorpChallenge, isLoading: largeCorpChallengeIsLoading } =
    useGetActiveChallenge('PERSONAL_STATEMENT_LARGE_CORP');

  const getActiveChallenge = (list: ActiveChallengeType[] | undefined) => {
    if (!list || list.length < 1) {
      return undefined;
    }
    return `/program/challenge/${list[0].id}`;
  };

  const getChallengeLink = (challengeType: ChallengeType | null) => {
    switch (challengeType) {
      case 'CAREER_START':
        return getActiveChallenge(careerStartChallenge?.challengeList);
      case 'DOCUMENT_PREPARATION':
        return getActiveChallenge(documentPreparationChallenge?.challengeList);
      case 'MEETING_PREPARATION':
        return getActiveChallenge(meetingPreparationChallenge?.challengeList);
      case 'ETC':
        return getActiveChallenge(etcChallenge?.challengeList);
      case 'PERSONAL_STATEMENT':
        return getActiveChallenge(personalStatementChallenge?.challengeList);
      case 'PORTFOLIO':
        return getActiveChallenge(portfolioChallenge?.challengeList);
      case 'PERSONAL_STATEMENT_LARGE_CORP':
        return getActiveChallenge(largeCorpChallenge?.challengeList);
      default:
        return undefined;
    }
  };

  const isLoading =
    reviewDataIsLoading ||
    careerStartChallengeIsLoading ||
    documentPreparationChallengeIsLoading ||
    meetingPreparationChallengeIsLoading ||
    etcChallengeIsLoading ||
    personalStatementChallengeIsLoading ||
    portfolioChallengeIsLoading ||
    largeCorpChallengeIsLoading;

  useEffect(() => {
    if (reviewData) {
      setPageInfo(reviewData.pageInfo);
    }
  }, [reviewData, pageInfo]);

  return (
    <div className="flex w-full flex-col gap-y-8 px-5 pb-12 md:gap-y-12 md:px-0 md:pb-8">
      {isLoading ? (
        <LoadingContainer className="h-64" />
      ) : !reviewData || reviewData.reviewList.length < 1 ? (
        <div className="flex h-60 items-center justify-center rounded-ms bg-neutral-95 text-xsmall14 text-neutral-40">
          등록된 후기가 없습니다.
        </div>
      ) : (
        reviewData.reviewList.map((review) => (
          <ReviewCard
            key={review.reviewInfo.reviewId}
            review={review}
            showThumbnail
            thumbnailLink={getChallengeLink(
              review.reviewInfo.challengeType ?? null,
            )}
            expandable
            gap="large"
          />
        ))
      )}
      {pageInfo && pageInfo.totalPages > 0 && (
        <MuiPagination
          page={currentPage}
          pageInfo={pageInfo}
          onChange={(event, page) => {
            handlePageChange(page);
          }}
        />
      )}
    </div>
  );
};

export default MissionReviewContentSection;
