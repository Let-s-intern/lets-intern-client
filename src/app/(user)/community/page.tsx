import type { Metadata } from 'next';
import CommunityScreen from '@/domain/community/CommunityScreen';

export async function generateMetadata(): Promise<Metadata> {
  const isNoIndex = process.env.NO_INDEX === 'true';
  const title = '렛츠커리어 | 커뮤니티';
  const description =
    '취준 고민과 질문을 자유롭게 공유하고, 현직자 멘토에게 직접 물어볼 수 있는 렛츠커리어 커뮤니티. 카카오 오픈톡방, 인스타그램 채널에서 검증된 채용공고와 직무 인사이트를 가장 빠르게 만나보세요.';

  return {
    title,
    description,
    keywords: [
      '취업 커뮤니티',
      '취준생 커뮤니티',
      '카카오 오픈톡',
      '채용공고',
      '직무 인사이트',
      '취업 멘토링',
    ],
    alternates: { canonical: '/community' },
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

export default function CommunityPage() {
  return <CommunityScreen />;
}
