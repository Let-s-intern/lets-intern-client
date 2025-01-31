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

  const programType = searchParams.get('program')?.toUpperCase();
  const challengeType = searchParams.get('challenge')?.toUpperCase();
  // const reviewType = searchParams.get('REVIEW');

  const challengeTypeList = challengeType
    ?.split(',')
    .map((value) => value as ChallengeType);

  // const onlyMissionReview = reviewType === 'MISSION_REVIEW';

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
    if (pageInfo) {
      setPageInfo({ ...pageInfo, pageNum: page - 1 });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProgramParams: programReviewParam = {
    types: programType
      ? [programType as ReviewType]
      : ['CHALLENGE_REVIEW', 'LIVE_REVIEW', 'REPORT_REVIEW'],
    challengeTypes: challengeTypeList,
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
      ) : !reviewData || reviewData.reviewList.length < 1 ? (
        <div className="flex justify-center bg-neutral-95 rounded-ms text-xsmall14 text-neutral-40 items-center h-40">
          등록된 후기가 없습니다.
        </div>
      ) : (
        reviewData.reviewList.map((review) => (
          <ReviewCard key={review.reviewInfo.reviewId} review={review} />
        ))
      )}
      {pageInfo && pageInfo.totalPages > 0 && (
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
