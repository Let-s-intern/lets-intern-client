import { useGetActiveChallenge, useGetChallengeHome } from '@/api/challenge';
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

  const getProgramHref = (
    activeData?: ActiveChallengeResponse,
    listData?: ChallengeList,
  ): string | undefined => {
    const activeId = activeData?.challengeList?.[0]?.id;
    const activeTitle = activeData?.challengeList?.[0]?.title ?? '';
    if (activeId !== undefined)
      return `/program/challenge/${activeId}/${encodeURIComponent(activeTitle)}`;

    const latest = (listData?.programList ?? [])
      .filter((p) => Boolean(p.deadline))
      .sort(
        (a, b) =>
          new Date(b.deadline ?? '').getTime() -
          new Date(a.deadline ?? '').getTime(),
      )[0];
    if (latest?.id !== undefined) {
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
      href: getProgramHref(activeExperienceSummary, experienceSummaryData),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '자기소개서 완성 챌린지',
      href: getProgramHref(activePersonalStatement, personalStatementData),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '포트폴리오 완성 챌린지',
      href: getProgramHref(activePortfolio, portfolioData),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '마케팅 서류 완성 챌린지',
      href: getProgramHref(activeMarketing, marketingData),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '대기업 완성 챌린지',
      href: getProgramHref(
        activePersonalStatementLargeCorp,
        personalStatementLargeCorpData,
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
