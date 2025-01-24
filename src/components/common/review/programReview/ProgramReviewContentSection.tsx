'use client';

import {
  programReviewParam,
  ReviewType,
  useGetProgramReview,
} from '@/api/review';
import { ChallengeType, PageInfo } from '@/schema';
import MuiPagination from '@components/common/program/pagination/MuiPagination';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import ReviewCard from '@components/ReviewCard';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProgramReviewContentSection = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const programType = searchParams.get('PROGRAM');
  const challengeType = searchParams.get('CHALLENGE');
  const reviewType = searchParams.get('REVIEW');

  const onlyMissionReview = reviewType === 'MISSION_REVIEW';

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
    if (pageInfo) {
      setPageInfo({ ...pageInfo, pageNum: page - 1 });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProgramParams: programReviewParam = {
    types: programType
      ? programType === 'CHALLENGE_REVIEW'
        ? reviewType
          ? onlyMissionReview
            ? ['MISSION_REVIEW']
            : ['CHALLENGE_REVIEW']
          : ['CHALLENGE_REVIEW', 'MISSION_REVIEW']
        : [programType as ReviewType]
      : undefined,
    challengeTypes: challengeType
      ? challengeType.split(',').map((value) => value as ChallengeType)
      : undefined,
    page: currentPage,
    size: 10,
  };

  const { data: reviewData, isLoading: reviewDataIsLoading } =
    useGetProgramReview(getProgramParams);

  useEffect(() => {
    if (reviewData && !pageInfo) {
      setPageInfo(reviewData.pageInfo);
    }
  }, [reviewData, pageInfo]);

  return (
    <div className="w-full px-5 flex flex-col gap-y-6 md:pr-5 md:pl-0 lg:px-0 pb-12 md:pb-8">
      {reviewDataIsLoading ? (
        <LoadingContainer />
      ) : (
        reviewData?.reviewList.map((review) => (
          <ReviewCard key={review.reviewInfo.reviewId} review={review} />
        ))
      )}
      {pageInfo && (
        <MuiPagination
          page={currentPage + 1}
          pageInfo={pageInfo}
          onChange={(event, page) => {
            handlePageChange(page);
          }}
        />
      )}
    </div>
  );
};

export default ProgramReviewContentSection;
