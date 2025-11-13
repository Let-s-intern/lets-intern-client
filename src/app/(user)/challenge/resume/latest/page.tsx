'use client';

import { useGetActiveChallenge, useGetChallengeList } from '@/api/challenge';
import { useFilterB2CChallenges } from '@/hooks/useFilterB2CChallenges';
import { challengeTypeSchema } from '@/schema';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { CAREER_START } = challengeTypeSchema.enum;

/**
 * 이력서 챌린지의 latest 리다이렉트를 처리하는 컴포넌트
 *
 * 리다이렉트 우선순위:
 * 1. 모집중인(active) 이력서 챌린지 중 B2C 챌린지가 있을 경우 해당 챌린지로 이동
 * 2. 없을 경우 가장 최근 개설된 이력서 챌린지 중 B2C 챌린지로 이동
 */
export default function ResumeLatest() {
  const router = useRouter();
  const {
    data: activeData,
    error: activeError,
    isLoading: activeLoading,
  } = useGetActiveChallenge(CAREER_START);
  const {
    data: listData,
    error: listError,
    isLoading: listLoading,
  } = useGetChallengeList({
    type: CAREER_START,
  });

  // B2C 챌린지만 필터링
  const {
    filteredChallenges: filteredActiveChallenges,
    isFiltering: isFilteringActive,
  } = useFilterB2CChallenges(activeData?.challengeList);
  const {
    filteredChallenges: filteredListChallenges,
    isFiltering: isFilteringList,
  } = useFilterB2CChallenges(listData?.programList);

  useEffect(() => {
    // 로딩 중이거나 필터링 중이면 대기
    if (activeLoading || listLoading || isFilteringActive || isFilteringList) {
      return;
    }

    // 에러가 있으면 로그 출력 후 프로그램 페이지로 이동
    if (activeError || listError) {
      console.error('API 호출 에러:', { activeError, listError });
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

    // 활성화된 챌린지가 없는 경우, 가장 최근 B2C 챌린지로 이동
    const latestChallenge = filteredListChallenges?.[0];
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
    listData,
    activeError,
    listError,
    activeLoading,
    listLoading,
    filteredActiveChallenges,
    filteredListChallenges,
    isFilteringActive,
    isFilteringList,
    router,
  ]);

  // 로딩 상태 표시
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-gray-600">이력서 챌린지로 이동 중...</p>
        {(activeLoading ||
          listLoading ||
          isFilteringActive ||
          isFilteringList) && (
          <p className="mt-2 text-sm text-gray-500">데이터 로딩 중...</p>
        )}
      </div>
    </div>
  );
}
