'use client';

import { useGetActiveChallenge } from '@/api/challenge';
import { convertReportTypeToLandingPath, ReportType } from '@/api/report';
import {
  programReviewParam,
  ReviewType,
  useGetProgramReview,
} from '@/api/review';
import { ActiveChallengeType, ChallengeType, PageInfo } from '@/schema';
import MuiPagination from '@components/common/program/pagination/MuiPagination';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import ReviewCard from '@components/ReviewCard';
import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Props {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const ProgramReviewContentSection = ({
  currentPage,
  setCurrentPage,
}: Props) => {
  const searchParams = useSearchParams();
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const programType = searchParams.get('program')?.toUpperCase();
  const challengeType = searchParams.get('challenge')?.toUpperCase();
  const liveJobType = searchParams.get('liveJob');

  const challengeTypeList = challengeType
    ?.split(',')
    .map((value) => value as ChallengeType);
  const liveJobTypeList = liveJobType?.split(',');

  // const onlyMissionReview = reviewType === 'MISSION_REVIEW';

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProgramParams: programReviewParam = {
    types: programType
      ? [programType as ReviewType]
      : ['CHALLENGE_REVIEW', 'LIVE_REVIEW', 'REPORT_REVIEW'],
    challengeTypes: challengeTypeList,
    liveJob: liveJobTypeList,
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

  const getChallengeLink = (
    challengeType: ChallengeType | null,
    programId: number | null,
  ) => {
    const defaultLink = `/program/challenge/${programId}`;

    switch (challengeType) {
      case 'CAREER_START':
        return (
          getActiveChallenge(careerStartChallenge?.challengeList) ?? defaultLink
        );
      case 'DOCUMENT_PREPARATION':
        return (
          getActiveChallenge(documentPreparationChallenge?.challengeList) ??
          defaultLink
        );
      case 'MEETING_PREPARATION':
        return (
          getActiveChallenge(meetingPreparationChallenge?.challengeList) ??
          defaultLink
        );
      case 'ETC':
        return getActiveChallenge(etcChallenge?.challengeList) ?? defaultLink;
      case 'PERSONAL_STATEMENT':
        return (
          getActiveChallenge(personalStatementChallenge?.challengeList) ??
          defaultLink
        );
      case 'PORTFOLIO':
        return (
          getActiveChallenge(portfolioChallenge?.challengeList) ?? defaultLink
        );
      case 'PERSONAL_STATEMENT_LARGE_CORP':
        return (
          getActiveChallenge(largeCorpChallenge?.challengeList) ?? defaultLink
        );
      default:
        return defaultLink;
    }
  };

  const getThumbnailLink = (
    reviewType: ReviewType | null,
    challengeType: ChallengeType | null,
    reportType: ReportType | null,
    programId: number | null,
  ): string | undefined => {
    if (reviewType === 'CHALLENGE_REVIEW' || reviewType === 'MISSION_REVIEW') {
      return getChallengeLink(challengeType, programId);
    }
    if (reviewType === 'LIVE_REVIEW') {
      return `/program/live/${programId}`;
    }
    if (reviewType === 'REPORT_REVIEW') {
      return reportType
        ? convertReportTypeToLandingPath(reportType)
        : undefined;
    }
    return undefined;
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
    <div className="flex w-full flex-col gap-y-8 px-5 md:gap-y-12 md:px-0">
      {isLoading ? (
        <LoadingContainer className="h-64" />
      ) : !reviewData || reviewData.reviewList.length < 1 ? (
        <EmptyContainer text="등록된 후기가 없습니다." />
      ) : (
        <div className="flex w-full flex-col gap-y-6">
          {reviewData.reviewList.map((review) => (
            <ReviewCard
              key={review.reviewInfo.reviewId}
              review={review}
              showThumbnail
              thumbnailLink={getThumbnailLink(
                review.reviewInfo.type ?? null,
                review.reviewInfo.challengeType ?? null,
                review.reviewInfo.reportType ?? null,
                review.reviewInfo.programId ?? null,
              )}
              expandable
              gap="large"
            />
          ))}
        </div>
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

export default ProgramReviewContentSection;
