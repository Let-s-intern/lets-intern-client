'use client';

import { useGetActiveChallenge, useGetChallengeList } from '@/api/challenge';
import { challengeTypeSchema } from '@/schema';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { PORTFOLIO } = challengeTypeSchema.enum;

/**
 * 포트폴리오 완성 챌린지의 latest 리다이렉트를 처리하는 컴포넌트
 *
 * 리다이렉트 우선순위:
 * 1. 모집중인(active) 포트폴리오 챌린지가 있을 경우 해당 챌린지로 이동
 * 2. 없을 경우 가장 최근 개설된 포트폴리오 챌린지로 이동
 */
export default function PortfolioLatest() {
  const router = useRouter();
  const {
    data: activeData,
    error: activeError,
    isLoading: activeLoading,
  } = useGetActiveChallenge(PORTFOLIO);
  const {
    data: listData,
    error: listError,
    isLoading: listLoading,
  } = useGetChallengeList({
    type: PORTFOLIO,
  });

  useEffect(() => {
    if (activeLoading || listLoading) return;

    // 활성화된 챌린지가 있는 경우
    const activeChallenge = activeData?.challengeList?.[0];
    if (activeChallenge?.id) {
      const title = activeChallenge.title ?? '';
      const redirectUrl = `/program/challenge/${activeChallenge.id}/${encodeURIComponent(title)}`;

      // Next.js App Router로 이동하기 위해 새로고침 강제 실행
      window.location.href = redirectUrl;
      return;
    }

    // 활성화된 챌린지가 없는 경우, 가장 최근 챌린지로 이동
    const latestChallenge = listData?.programList?.[0];
    if (latestChallenge?.id) {
      const title = latestChallenge.title ?? '';
      const redirectUrl = `/program/challenge/${latestChallenge.id}/${encodeURIComponent(title)}`;

      // Next.js App Router로 이동하기 위해 새로고침 강제 실행
      window.location.href = redirectUrl;
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
    router,
  ]);

  // 로딩 상태 표시
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-gray-600">포트폴리오 완성 챌린지로 이동 중...</p>
        {(activeLoading || listLoading) && (
          <p className="mt-2 text-sm text-gray-500">데이터 로딩 중...</p>
        )}
      </div>
    </div>
  );
}
