import { useGetProgramReview } from '@/api/review/review';
import { liveJobList } from '@/schema';
import { FilterItem } from '@/types/common';
import { challengeTypes, challengeTypeToDisplay } from '@/utils/convert';

import { useEffect, useState } from 'react';

export const liveJobFilterList: FilterItem[] = liveJobList.map((item) => ({
  caption: item,
  value: item,
}));

export const challengeTypeFilterList: FilterItem[] = challengeTypes
  .filter((type) => type !== 'ETC')
  .map((item) => ({
    caption: challengeTypeToDisplay[item],
    value: item,
  }));

const useGetActiveReviews = () => {
  const [challengeTypeFilter, setChallengeTypeFilter] = useState<FilterItem[]>(
    challengeTypeFilterList,
  );
  const [liveJobTypeFilter, setLiveJobTypeFilter] =
    useState<FilterItem[]>(liveJobFilterList);

  const { data: careerStartReview, isLoading: careerStartIsLoding } =
    useGetProgramReview({
      types: ['CHALLENGE_REVIEW'],
      challengeTypes: ['CAREER_START'],
      page: 1,
      size: 1,
    });

  const { data: documentReview, isLoading: documentIsLoading } =
    useGetProgramReview({
      types: ['CHALLENGE_REVIEW'],
      challengeTypes: ['DOCUMENT_PREPARATION'],
      page: 1,
      size: 1,
    });

  const { data: meetingReview, isLoading: meetingIsLoading } =
    useGetProgramReview({
      types: ['CHALLENGE_REVIEW'],
      challengeTypes: ['MEETING_PREPARATION'],
      page: 1,
      size: 1,
    });

  const { data: personalReview, isLoading: personalIsLoading } =
    useGetProgramReview({
      types: ['CHALLENGE_REVIEW'],
      challengeTypes: ['PERSONAL_STATEMENT'],
      page: 1,
      size: 1,
    });

  const { data: portfolioReview, isLoading: portfolioIsLoading } =
    useGetProgramReview({
      types: ['CHALLENGE_REVIEW'],
      challengeTypes: ['PORTFOLIO'],
      page: 1,
      size: 1,
    });

  const { data: largeCorpReview, isLoading: largeCorpIsLoading } =
    useGetProgramReview({
      types: ['CHALLENGE_REVIEW'],
      challengeTypes: ['PERSONAL_STATEMENT_LARGE_CORP'],
      page: 1,
      size: 1,
    });

  const { data: largeCorpLiveReview, isLoading: largeCorpLiveIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['대기업 준비'],
      page: 1,
      size: 1,
    });

  const { data: letscareerReview, isLoading: letscareerIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['렛커시리즈'],
      page: 1,
      size: 1,
    });
  // 경영관리, 금융, 마케팅, 광고, 디자인, 방송, 개발, 영업, 서비스기획, 사업전략, 컨설팅, 유통, 공정연구
  const { data: managementReview, isLoading: managementIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['경영관리'],
      page: 1,
      size: 1,
    });

  const { data: financeReview, isLoading: financeIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['금융'],
      page: 1,
      size: 1,
    });

  const { data: marketingReview, isLoading: marketingIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['마케팅'],
      page: 1,
      size: 1,
    });

  const { data: adReview, isLoading: adIsLoading } = useGetProgramReview({
    types: ['LIVE_REVIEW'],
    liveJob: ['광고'],
    page: 1,
    size: 1,
  });

  const { data: designReview, isLoading: designIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['디자인'],
      page: 1,
      size: 1,
    });

  const { data: broadcastReview, isLoading: broadcastIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['방송'],
      page: 1,
      size: 1,
    });

  const { data: developmentReview, isLoading: developmentIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['개발'],
      page: 1,
      size: 1,
    });

  const { data: salesReview, isLoading: salesIsLoading } = useGetProgramReview({
    types: ['LIVE_REVIEW'],
    liveJob: ['영업'],
    page: 1,
    size: 1,
  });

  const { data: servicePlanReview, isLoading: servicePlanIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['서비스기획'],
      page: 1,
      size: 1,
    });

  const { data: businessStrategyReview, isLoading: businessStrategyIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['사업전략'],
      page: 1,
      size: 1,
    });

  const { data: consultingReview, isLoading: consultingIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['컨설팅'],
      page: 1,
      size: 1,
    });

  const { data: distributionReview, isLoading: distributionIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['유통'],
      page: 1,
      size: 1,
    });

  const { data: fairTradeReview, isLoading: fairTradeIsLoading } =
    useGetProgramReview({
      types: ['LIVE_REVIEW'],
      liveJob: ['공정연구'],
      page: 1,
      size: 1,
    });

  const isChallengeLoading =
    careerStartIsLoding ||
    documentIsLoading ||
    meetingIsLoading ||
    personalIsLoading ||
    portfolioIsLoading ||
    largeCorpIsLoading;

  const isLiveLoading =
    largeCorpLiveIsLoading ||
    letscareerIsLoading ||
    managementIsLoading ||
    financeIsLoading ||
    marketingIsLoading ||
    adIsLoading ||
    designIsLoading ||
    broadcastIsLoading ||
    developmentIsLoading ||
    salesIsLoading ||
    servicePlanIsLoading ||
    businessStrategyIsLoading ||
    consultingIsLoading ||
    distributionIsLoading ||
    fairTradeIsLoading;

  useEffect(() => {
    if (
      !isChallengeLoading &&
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
    isChallengeLoading,
    careerStartReview,
    documentReview,
    meetingReview,
    personalReview,
    portfolioReview,
    largeCorpReview,
  ]);

  useEffect(() => {
    if (
      !isLiveLoading &&
      largeCorpLiveReview &&
      letscareerReview &&
      managementReview &&
      financeReview &&
      marketingReview &&
      adReview &&
      designReview &&
      broadcastReview &&
      developmentReview &&
      salesReview &&
      servicePlanReview &&
      businessStrategyReview &&
      consultingReview &&
      distributionReview &&
      fairTradeReview
    ) {
      setLiveJobTypeFilter(
        liveJobFilterList.filter((item) => {
          switch (item.value) {
            case '대기업 준비':
              return largeCorpLiveReview?.pageInfo.totalElements > 0;
            case '렛커시리즈':
              return letscareerReview?.pageInfo.totalElements > 0;
            case '경영관리':
              return managementReview?.pageInfo.totalElements > 0;
            case '금융':
              return financeReview?.pageInfo.totalElements > 0;
            case '마케팅':
              return marketingReview?.pageInfo.totalElements > 0;
            case '광고':
              return adReview?.pageInfo.totalElements > 0;
            case '디자인':
              return designReview?.pageInfo.totalElements > 0;
            case '방송':
              return broadcastReview?.pageInfo.totalElements > 0;
            case '개발':
              return developmentReview?.pageInfo.totalElements > 0;
            case '영업':
              return salesReview?.pageInfo.totalElements > 0;
            case '서비스기획':
              return servicePlanReview?.pageInfo.totalElements > 0;
            case '사업전략':
              return businessStrategyReview?.pageInfo.totalElements > 0;
            case '컨설팅':
              return consultingReview?.pageInfo.totalElements > 0;
            case '유통':
              return distributionReview?.pageInfo.totalElements > 0;
            case '공정연구':
              return fairTradeReview?.pageInfo.totalElements > 0;
            default:
              return true;
          }
        }),
      );
    }
  }, [
    isLiveLoading,
    largeCorpLiveReview,
    letscareerReview,
    managementReview,
    financeReview,
    marketingReview,
    adReview,
    designReview,
    broadcastReview,
    developmentReview,
    salesReview,
    servicePlanReview,
    businessStrategyReview,
    consultingReview,
    distributionReview,
    fairTradeReview,
  ]);

  return {
    challengeTypeFilter,
    isChallengeLoading,
    liveJobTypeFilter,
    isLiveLoading,
  };
};

export default useGetActiveReviews;
