'use client';

import { Suspense } from 'react';

import LiveFeedbackPage from '@/domain/challenge/feedback/live/LiveFeedbackPage';

const LiveFeedbackPageWithSuspense = () => (
  <Suspense fallback={null}>
    <LiveFeedbackPage />
  </Suspense>
);

export default LiveFeedbackPageWithSuspense;
