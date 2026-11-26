import MentorsListPage from '@/domain/mentors/MentorsListPage';
import { getCanonicalUrl } from '@/utils/url';
import type { Metadata } from 'next';

const TITLE = '현직자 멘토 – 직무별 1:1 멘토링 | 렛츠커리어';
const DESCRIPTION =
  '대기업·직무별 현직자 멘토를 찾아 1:1로 자기소개서·이력서·포트폴리오 첨삭, 모의 면접, 커리어 커피챗을 받아 보세요.';

// 상위 레이아웃의 canonical 이 홈(`/`)이라 따로 두지 않으면 이 페이지가 홈으로 합쳐진다
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: getCanonicalUrl('/mentors') },
  openGraph: {
    type: 'website',
    siteName: '렛츠커리어',
    locale: 'ko_KR',
    title: TITLE,
    description: DESCRIPTION,
    url: getCanonicalUrl('/mentors'),
  },
};

const Page = () => {
  return <MentorsListPage />;
};

export default Page;
