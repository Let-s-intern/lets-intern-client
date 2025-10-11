import { useGetActiveChallenge } from '@/api/challenge';
import { SubNavItemProps } from '@/components/common/ui/layout/header/SubNavItem';
import { ActiveChallengeResponse, challengeTypeSchema } from '@/schema';
import { useNavB2CChallenges } from './useFirstB2CChallenge';

const {
  EXPERIENCE_SUMMARY,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  PORTFOLIO,
  MARKETING,
} = challengeTypeSchema.enum;

export default function useProgramCategoryNav(isNextRouter: boolean) {
  const { data: activePersonalStatement } =
    useGetActiveChallenge(PERSONAL_STATEMENT);
  const { data: activePersonalStatementLargeCorp } = useGetActiveChallenge(
    PERSONAL_STATEMENT_LARGE_CORP,
  );
  const { data: activeMarketing } = useGetActiveChallenge(MARKETING);
  const { data: activePortfolio } = useGetActiveChallenge(PORTFOLIO);
  const { data: activeExperienceSummary } =
    useGetActiveChallenge(EXPERIENCE_SUMMARY);

  // 새로운 훅을 사용하여 각 타입별 첫 번째 B2C 챌린지 가져오기
  const {
    experienceSummary,
    personalStatement,
    personalStatementLargeCorp,
    portfolio,
    marketing,
  } = useNavB2CChallenges();

  const getProgramHref = (
    activeData?: ActiveChallengeResponse,
    b2cChallenge?: { href: string },
  ): string | undefined => {
    // 1. 활성 챌린지가 있는 경우
    const activeId = activeData?.challengeList?.[0]?.id;
    const activeTitle = activeData?.challengeList?.[0]?.title ?? '';

    if (activeId !== undefined) {
      return `/program/challenge/${activeId}/${encodeURIComponent(activeTitle)}`;
    }

    // 2. 활성 챌린지가 없는 경우, 첫 번째 B2C 챌린지 사용
    return b2cChallenge?.href;
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
      href: getProgramHref(activeExperienceSummary, experienceSummary),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '자기소개서 완성 챌린지',
      href: getProgramHref(activePersonalStatement, personalStatement),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '포트폴리오 완성 챌린지',
      href: getProgramHref(activePortfolio, portfolio),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '마케팅 서류 완성 챌린지',
      href: getProgramHref(activeMarketing, marketing),
      isNextRouter,
      force: !isNextRouter,
    },
    {
      children: '대기업 완성 챌린지',
      href: getProgramHref(
        activePersonalStatementLargeCorp,
        personalStatementLargeCorp,
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
