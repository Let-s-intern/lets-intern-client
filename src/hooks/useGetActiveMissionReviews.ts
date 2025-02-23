import { useGetProgramReview } from '@/api/review';
import { FilterItem } from '@/types/common';
import { challengeTypes, challengeTypeToDisplay } from '@/utils/convert';
import { useEffect, useState } from 'react';

export const challengeTypeFilterList: FilterItem[] = challengeTypes
  .filter((type) => type !== 'ETC')
  .map((item) => ({
    caption: challengeTypeToDisplay[item],
    value: item,
  }));

const useGetActiveMissionReviews = () => {
  const [challengeTypeFilter, setChallengeTypeFilter] = useState<FilterItem[]>(
    challengeTypeFilterList,
  );
  const { data: careerStartReview, isLoading: careerStartIsLoding } =
    useGetProgramReview({
      types: ['MISSION_REVIEW'],
      challengeTypes: ['CAREER_START'],
      page: 1,
      size: 1,
    });

  const { data: documentReview, isLoading: documentIsLoading } =
    useGetProgramReview({
      types: ['MISSION_REVIEW'],
      challengeTypes: ['DOCUMENT_PREPARATION'],
      page: 1,
      size: 1,
    });

  const { data: meetingReview, isLoading: meetingIsLoading } =
    useGetProgramReview({
      types: ['MISSION_REVIEW'],
      challengeTypes: ['MEETING_PREPARATION'],
      page: 1,
      size: 1,
    });

  const { data: personalReview, isLoading: personalIsLoading } =
    useGetProgramReview({
      types: ['MISSION_REVIEW'],
      challengeTypes: ['PERSONAL_STATEMENT'],
      page: 1,
      size: 1,
    });

  const { data: portfolioReview, isLoading: portfolioIsLoading } =
    useGetProgramReview({
      types: ['MISSION_REVIEW'],
      challengeTypes: ['PORTFOLIO'],
      page: 1,
      size: 1,
    });

  const { data: largeCorpReview, isLoading: largeCorpIsLoading } =
    useGetProgramReview({
      types: ['MISSION_REVIEW'],
      challengeTypes: ['PERSONAL_STATEMENT_LARGE_CORP'],
      page: 1,
      size: 1,
    });

  const isMissionLoading =
    careerStartIsLoding ||
    documentIsLoading ||
    meetingIsLoading ||
    personalIsLoading ||
    portfolioIsLoading ||
    largeCorpIsLoading;

  useEffect(() => {
    if (
      !isMissionLoading &&
      careerStartReview &&
      documentReview &&
      meetingReview &&
      personalReview &&
      portfolioReview &&
      largeCorpReview
    ) {
      setChallengeTypeFilter(
        challengeTypeFilterList.filter((item) => {
          switch (item.value) {
            case 'CAREER_START':
              return careerStartReview?.pageInfo.totalElements > 0;
            case 'DOCUMENT_PREPARATION':
              return documentReview?.pageInfo.totalElements > 0;
            case 'MEETING_PREPARATION':
              return meetingReview?.pageInfo.totalElements > 0;
            case 'PERSONAL_STATEMENT':
              return personalReview?.pageInfo.totalElements > 0;
            case 'PORTFOLIO':
              return portfolioReview?.pageInfo.totalElements > 0;
            case 'PERSONAL_STATEMENT_LARGE_CORP':
              return largeCorpReview?.pageInfo.totalElements > 0;
            default:
              return true;
          }
        }),
      );
    }
  }, [
    isMissionLoading,
    careerStartReview,
    documentReview,
    meetingReview,
    personalReview,
    portfolioReview,
    largeCorpReview,
  ]);

  return {
    challengeTypeFilter,
    isMissionLoading,
  };
};

export default useGetActiveMissionReviews;
