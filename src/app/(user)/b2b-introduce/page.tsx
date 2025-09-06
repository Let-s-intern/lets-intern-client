import type { Metadata } from 'next';
import Client from './_components/Client';

export async function generateMetadata(): Promise<Metadata> {
  const isNoIndex = process.env.NO_INDEX === 'true';
  const title = '합격으로 이어지는 서류, 렛츠커리어가 설계합니다 | 렛츠커리어 B2B';
  const description =
    '교육기관 맞춤형 취업·커리어 교육 파트너. 경험정리부터 직무탐색, 서류 완성, 이후 관리까지 한 번에 제공합니다.';

  return {
    title,
    description,
    metadataBase: new URL('https://www.letscareer.co.kr'),
    alternates: { canonical: '/b2b-introduce' },
    openGraph: {
      type: 'website',
      title,
      description,
      url: 'https://www.letscareer.co.kr/b2b-introduce',
      siteName: '렛츠커리어',
      images: '/icon.png',
      locale: 'ko_KR',
    },
    robots: isNoIndex ? 'noindex' : 'index, follow',
  };
}

export default function B2BIntroducePage() {
  return <Client />;
}
