'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import OldChallengeDashboard from '@/domain/challenge/old/OldChallengeDashboard';

export default function OldChallengeDashboardPage() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <OldChallengeDashboard />
    </AsyncBoundary>
  );
}
