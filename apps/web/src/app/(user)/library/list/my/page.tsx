import LibraryListContent from '@/domain/library/LibraryListContent';
import type { Metadata } from 'next';

const title = 'MY 자료집 | 무료 자료집 - 렛츠커리어';
const description = '신청한 무료 자료집, VOD, 템플릿을 한곳에서 확인하세요.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/library/list/my',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/library/list/my',
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

export default function LibraryMyListPage() {
  return <LibraryListContent tab="my" />;
}
