import type { Metadata } from 'next';

import LiveMentoringListPage from '@/domain/live-mentoring/list/LiveMentoringListPage';

export const metadata: Metadata = {
  title: '1대1 라이브 멘토링 | 렛츠커리어',
  description:
    '현직자 멘토와 1:1 라이브로 자기소개서·이력서·포트폴리오를 점검받으세요.',
};

const Page = () => {
  return <LiveMentoringListPage />;
};

export default Page;
