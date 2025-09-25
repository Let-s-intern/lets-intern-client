import { useGetActiveChallenge, useGetChallengeList } from '@/api/challenge';
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

export default function useProgramCategoryNav() {
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
    const listId = listData?.programList?.[0]?.id;
    const listTitle = listData?.programList?.[0]?.title ?? '';
    if (activeId !== undefined)
      return `/program/challenge/${activeId}/${encodeURIComponent(activeTitle)}`;
    if (listId !== undefined)
      return `/program/challenge/${listId}/${encodeURIComponent(listTitle)}`;
    return undefined;
  };

  const programCategoryLists: SubNavItemProps[] = [
    {
      children: '전체 프로그램',
      href: `/program`,
    },
    {
      children: '경험정리 챌린지',
      href: getProgramHref(activeExperienceSummary, experienceSummaryData),
    },
    {
      children: '자기소개서 완성 챌린지',
      href: getProgramHref(activePersonalStatement, personalStatementData),
    },
    {
      children: '포트폴리오 완성 챌린지',
      href: getProgramHref(activePortfolio, portfolioData),
    },
    {
      children: '마케팅 서류 완성 챌린지',
      href: getProgramHref(activeMarketing, marketingData),
    },
    {
      children: '대기업 완성 챌린지',
      href: getProgramHref(
        activePersonalStatementLargeCorp,
        personalStatementLargeCorpData,
      ),
    },
    {
      children: '현직자 LIVE 클래스',
      href: '/program?type=LIVE',
    },
    {
      children: '취준위키 VOD',
      href: '/program?type=VOD',
    },
  ];

  return programCategoryLists;
}
