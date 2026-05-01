'use client';

import { Suspense } from 'react';

import WrittenFeedbackPage from '@/temp/feedback/WrittenFeedbackPage';

const WrittenFeedbackPageWithSuspense = () => (
  <Suspense fallback={null}>
    <WrittenFeedbackPage />
  </Suspense>
);

export default WrittenFeedbackPageWithSuspense;
