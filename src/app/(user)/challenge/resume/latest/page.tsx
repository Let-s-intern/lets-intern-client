'use client';

import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import { useLatestChallengeRedirect } from '@/hooks/useLatestChallengeRedirect';
import { challengeTypeSchema } from '@/schema';

const { CAREER_START } = challengeTypeSchema.enum;

/**
 * 이력서 챌린지의 latest 리다이렉트를 처리하는 컴포넌트
 *
 * 리다이렉트 우선순위:
 * 1. 모집중인(active) 이력서 챌린지 중 B2C 챌린지가 있을 경우 해당 챌린지로 이동
 * 2. 없을 경우 노출된 챌린지 중 활성화되지 않은 가장 최근 B2C 챌린지로 이동
 */
export default function ResumeLatest() {
  useLatestChallengeRedirect(CAREER_START);

  return (
    <LoadingContainer
      className="min-h-screen"
      text="이력서 완성 챌린지로 이동 중..."
    />
  );
}
