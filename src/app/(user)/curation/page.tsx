import { CurationScreen } from '@/domain/curation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '렛츠커리어 | 큐레이션',
  description:
    '페르소나 기반 3초 큐레이션으로 맞춤 챌린지, 플랜, 병행 가이드를 제안합니다.',
  alternates: {
    canonical: 'https://www.letscareer.co.kr/curation',
  },
};

export default function Page() {
  return <CurationScreen />;
}
