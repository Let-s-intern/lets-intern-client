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
  // 이름·전화번호로 조회하는 개인 화면이라 검색에 노출하지 않는다
  robots: { index: false, follow: false },
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
