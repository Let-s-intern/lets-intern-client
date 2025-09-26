import { useGetActiveChallenge, useGetChallengeHome } from '@/api/challenge';
import useIsB2BChallenge from './useIsB2BChallenge';
import { SubNavItemProps } from '@/components/common/ui/layout/header/SubNavItem';
import {
  ActiveChallengeResponse,
  ChallengeList,
  challengeTypeSchema,
} from '@/schema';

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
  const { data: activePersonalStatement } =
    useGetActiveChallenge(PERSONAL_STATEMENT);
  const { data: activePersonalStatementLargeCorp } = useGetActiveChallenge(
    PERSONAL_STATEMENT_LARGE_CORP,
  );
  const { data: activeMarketing } = useGetActiveChallenge(MARKETING);
  const { data: activePortfolio } = useGetActiveChallenge(PORTFOLIO);
  const { data: activeExperienceSummary } =
    useGetActiveChallenge(EXPERIENCE_SUMMARY);

  const getLatest = (listData?: ChallengeList) => {
    return (listData?.programList ?? [])
      .filter((p) => Boolean(p.deadline))
      .sort(
        (a, b) =>
          new Date(b.deadline ?? '').getTime() -
          new Date(a.deadline ?? '').getTime(),
      )[0];
  };

  // 후보 ID 계산 (활성 또는 최신)
  const activeExperienceSummaryId = activeExperienceSummary?.challengeList?.[0]?.id;
  const activePersonalStatementId = activePersonalStatement?.challengeList?.[0]?.id;
  const activeLargeCorpId = activePersonalStatementLargeCorp?.challengeList?.[0]?.id;
  const activeMarketingId = activeMarketing?.challengeList?.[0]?.id;
  const activePortfolioId = activePortfolio?.challengeList?.[0]?.id;

  const latestExperienceSummary = getLatest(experienceSummaryData);
  const latestPersonalStatement = getLatest(personalStatementData);
  const latestLargeCorp = getLatest(personalStatementLargeCorpData);
  const latestMarketing = getLatest(marketingData);
  const latestPortfolio = getLatest(portfolioData);

  // B2B 여부 훅 호출 (항상 같은 순서/개수 유지)
  const isB2BActiveExperienceSummary = useIsB2BChallenge(activeExperienceSummaryId);
  const isB2BLatestExperienceSummary = useIsB2BChallenge(latestExperienceSummary?.id);
  const isB2BActivePersonalStatement = useIsB2BChallenge(activePersonalStatementId);
  const isB2BLatestPersonalStatement = useIsB2BChallenge(latestPersonalStatement?.id);
  const isB2BActiveLargeCorp = useIsB2BChallenge(activeLargeCorpId);
  const isB2BLatestLargeCorp = useIsB2BChallenge(latestLargeCorp?.id);
  const isB2BActiveMarketing = useIsB2BChallenge(activeMarketingId);
  const isB2BLatestMarketing = useIsB2BChallenge(latestMarketing?.id);
  const isB2BActivePortfolio = useIsB2BChallenge(activePortfolioId);
  const isB2BLatestPortfolio = useIsB2BChallenge(latestPortfolio?.id);

  const getProgramHref = (
    activeData?: ActiveChallengeResponse,
    listData?: ChallengeList,
    isB2BActive?: boolean,
    isB2BLatest?: boolean,
  ): string | undefined => {
    const activeId = activeData?.challengeList?.[0]?.id;
    const activeTitle = activeData?.challengeList?.[0]?.title ?? '';
    if (activeId !== undefined && !isB2BActive)
      return `/program/challenge/${activeId}/${encodeURIComponent(activeTitle)}`;

    const latest = getLatest(listData);
    if (latest?.id !== undefined && !isB2BLatest) {
      const title = latest.title ?? '';
      return `/program/challenge/${latest.id}/${encodeURIComponent(title)}`;
    }
    return undefined;
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
      href: getProgramHref(
        activeExperienceSummary,
        experienceSummaryData,
        isB2BActiveExperienceSummary,
        isB2BLatestExperienceSummary,
      ),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '자기소개서 완성 챌린지',
      href: getProgramHref(
        activePersonalStatement,
        personalStatementData,
        isB2BActivePersonalStatement,
        isB2BLatestPersonalStatement,
      ),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '포트폴리오 완성 챌린지',
      href: getProgramHref(
        activePortfolio,
        portfolioData,
        isB2BActivePortfolio,
        isB2BLatestPortfolio,
      ),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '마케팅 서류 완성 챌린지',
      href: getProgramHref(
        activeMarketing,
        marketingData,
        isB2BActiveMarketing,
        isB2BLatestMarketing,
      ),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '대기업 완성 챌린지',
      href: getProgramHref(
        activePersonalStatementLargeCorp,
        personalStatementLargeCorpData,
        isB2BActiveLargeCorp,
        isB2BLatestLargeCorp,
      ),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '현직자 LIVE 클래스',
      href: '/program?type=LIVE',
      isNextRouter,
      force: !isNextRouter,
    },

    {
      children: '취준위키 VOD',
      href: '/program?type=VOD',
      isNextRouter,
      force: !isNextRouter,
    },
  ];

  return programCategoryLists;
}
