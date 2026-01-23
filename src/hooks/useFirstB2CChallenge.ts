import { useGetChallengeHome } from '@/api/challenge/challenge';
import {
  ChallengeType,
  challengeTypeSchema,
  getChallengeIdSchema,
} from '@/schema';
import axios from '@/utils/axios';
import { useEffect, useMemo, useState } from 'react';

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
  const [firstB2CChallenge, setFirstB2CChallenge] = useState<
    | {
        id: number;
        title: string | null;
        href: string;
      }
    | undefined
  >(undefined);

  const challengeList = useMemo(
    () => challengeData?.programList ?? [],
    [challengeData?.programList],
  );

  // 순차적으로 B2C 챌린지 찾기
  useEffect(() => {
    if (challengeList.length === 0) {
      setFirstB2CChallenge(undefined);
      return;
    }

    const findFirstB2C = async () => {
      for (const challenge of challengeList) {
        try {
          const res = await axios.get(`/challenge/${challenge.id}`);
          const challengeData = getChallengeIdSchema.parse(res.data.data);

          const adminList = challengeData.adminClassificationInfo;
          const isB2B =
            adminList &&
            adminList.length > 0 &&
            adminList.some((info) => info.programAdminClassification === 'B2B');

          // B2C인 경우 해당 챌린지 반환
          if (!isB2B) {
            setFirstB2CChallenge({
              id: challenge.id,
              title: challenge.title ?? null,
              href: `/program/challenge/${challenge.id}`,
            });
            return; // 첫 번째 B2C를 찾으면 중단
          }
        } catch {
          // 에러가 발생해도 다음 챌린지 확인 계속
        }
      }

      // 모든 챌린지가 B2B인 경우
      setFirstB2CChallenge(undefined);
    };

    findFirstB2C();
  }, [challengeList]);

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
