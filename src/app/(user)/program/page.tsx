import { Suspense } from 'react';

import ProgramsPage from '@/components/pages/program/ProgramsPage';
import type { Metadata } from 'next';

const title = '프로그램 목록 | 렛츠커리어';
const description = '렛츠커리어의 프로그램 목록 페이지입니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/program',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/program',
    description,
    siteName: '렛츠커리어',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
};

const ProgramPage = () => (
  <Suspense fallback={null}>
    <ProgramsPage />
  </Suspense>
);

export default ProgramPage;
