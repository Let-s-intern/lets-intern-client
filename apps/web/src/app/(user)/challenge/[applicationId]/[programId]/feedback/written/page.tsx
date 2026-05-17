'use client';

import { Suspense } from 'react';

import WrittenFeedbackPage from '@/domain/challenge/feedback/written/WrittenFeedbackPage';

const WrittenFeedbackPageWithSuspense = () => (
  <Suspense fallback={null}>
    <WrittenFeedbackPage />
  </Suspense>
);

export default WrittenFeedbackPageWithSuspense;
