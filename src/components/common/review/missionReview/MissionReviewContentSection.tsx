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

  const { data: careerStartChallenge } = useGetActiveChallenge('CAREER_START');
  const { data: documentPreparationChallenge } = useGetActiveChallenge(
    'DOCUMENT_PREPARATION',
  );
  const { data: meetingPreparationChallenge } = useGetActiveChallenge(
    'MEETING_PREPARATION',
  );
  const { data: etcChallenge } = useGetActiveChallenge('ETC');
  const { data: personalStatementChallenge } =
    useGetActiveChallenge('PERSONAL_STATEMENT');
  const { data: portfolioChallenge } = useGetActiveChallenge('PORTFOLIO');
  const { data: largeCorpChallenge } = useGetActiveChallenge(
    'PERSONAL_STATEMENT_LARGE_CORP',
  );

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

  useEffect(() => {
    if (reviewData) {
      setPageInfo(reviewData.pageInfo);
    }
  }, [reviewData, pageInfo]);

  return (
    <div className="flex flex-col w-full px-5 pb-12 gap-y-6 md:pr-5 md:pl-0 lg:px-0 md:pb-8">
      {reviewDataIsLoading ? (
        <LoadingContainer className="h-64" />
      ) : !reviewData || reviewData.reviewList.length < 1 ? (
        <div className="flex items-center justify-center bg-neutral-95 rounded-ms text-xsmall14 text-neutral-40 h-60">
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
