'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import OldMyChallengeDashboard from '@/domain/challenge/old/OldMyChallengeDashboard';

export default function OldMyChallengeDashboardPage() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <OldMyChallengeDashboard />
    </AsyncBoundary>
  );
}
