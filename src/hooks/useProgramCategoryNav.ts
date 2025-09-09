import { useGetChallengeHome } from '@/api/challenge';
import { SubNavItemProps } from '@/components/common/ui/layout/header/SubNavItem';
import { challengeTypeSchema } from '@/schema';

const {
  EXPERIENCE_SUMMARY,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  PORTFOLIO,
  MARKETING,
} = challengeTypeSchema.enum;

export default function useProgramCategoryNav(isNextRouter: boolean) {
  const { data: experienceSummaryData } = useGetChallengeHome({
    type: EXPERIENCE_SUMMARY,
  });
  const { data: personalStatementData } = useGetChallengeHome({
    type: PERSONAL_STATEMENT,
  });
  const { data: personalStatementLargeCorpData } = useGetChallengeHome({
    type: PERSONAL_STATEMENT_LARGE_CORP,
  });
  const { data: portfolioData } = useGetChallengeHome({ type: PORTFOLIO });
  const { data: marketingData } = useGetChallengeHome({ type: MARKETING });

  // IntroSection과 동일한 getCurrentChallenge 로직 사용
  const getCurrentChallenge = (type: string): string | undefined => {
    switch (type) {
      case EXPERIENCE_SUMMARY:
        return experienceSummaryData &&
          experienceSummaryData.programList.length > 0
          ? `/program/challenge/${experienceSummaryData.programList[0].id}/${encodeURIComponent(experienceSummaryData.programList[0].title ?? '')}`
          : undefined;
      case PERSONAL_STATEMENT:
        return personalStatementData &&
          personalStatementData.programList.length > 0
          ? `/program/challenge/${personalStatementData.programList[0].id}/${encodeURIComponent(personalStatementData.programList[0].title ?? '')}`
          : undefined;
      case PERSONAL_STATEMENT_LARGE_CORP:
        return personalStatementLargeCorpData &&
          personalStatementLargeCorpData.programList.length > 0
          ? `/program/challenge/${personalStatementLargeCorpData.programList[0].id}/${encodeURIComponent(personalStatementLargeCorpData.programList[0].title ?? '')}`
          : undefined;
      case PORTFOLIO:
        return portfolioData && portfolioData.programList.length > 0
          ? `/program/challenge/${portfolioData.programList[0].id}/${encodeURIComponent(portfolioData.programList[0].title ?? '')}`
          : undefined;
      case MARKETING:
        return marketingData && marketingData.programList.length > 0
          ? `/program/challenge/${marketingData.programList[0].id}/${encodeURIComponent(marketingData.programList[0].title ?? '')}`
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
