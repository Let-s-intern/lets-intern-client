'use client';

import LoginPage from '@/domain/auth/LoginPage';
import { Suspense } from 'react';

const LoginPageWithSuspense = () => (
  <Suspense fallback={null}>
    <LoginPage />
  </Suspense>
);

export default LoginPageWithSuspense;
