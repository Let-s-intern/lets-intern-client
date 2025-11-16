import { useGetActiveChallenge, useGetChallengeHome } from '@/api/challenge';
import { useFilterB2CChallenges } from '@/hooks/useFilterB2CChallenges';
import dayjs from '@/lib/dayjs';
import { ChallengeType } from '@/schema';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

/**
 * 챌린지 타입별 latest 리다이렉트를 처리하는 훅
 *
 * 리다이렉트 우선순위:
 * 1. 모집중인(active) 챌린지 중 B2C 챌린지가 있을 경우 해당 챌린지로 이동
 * 2. 없을 경우 노출된 챌린지 중 활성화되지 않은 가장 최근 B2C 챌린지로 이동
 *
 * @param type 챌린지 타입
 * @returns 로딩 상태 (true면 로딩 중)
 */
export function useLatestChallengeRedirect(type: ChallengeType) {
  const router = useRouter();
  const {
    data: activeData,
    error: activeError,
    isLoading: activeLoading,
  } = useGetActiveChallenge(type);
  const {
    data: homeData,
    error: homeError,
    isLoading: homeLoading,
  } = useGetChallengeHome({
    type,
  });

  // 활성화된 챌린지 ID 목록 생성
  const activeChallengeIds = useMemo(
    () => new Set(activeData?.challengeList.map((c) => c.id) ?? []),
    [activeData?.challengeList],
  );

  // 전체 목록에서 활성화된 챌린지 제외
  const nonActiveChallenges = useMemo(
    () =>
      homeData?.programList.filter(
        (challenge) => !activeChallengeIds.has(challenge.id),
      ) ?? [],
    [homeData?.programList, activeChallengeIds],
  );

  // B2C 챌린지만 필터링
  const {
    filteredChallenges: filteredActiveChallenges,
    isFiltering: isFilteringActive,
  } = useFilterB2CChallenges(activeData?.challengeList);
  const {
    filteredChallenges: filteredNonActiveChallengesRaw,
    isFiltering: isFilteringNonActive,
  } = useFilterB2CChallenges(nonActiveChallenges);

  // B2C 필터링 후 createDate 기준 최신순 정렬
  const filteredNonActiveChallenges = useMemo(() => {
    if (
      !filteredNonActiveChallengesRaw ||
      filteredNonActiveChallengesRaw.length === 0
    ) {
      return [];
    }

    return [...filteredNonActiveChallengesRaw].sort((a, b) => {
      const aDate = a.createDate ? dayjs(a.createDate) : null;
      const bDate = b.createDate ? dayjs(b.createDate) : null;

      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;

      // 최신순 (내림차순)
      return bDate.unix() - aDate.unix();
    });
  }, [filteredNonActiveChallengesRaw]);

  useEffect(() => {
    // 로딩 중이거나 필터링 중이면 대기
    if (
      activeLoading ||
      homeLoading ||
      isFilteringActive ||
      isFilteringNonActive
    ) {
      return;
    }

    // 에러가 있으면 프로그램 페이지로 이동
    if (activeError || homeError) {
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

    // 활성화된 챌린지가 없는 경우, 노출된 챌린지 중 가장 최근 B2C 챌린지로 이동
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
    activeData,
    homeData,
    activeError,
    homeError,
    activeLoading,
    homeLoading,
    filteredActiveChallenges,
    filteredNonActiveChallenges,
    filteredNonActiveChallengesRaw,
    isFilteringActive,
    isFilteringNonActive,
    router,
    activeChallengeIds,
    nonActiveChallenges,
    type,
  ]);

  // 로딩 상태 반환
  return (
    activeLoading || homeLoading || isFilteringActive || isFilteringNonActive
  );
}
