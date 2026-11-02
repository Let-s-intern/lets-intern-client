import LetsconPage from '@/domain/letscon/LetsconPage';
import { LETSCON_PATH } from '@/domain/letscon/data/links';
import type { Metadata } from 'next';

const title = '렛츠커리어 | 렛츠콘, 공채는 끝나도 취준은 끝나지 않으니까';
const description =
  '작은 경험을 합격으로 연결한 현직자의 이야기. 남은 2026년, 다시 시작할 취준의 방향과 루틴을 만나요.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: LETSCON_PATH,
  },
  openGraph: {
    type: 'website',
    title,
    url: LETSCON_PATH,
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

export default function Page() {
  return <LetsconPage />;
}
