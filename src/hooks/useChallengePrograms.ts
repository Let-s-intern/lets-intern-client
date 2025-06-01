import { useGetActiveChallenge, useGetChallengeList } from '@/api/challenge';
import { SubNavItemProps } from '@/components/common/ui/layout/header/SubNavItem';
import { challengeTypeSchema } from '@/schema';

const {
  EXPERIENCE_SUMMARY,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  PORTFOLIO,
  MARKETING,
  CAREER_START,
} = challengeTypeSchema.enum;

export const useChallengePrograms = () => {
  const { data: experienceSummaryData } = useGetChallengeList({
    type: EXPERIENCE_SUMMARY,
  });
  const { data: personalStatementData } = useGetChallengeList({
    type: PERSONAL_STATEMENT,
  });
  const { data: personalStatementLargeCorpData } = useGetChallengeList({
    type: PERSONAL_STATEMENT_LARGE_CORP,
  });
  const { data: portfolioData } = useGetChallengeList({ type: PORTFOLIO });
  const { data: marketingData } = useGetChallengeList({ type: MARKETING });
  const { data } = useGetChallengeList({ type: CAREER_START });
  const { data: activePersonalStatement } =
    useGetActiveChallenge(PERSONAL_STATEMENT);
  const { data: activePersonalStatementLargeCorp } = useGetActiveChallenge(
    PERSONAL_STATEMENT_LARGE_CORP,
  );
  const { data: activeMarketing } = useGetActiveChallenge(MARKETING);
  const { data: activePortfolio } = useGetActiveChallenge(PORTFOLIO);
  const { data: activeExperienceSummary } =
    useGetActiveChallenge(EXPERIENCE_SUMMARY);
  const { data: activeCareerStart } = useGetActiveChallenge(CAREER_START);

  const getProgramHref = (
    activeData?: any,
    listData?: any,
  ): string | undefined => {
    const activeId = activeData?.challengeList?.[0]?.id;
    const listId = listData?.programList?.[0]?.id;
    if (activeId !== undefined) return `/program/challenge/${activeId}`;
    if (listId !== undefined) return `/program/challenge/${listId}`;
    return undefined;
  };

  const programCategoryLists: SubNavItemProps[] = [
    {
      children: '전체 프로그램',
      href: `/program`,
      isNextRouter: true,
    },
    {
      children: '취준 기필코 시작',
      href: getProgramHref(activeCareerStart, data),
      isNextRouter: true,
    },
    {
      children: '마케팅 서류 완성',
      href: getProgramHref(activeMarketing, marketingData),
      isNextRouter: true,
      force: true,
    },
    {
      children: '경험정리',
      href: getProgramHref(activeExperienceSummary, experienceSummaryData),
      isNextRouter: true,
    },
    {
      children: '자기소개서 완성',
      href: getProgramHref(activePersonalStatement, personalStatementData),
      isNextRouter: true,
      force: true,
    },
    {
      children: '대기업 공채 자소서',
      href: getProgramHref(
        activePersonalStatementLargeCorp,
        personalStatementLargeCorpData,
      ),
      isNextRouter: true,
      force: true,
    },
    {
      children: '포트폴리오 완성',
      href: getProgramHref(activePortfolio, portfolioData),
      isNextRouter: true,
      force: true,
    },
    {
      children: '이력서 완성',
      href: '/report/landing/resume',
      isNextRouter: true,
      force: true,
    },
  ];

  return programCategoryLists;
};
