'use client';

import { Suspense } from 'react';

import LiveFeedbackPage from '@/temp/feedback/LiveFeedbackPage';

const LiveFeedbackPageWithSuspense = () => (
  <Suspense fallback={null}>
    <LiveFeedbackPage />
  </Suspense>
);

export default LiveFeedbackPageWithSuspense;
