import SsoLoginPage from '@/domain/auth/SsoLoginPage';
import { Metadata } from 'next';
import { Suspense } from 'react';

// 이 페이지는 VOD 등 외부 서비스 안에서 렛츠커리어라는 티가 나면 안 되므로,
// 상위 (user)/layout.tsx 의 "렛츠커리어 | 인턴/신입..." 메타데이터를 여기서 덮어쓴다.
// Next.js는 명시하지 않은 필드는 상위 metadata와 병합하므로(완전 대체가 아님)
// title 하나만 바꾸면 og:title 등에 상위 값이 새어나온다 — 관련 필드를 다 지운다.
export const metadata: Metadata = {
  title: '로그인',
  description: '',
  keywords: '',
  openGraph: { title: '로그인', description: '', siteName: '', images: [] },
  twitter: { title: '로그인', description: '', images: [] },
  robots: { index: false, follow: false },
};

const SsoLoginPageWithSuspense = () => (
  <Suspense fallback={null}>
    <SsoLoginPage />
  </Suspense>
);

export default SsoLoginPageWithSuspense;
