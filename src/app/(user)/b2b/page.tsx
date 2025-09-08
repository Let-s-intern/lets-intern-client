import type { Metadata } from 'next';
import Client from './_components/Client';

export async function generateMetadata(): Promise<Metadata> {
  const isNoIndex = process.env.NO_INDEX === 'true';
  const title =
    '합격으로 이어지는 서류, 렛츠커리어가 설계합니다 - 기업 교육 | 렛츠커리어';
  const description =
    '교육기관 맞춤형 취업·커리어 교육 파트너. 경험정리부터 직무탐색, 서류 완성, 이후 관리까지 한 번에 제공합니다.';

  return {
    title,
    description,
    alternates: { canonical: '/b2b' },
    openGraph: {
      type: 'website',
      title,
      description,
      siteName: '렛츠커리어',
      locale: 'ko_KR',
    },
    robots: isNoIndex ? 'noindex' : 'index, follow',
  };
}

export default function B2BPage() {
  return <Client />;
}
