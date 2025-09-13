import { useGetChallengeHome } from '@/api/challenge';
import { SubNavItemProps } from '@/components/common/ui/layout/header/SubNavItem';
import {
  challengeTypeSchema,
  ProgramClassificationEnum,
  ProgramStatusEnum,
} from '@/schema';

const {
  EXPERIENCE_SUMMARY,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  PORTFOLIO,
  MARKETING,
} = challengeTypeSchema.enum;

// 챌린지 타입별 분류 매핑
const CHALLENGE_TYPE_TO_CLASSIFICATION = {
  [EXPERIENCE_SUMMARY]: ProgramClassificationEnum.enum.CAREER_SEARCH, // 커리어 시작
  [PERSONAL_STATEMENT]: ProgramClassificationEnum.enum.DOCUMENT_PREPARATION, // 자기소개서
  [PORTFOLIO]: ProgramClassificationEnum.enum.DOCUMENT_PREPARATION, // 포트폴리오
  [MARKETING]: ProgramClassificationEnum.enum.DOCUMENT_PREPARATION, // 마케팅
  [PERSONAL_STATEMENT_LARGE_CORP]:
    ProgramClassificationEnum.enum.DOCUMENT_PREPARATION, // 대기업 자소서
} as const;

export default function useProgramCategoryNav(isNextRouter: boolean) {
  // 각 챌린지 타입별로 모집중인 챌린지 조회
  const { data: experienceSummaryData } = useGetChallengeHome({
    type: EXPERIENCE_SUMMARY,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[EXPERIENCE_SUMMARY]],
    statusList: [ProgramStatusEnum.enum.PROCEEDING], // 모집중
  });

  const { data: personalStatementData } = useGetChallengeHome({
    type: PERSONAL_STATEMENT,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[PERSONAL_STATEMENT]],
    statusList: [ProgramStatusEnum.enum.PROCEEDING], // 모집중
  });

  const { data: personalStatementLargeCorpData } = useGetChallengeHome({
    type: PERSONAL_STATEMENT_LARGE_CORP,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[PERSONAL_STATEMENT_LARGE_CORP]],
    statusList: [ProgramStatusEnum.enum.PROCEEDING], // 모집중
  });

  const { data: portfolioData } = useGetChallengeHome({
    type: PORTFOLIO,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[PORTFOLIO]],
    statusList: [ProgramStatusEnum.enum.PROCEEDING], // 모집중
  });

  const { data: marketingData } = useGetChallengeHome({
    type: MARKETING,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[MARKETING]],
    statusList: [ProgramStatusEnum.enum.PROCEEDING], // 모집중
  });

  // 모집중이 아닌 경우를 위한 추가 쿼리들 (모집마감된 챌린지들)
  const { data: experienceSummaryClosedData } = useGetChallengeHome({
    type: EXPERIENCE_SUMMARY,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[EXPERIENCE_SUMMARY]],
    statusList: [ProgramStatusEnum.enum.POST], // 모집마감
  });

  const { data: personalStatementClosedData } = useGetChallengeHome({
    type: PERSONAL_STATEMENT,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[PERSONAL_STATEMENT]],
    statusList: [ProgramStatusEnum.enum.POST], // 모집마감
  });

  const { data: personalStatementLargeCorpClosedData } = useGetChallengeHome({
    type: PERSONAL_STATEMENT_LARGE_CORP,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[PERSONAL_STATEMENT_LARGE_CORP]],
    statusList: [ProgramStatusEnum.enum.POST], // 모집마감
  });

  const { data: portfolioClosedData } = useGetChallengeHome({
    type: PORTFOLIO,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[PORTFOLIO]],
    statusList: [ProgramStatusEnum.enum.POST], // 모집마감
  });

  const { data: marketingClosedData } = useGetChallengeHome({
    type: MARKETING,
    typeList: [CHALLENGE_TYPE_TO_CLASSIFICATION[MARKETING]],
    statusList: [ProgramStatusEnum.enum.POST], // 모집마감
  });

  // 챌린지 선택 로직: 모집중 우선, 없으면 모집마감 중 가장 최근 마감일자
  const getCurrentChallenge = (type: string): string | undefined => {
    const getChallengeUrl = (challenge: {
      id: number;
      title?: string | null;
    }) => {
      return `/program/challenge/${challenge.id}/${encodeURIComponent(challenge.title ?? '')}`;
    };

    const getMostRecentClosedChallenge = (
      closedData:
        | {
            programList?: Array<{
              deadline?: string | null;
              id: number;
              title?: string | null;
            }>;
          }
        | undefined,
    ) => {
      if (!closedData?.programList?.length) return undefined;

      // 마감일자 기준으로 정렬 (최신순)
      const sortedChallenges = [...closedData.programList].sort((a, b) => {
        const deadlineA = new Date(a.deadline || '').getTime();
        const deadlineB = new Date(b.deadline || '').getTime();
        return deadlineB - deadlineA; // 내림차순 (최신순)
      });

      return sortedChallenges[0];
    };

    switch (type) {
      case EXPERIENCE_SUMMARY:
        // 모집중인 챌린지가 있으면 우선 선택
        if (
          experienceSummaryData?.programList &&
          experienceSummaryData.programList.length > 0
        ) {
          return getChallengeUrl(experienceSummaryData.programList[0]);
        }
        // 없으면 모집마감된 챌린지 중 가장 최근 마감일자
        const recentClosedExperience = getMostRecentClosedChallenge(
          experienceSummaryClosedData,
        );
        return recentClosedExperience
          ? getChallengeUrl(recentClosedExperience)
          : undefined;

      case PERSONAL_STATEMENT:
        if (
          personalStatementData?.programList &&
          personalStatementData.programList.length > 0
        ) {
          return getChallengeUrl(personalStatementData.programList[0]);
        }
        const recentClosedPersonal = getMostRecentClosedChallenge(
          personalStatementClosedData,
        );
        return recentClosedPersonal
          ? getChallengeUrl(recentClosedPersonal)
          : undefined;

      case PERSONAL_STATEMENT_LARGE_CORP:
        if (
          personalStatementLargeCorpData?.programList &&
          personalStatementLargeCorpData.programList.length > 0
        ) {
          return getChallengeUrl(personalStatementLargeCorpData.programList[0]);
        }
        const recentClosedLargeCorp = getMostRecentClosedChallenge(
          personalStatementLargeCorpClosedData,
        );
        return recentClosedLargeCorp
          ? getChallengeUrl(recentClosedLargeCorp)
          : undefined;

      case PORTFOLIO:
        if (
          portfolioData?.programList &&
          portfolioData.programList.length > 0
        ) {
          return getChallengeUrl(portfolioData.programList[0]);
        }
        const recentClosedPortfolio =
          getMostRecentClosedChallenge(portfolioClosedData);
        return recentClosedPortfolio
          ? getChallengeUrl(recentClosedPortfolio)
          : undefined;

      case MARKETING:
        if (
          marketingData?.programList &&
          marketingData.programList.length > 0
        ) {
          return getChallengeUrl(marketingData.programList[0]);
        }
        const recentClosedMarketing =
          getMostRecentClosedChallenge(marketingClosedData);
        return recentClosedMarketing
          ? getChallengeUrl(recentClosedMarketing)
          : undefined;

      default:
        return undefined;
    }
  };

  const programCategoryLists: SubNavItemProps[] = [
    {
      children: '전체 프로그램',
      href: `/program`,
      isNextRouter,
      force: isNextRouter,
    },
    {
      children: '경험정리 챌린지',
      href: getCurrentChallenge(EXPERIENCE_SUMMARY),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '자기소개서 완성 챌린지',
      href: getCurrentChallenge(PERSONAL_STATEMENT),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '포트폴리오 완성 챌린지',
      href: getCurrentChallenge(PORTFOLIO),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '마케팅 서류 완성 챌린지',
      href: getCurrentChallenge(MARKETING),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '대기업 완성 챌린지',
      href: getCurrentChallenge(PERSONAL_STATEMENT_LARGE_CORP),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '현직자 LIVE 클래스',
      href: '/program?type=LIVE',
      isNextRouter,
      force: isNextRouter,
    },

    {
      children: '취준위키 VOD',
      href: '/program?type=VOD',
      isNextRouter,
      force: isNextRouter,
    },
  ];

  return programCategoryLists;
}
