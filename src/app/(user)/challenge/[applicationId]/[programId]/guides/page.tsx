'use client';

import { Suspense } from 'react';

import ChallengeGuidePage from '@components/pages/challenge/ChallengeGuidePage';

const ChallengeGuidePageWithSuspense = () => (
  <Suspense fallback={null}>
    <ChallengeGuidePage />
  </Suspense>
);

export default ChallengeGuidePageWithSuspense;
