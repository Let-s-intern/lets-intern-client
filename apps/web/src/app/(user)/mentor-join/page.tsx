import MentorJoinPage from '@/domain/mentor-join/MentorJoinPage';
import type { Metadata } from 'next';

const title = '렛츠커리어 | 함께 성장하는 커리어 멘토';
const description = '취업준비생과 함께할 현직자 멘토를 모집합니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/mentor-join',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/mentor-join',
    description,
    siteName: '렛츠커리어',
    locale: 'ko_KR',
    // openGraph 를 덮어쓰면 레이아웃의 기본 이미지가 빠지므로 같은 이미지를 다시 둔다
    images: [
      {
        url: 'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/banner/popup/%E1%84%85%E1%85%A6%E1%86%BA%E1%84%8E%E1%85%B3%E1%84%8F%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A5%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%20og_image%201200_630.png',
      },
    ],
  },
};

// 프로그램·멘토링 카드는 서버에서 받아 한 시간마다 새로 만든다
export const revalidate = 3600;

export default function Page() {
  return <MentorJoinPage />;
}
