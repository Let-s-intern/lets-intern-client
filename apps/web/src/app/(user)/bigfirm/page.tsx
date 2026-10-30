import BigfirmPage from '@/domain/bigfirm/BigfirmPage';
import type { Metadata } from 'next';

const title = '렛츠커리어 | 대기업 현직 멘토 1:1 멘토링';
const description =
  '또 떨어지기 전, 내 직무와 가까운 대기업 현직자에게 탈락 이유를 확인해보세요.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/bigfirm',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/bigfirm',
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

// 멘토 프로필 사진은 서버에서 받아 한 시간마다 새로 만든다
export const revalidate = 3600;

export default function Page() {
  return <BigfirmPage />;
}
