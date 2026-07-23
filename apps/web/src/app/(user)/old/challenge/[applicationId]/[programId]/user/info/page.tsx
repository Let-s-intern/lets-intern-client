'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import OldChallengeUserInfo from '@/domain/challenge/old/OldChallengeUserInfo';

export default function OldChallengeUserInfoPage() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <OldChallengeUserInfo />
    </AsyncBoundary>
  );
}
