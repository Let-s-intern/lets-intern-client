'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useLatestChallengeRedirect } from '@/hooks/useLatestChallengeRedirect';
import { challengeTypeSchema } from '@/schema';

const { PERSONAL_STATEMENT } = challengeTypeSchema.enum;

/**
 * 자기소개서 완성 챌린지의 latest 리다이렉트를 처리하는 컴포넌트
 *
 * 리다이렉트 우선순위:
 * 1. 모집중인(active) 자기소개서 챌린지 중 B2C 챌린지가 있을 경우 해당 챌린지로 이동
 * 2. 없을 경우 노출된 챌린지 중 활성화되지 않은 가장 최근 B2C 챌린지로 이동
 */
export default function PersonalStatementLatest() {
  useLatestChallengeRedirect(PERSONAL_STATEMENT);

  return (
    <LoadingContainer
      className="min-h-screen"
      text="자기소개서 완성 챌린지로 이동 중..."
    />
  );
}
