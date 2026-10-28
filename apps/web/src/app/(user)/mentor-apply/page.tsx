import MentorApplyPage from '@/domain/mentor-apply/MentorApplyPage';
import type { Metadata } from 'next';

const title = '멘토 신청서 | 렛츠커리어';
const description = '취업준비생과 함께할 현직자 멘토를 모집합니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/mentor-apply',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/mentor-apply',
    description,
    siteName: '렛츠커리어',
    locale: 'ko_KR',
  },
};

export default function Page() {
  return <MentorApplyPage />;
}
