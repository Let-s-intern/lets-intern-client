import MentorApplyStatusPage from '@/domain/mentor-apply/status/MentorApplyStatusPage';
import type { Metadata } from 'next';

const title = '신청 현황 조회 | 렛츠커리어';
const description = '멘토 신청서의 진행 상황을 확인합니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/mentor-apply/status',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/mentor-apply/status',
    description,
    siteName: '렛츠커리어',
    locale: 'ko_KR',
  },
};

export default function Page() {
  return <MentorApplyStatusPage />;
}
