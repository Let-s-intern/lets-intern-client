import { useGetChallengeHome } from '@/api/challenge/challenge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { isB2BChallengeFromList } from '@/utils/challengeFilter';
import { useMemo } from 'react';

const {
  EXPERIENCE_SUMMARY,
  CAREER_START,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  PORTFOLIO,
  MARKETING,
  HR,
} = challengeTypeSchema.enum;

/**
 * 특정 타입의 챌린지 목록에서 첫 번째 B2C 챌린지를 순차적으로 찾는 훅
 * @param type 챌린지 타입
 * @returns 첫 번째 B2C 챌린지 정보 또는 undefined
 */
export function useFirstB2CChallenge(type: ChallengeType) {
  const { data: challengeData } = useGetChallengeHome({ type });

  const firstB2CChallenge = useMemo(() => {
    const challengeList = challengeData?.programList ?? [];
    const firstChallenge = challengeList.find(
      (challenge) => !isB2BChallengeFromList(challenge),
    );

    if (!firstChallenge) {
      return undefined;
    }

    return {
      id: firstChallenge.id,
      title: firstChallenge.title ?? null,
      href: `/program/challenge/${firstChallenge.id}`,
    };
  }, [challengeData?.programList]);

  return firstB2CChallenge;
}

/**
 * IntroSection에서 사용할 수 있는 모든 챌린지 타입의 첫 번째 B2C 챌린지를 찾는 훅
 * React 훅 규칙을 준수하기 위해 각 타입별로 개별적으로 호출
 */
export function useIntroSectionB2CChallenges() {
  const experienceSummary = useFirstB2CChallenge(EXPERIENCE_SUMMARY);
  const resume = useFirstB2CChallenge(CAREER_START);
  const personalStatement = useFirstB2CChallenge(PERSONAL_STATEMENT);
  const personalStatementLargeCorp = useFirstB2CChallenge(
    PERSONAL_STATEMENT_LARGE_CORP,
  );
  const portfolio = useFirstB2CChallenge(PORTFOLIO);

  return {
    experienceSummary,
    resume,
    personalStatement,
    personalStatementLargeCorp,
    portfolio,
  };
}

/**
 * 네비게이션에서 사용할 수 있는 모든 챌린지 타입의 첫 번째 B2C 챌린지를 찾는 훅
 * React 훅 규칙을 준수하기 위해 각 타입별로 개별적으로 호출
 */
export function useNavB2CChallenges() {
  const experienceSummary = useFirstB2CChallenge(EXPERIENCE_SUMMARY);
  const resume = useFirstB2CChallenge(CAREER_START);
  const personalStatement = useFirstB2CChallenge(PERSONAL_STATEMENT);
  const personalStatementLargeCorp = useFirstB2CChallenge(
    PERSONAL_STATEMENT_LARGE_CORP,
  );
  const portfolio = useFirstB2CChallenge(PORTFOLIO);
  const marketing = useFirstB2CChallenge(MARKETING);
  const hr = useFirstB2CChallenge(HR);

  return {
    experienceSummary,
    resume,
    personalStatement,
    personalStatementLargeCorp,
    portfolio,
    marketing,
    hr,
  };
}
