'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import ChallengeGuidePage from '@/domain/program/challenge/ChallengeGuidePage';

export default function ChallengeGuidePageWithSuspense() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <ChallengeGuidePage />
    </AsyncBoundary>
  );
}
