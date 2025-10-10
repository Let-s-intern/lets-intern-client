'use client';

import { Suspense } from 'react';

import SignupPage from '@/components/pages/auth/SignupPage';

const SignupPageWithSuspense = () => (
  <Suspense fallback={null}>
    <SignupPage />
  </Suspense>
);

export default SignupPageWithSuspense;
