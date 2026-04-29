import LibraryListContent from '@/domain/library/LibraryListContent';
import type { Metadata } from 'next';

const title = '무료 자료집 목록 | 무료 자료집 - 렛츠커리어';
const description =
  '취업 준비에 필요한 무료 자료집, VOD, 템플릿을 한눈에 확인하세요.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/library/list',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/library/list',
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

export default function LibraryListPage() {
  return <LibraryListContent tab="contents" />;
}
