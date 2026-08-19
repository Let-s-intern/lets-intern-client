// [LC-3219-MEMBERSHIP] 인적성(ETC) 최신 챌린지 리다이렉트 라우트 —
// 멤버십 전용이 아니라 인적성 챌린지 범용 라우트다. 시즌 종료 시에도 남긴다
'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useLatestChallengeRedirect } from '@/hooks/useLatestChallengeRedirect';
import { challengeTypeSchema } from '@/schema';

const { ETC } = challengeTypeSchema.enum;

/**
 * 인적성 챌린지의 latest 리다이렉트를 처리하는 컴포넌트
 *
 * 리다이렉트 우선순위:
 * 1. 모집중인(active) 인적성 챌린지 중 B2C 챌린지가 있을 경우 해당 챌린지로 이동
 * 2. 없을 경우 노출된 챌린지 중 활성화되지 않은 가장 최근 B2C 챌린지로 이동
 */
export default function AptitudeLatest() {
  useLatestChallengeRedirect(ETC);

  return (
    <LoadingContainer className="min-h-screen" text="인적성 챌린지로 이동 중..." />
  );
}
