import { useGetChallengeHome } from '@/api/challenge';
import { useFilterB2CChallenges } from '@/hooks/useFilterB2CChallenges';
import dayjs from '@/lib/dayjs';
import { ChallengeType } from '@/schema';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

/**
 * 챌린지 타입별 latest 리다이렉트를 처리하는 훅
 *
 * 리다이렉트 우선순위:
 * 1. 모집중인 챌린지 중 B2C 챌린지가 있을 경우:
 *    - 1개인 경우: 해당 챌린지로 이동
 *    - 2개 이상인 경우: 모집 마감일자가 가장 가까운 챌린지로 이동 (deadline 기준 오름차순)
 * 2. 없을 경우: 노출된 챌린지 중 모집중이 아닌 가장 최근 모집 마감일자를 가진 B2C 챌린지로 이동 (deadline 기준 내림차순)
 *
 * @param type 챌린지 타입
 * @returns 로딩 상태 (true면 로딩 중)
 */
export function useLatestChallengeRedirect(type: ChallengeType) {
  const router = useRouter();
  const {
    data: homeData,
    error: homeError,
    isLoading: homeLoading,
  } = useGetChallengeHome({
    type,
  });

  // 현재 시간
  const now = useMemo(() => dayjs(), []);

  // 모집중인 챌린지 판단: beginning <= now <= deadline
  const isActiveChallenge = useMemo(
    () =>
      (challenge: { beginning?: string | null; deadline?: string | null }) => {
        if (!challenge.beginning || !challenge.deadline) return false;
        const beginning = dayjs(challenge.beginning);
        const deadline = dayjs(challenge.deadline);
        // beginning <= now <= deadline
        return (
          (now.isAfter(beginning) || now.isSame(beginning)) &&
          (now.isBefore(deadline) || now.isSame(deadline))
        );
      },
    [now],
  );

  // 모집중인 챌린지와 모집중이 아닌 챌린지 분리
  const { activeChallenges, nonActiveChallenges } = useMemo(() => {
    const allChallenges = homeData?.programList ?? [];
    const active: typeof allChallenges = [];
    const nonActive: typeof allChallenges = [];

    for (const challenge of allChallenges) {
      if (isActiveChallenge(challenge)) {
        active.push(challenge);
      } else {
        nonActive.push(challenge);
      }
    }

    return { activeChallenges: active, nonActiveChallenges: nonActive };
  }, [homeData?.programList, isActiveChallenge]);

  // B2C 챌린지만 필터링
  const {
    filteredChallenges: filteredActiveChallengesRaw,
    isFiltering: isFilteringActive,
  } = useFilterB2CChallenges(activeChallenges);
  const {
    filteredChallenges: filteredNonActiveChallengesRaw,
    isFiltering: isFilteringNonActive,
  } = useFilterB2CChallenges(nonActiveChallenges);

  // 모집중인 B2C 챌린지 정렬: 2개 이상일 때 deadline 기준 오름차순 (가장 가까운 마감일)
  // activeChallengeSchema는 deadline이 필수이므로 타입 단언 사용
  const filteredActiveChallenges = useMemo(() => {
    if (
      !filteredActiveChallengesRaw ||
      filteredActiveChallengesRaw.length === 0
    ) {
      return [];
    }

    // 1개인 경우 정렬 불필요
    if (filteredActiveChallengesRaw.length === 1) {
      return filteredActiveChallengesRaw;
    }

    // 2개 이상인 경우 deadline 기준 오름차순 정렬
    // activeChallengeSchema는 deadline이 필수이지만, 필터링 후 타입이 유지되지 않을 수 있음
    type ChallengeWithDeadline = (typeof filteredActiveChallengesRaw)[0] & {
      deadline: string;
    };

    const withDeadline = filteredActiveChallengesRaw.filter(
      (challenge): challenge is ChallengeWithDeadline =>
        challenge.deadline != null && typeof challenge.deadline === 'string',
    );

    // deadline이 있는 챌린지가 있으면 정렬하여 반환
    if (withDeadline.length > 0) {
      return [...withDeadline].sort((a, b) => {
        const aDeadline = dayjs(a.deadline);
        const bDeadline = dayjs(b.deadline);

        // 오름차순 (가장 가까운 마감일이 먼저)
        return aDeadline.unix() - bDeadline.unix();
      });
    }

    // deadline이 있는 챌린지가 없으면 원본 반환 (fallback)
    return filteredActiveChallengesRaw;
  }, [filteredActiveChallengesRaw]);

  // 모집중이지 않은 B2C 챌린지 정렬: deadline 기준 내림차순 (가장 최근 마감일자)
  // deadline이 있는 챌린지만 필터링하여 정렬
  const filteredNonActiveChallenges = useMemo(() => {
    if (
      !filteredNonActiveChallengesRaw ||
      filteredNonActiveChallengesRaw.length === 0
    ) {
      return [];
    }

    // deadline이 있는 챌린지만 필터링 (타입 가드 사용)
    type ChallengeWithDeadline = (typeof filteredNonActiveChallengesRaw)[0] & {
      deadline: string;
    };

    const withDeadline = filteredNonActiveChallengesRaw.filter(
      (challenge): challenge is ChallengeWithDeadline =>
        challenge.deadline != null && typeof challenge.deadline === 'string',
    );

    // deadline이 있는 챌린지가 있으면 정렬하여 반환
    if (withDeadline.length > 0) {
      return [...withDeadline].sort((a, b) => {
        const aDeadline = dayjs(a.deadline);
        const bDeadline = dayjs(b.deadline);

        // 내림차순 (가장 최근 마감일자가 먼저)
        return bDeadline.unix() - aDeadline.unix();
      });
    }

    // deadline이 있는 챌린지가 없으면 원본 반환 (fallback)
    return filteredNonActiveChallengesRaw;
  }, [filteredNonActiveChallengesRaw]);

  useEffect(() => {
    // 로딩 중이거나 필터링 중이면 대기
    if (homeLoading || isFilteringActive || isFilteringNonActive) {
      return;
    }

    // 에러가 있으면 프로그램 페이지로 이동
    if (homeError) {
      router.replace('/program');
      return;
    }

    // 활성화된 B2C 챌린지가 있는 경우
    const activeChallenge = filteredActiveChallenges?.[0];
    if (activeChallenge?.id) {
      const title = activeChallenge.title ?? '';
      const redirectUrl = `/program/challenge/${activeChallenge.id}/${encodeURIComponent(title)}`;

      router.push(redirectUrl);
      return;
    }

    // 활성화된 챌린지가 없는 경우, 노출된 챌린지 중 가장 최근 모집 마감일자를 가진 B2C 챌린지로 이동
    const latestChallenge = filteredNonActiveChallenges?.[0];
    if (latestChallenge?.id) {
      const title = latestChallenge.title ?? '';
      const redirectUrl = `/program/challenge/${latestChallenge.id}/${encodeURIComponent(title)}`;

      router.push(redirectUrl);
      return;
    }

    // 챌린지가 없는 경우 프로그램 페이지로 이동
    router.replace('/program');
  }, [
    homeError,
    homeLoading,
    filteredActiveChallenges,
    filteredNonActiveChallenges,
    isFilteringActive,
    isFilteringNonActive,
    router,
  ]);

  // 로딩 상태 반환
  return homeLoading || isFilteringActive || isFilteringNonActive;
}
