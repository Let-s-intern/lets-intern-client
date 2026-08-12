'use client';

import SsoLoginPage from '@/domain/auth/SsoLoginPage';
import { Suspense } from 'react';

const SsoLoginPageWithSuspense = () => (
  <Suspense fallback={null}>
    <SsoLoginPage />
  </Suspense>
);

export default SsoLoginPageWithSuspense;
