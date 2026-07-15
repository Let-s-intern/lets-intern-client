'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import OldMissionFeedback from '@/domain/challenge/old/OldMissionFeedback';

export default function OldMissionFeedbackPage() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <OldMissionFeedback />
    </AsyncBoundary>
  );
}
