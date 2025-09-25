import type { Metadata } from 'next';
import Client from './_components/Client';

export async function generateMetadata(): Promise<Metadata> {
  const isNoIndex = process.env.NO_INDEX === 'true';
  const title = '렛츠커리어 | 합격으로 이어지는 기업/학교 취업 교육';
  const description =
    '교육생의 경험정리부터 직무탐색, 서류 완성, 이후 관리까지 교육기관 맞춤형 취업교육을 제공합니다.';

  return {
    title,
    description,
    keywords: ['서류 교육', '취업 교육', '이력서', '자기소개서', '포트폴리오'],
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
