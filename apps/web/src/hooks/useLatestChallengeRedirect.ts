import {
  useGetActiveChallenge,
  useGetChallengeHome,
} from '@/api/challenge/challenge';
import dayjs from '@/lib/dayjs';
import { ChallengeType } from '@/schema';
import { filterB2CChallenges } from '@/utils/challengeFilter';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';

/**
 * 챌린지 타입별 latest 리다이렉트를 처리하는 훅
 *
 * 리다이렉트 우선순위:
 * 1. 모집중인(active) 챌린지 중 B2C 챌린지가 있을 경우 해당 챌린지로 이동
 * 2. 없을 경우 노출된 챌린지 중 활성화되지 않은 가장 최근 B2C 챌린지로 이동
 *
 * 진입 URL 의 쿼리는 상세 페이지로 그대로 넘긴다 (LC-3611).
 * 협찬 링크 `latest?source=b2b` 의 source 가 여기서 빠지면 결제창 쿠폰칸이 닫히고,
 * utm 도 유입 경로에서 사라진다.
 *
 * @param type 챌린지 타입
 * @returns 로딩 상태 (true면 로딩 중)
 */
export function useLatestChallengeRedirect(type: ChallengeType) {
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

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

  useEffect(() => {
    // 이미 리다이렉트가 완료된 경우 재실행 방지
    if (hasRedirectedRef.current) {
      return;
    }

    // 로딩 중이면 대기
    if (activeLoading || homeLoading) {
      return;
    }

    // 에러가 있으면 프로그램 페이지로 이동
    if (activeError || homeError) {
      hasRedirectedRef.current = true;
      router.replace('/program');
      return;
    }

    // 데이터가 아직 로드되지 않은 경우 대기
    // activeData와 homeData가 모두 undefined가 아니어야 함 (빈 배열은 허용)
    if (activeData === undefined || homeData === undefined) {
      return;
    }

    // 원본 데이터가 로드되었는지 확인
    // activeData.challengeList와 homeData.programList가 존재해야 필터링이 의미있음
    const hasActiveData = activeData?.challengeList !== undefined;
    const hasHomeData = homeData?.programList !== undefined;

    // 원본 데이터가 없으면 대기
    if (!hasActiveData || !hasHomeData) {
      return;
    }

    let isCancelled = false;

    const resolveRedirect = async () => {
      try {
        const [filteredActive, filteredNonActiveRaw] = await Promise.all([
          filterB2CChallenges(activeData?.challengeList ?? []),
          filterB2CChallenges(nonActiveChallenges),
        ]);

        if (isCancelled) {
          return;
        }

        const sortedNonActive = [...filteredNonActiveRaw].sort((a, b) => {
          const aDate = a.createDate ? dayjs(a.createDate) : null;
          const bDate = b.createDate ? dayjs(b.createDate) : null;

          if (!aDate && !bDate) return 0;
          if (!aDate) return 1;
          if (!bDate) return -1;

          // 최신순 (내림차순)
          return bDate.unix() - aDate.unix();
        });

        const targetChallenge = filteredActive[0] ?? sortedNonActive[0];
        if (targetChallenge?.id) {
          hasRedirectedRef.current = true;
          // useSearchParams 는 Suspense 경계를 요구해 11개 latest 페이지를 모두 건드려야 한다.
          // 이 시점은 effect 안이라 브라우저에서만 돌므로 location 을 직접 읽는다
          router.replace(
            `/program/challenge/${targetChallenge.id}${window.location.search}`,
          );
          return;
        }

        // 챌린지가 없으면 프로그램 페이지로 이동
        hasRedirectedRef.current = true;
        router.replace('/program');
      } catch {
        if (isCancelled) {
          return;
        }

        hasRedirectedRef.current = true;
        router.replace('/program');
      }
    };

    resolveRedirect();

    return () => {
      isCancelled = true;
    };
  }, [
    activeData,
    homeData,
    activeError,
    homeError,
    activeLoading,
    homeLoading,
    nonActiveChallenges,
    router,
  ]);

  // 로딩 상태 반환
  return activeLoading || homeLoading;
}
