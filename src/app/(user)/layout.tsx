import Providers from '@/context/Providers';
import ChannelTalkBtn from '@components/common/ui/layout/channel/ChannelTalkBtn';
import NextNavBar from '@components/common/ui/layout/header/NextNavBar';
import Footer from '@components/common/ui/layout/next-footer/Footer';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요',
  description:
    '커리어 탐색, 서류 준비, 면접 준비까지 취업 준비생 관점에서 함께 하는 커리어 플랫폼, 렛츠커리어',
  keywords:
    '렛츠커리어, letscareer, 렛츠인턴, 챌린지, 인턴, 신입, 취업, 취업준비, 취뽀, 인턴합격, 신입합격, 서류합격, 면접합격',
  // TODO: 채워넣기
  icons: [],
  openGraph: {
    type: 'website',
    title: '렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요',
    siteName: '렛츠커리어',
    images:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/banner/popup/%E1%84%85%E1%85%A6%E1%86%BA%E1%84%8E%E1%85%B3%E1%84%8F%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A5%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%20og_image%201200_630.png',
    url: 'https://www.letscareer.co.kr',
    description:
      '커리어 탐색, 서류 준비, 면접 준비까지 취업 준비생 관점에서 함께 하는 커리어 플랫폼, 렛츠커리어',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: 'https://www.letscareer.co.kr',
  },
};

if (process.env.NO_INDEX === 'true') {
  metadata.robots = 'noindex';
} else {
  metadata.robots = 'index, follow';
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <div>
        <NextNavBar />
        <div className="min-h-[31rem] w-full">{children}</div>
        <Footer />
        <ChannelTalkBtn />
      </div>
    </Providers>
  );
};

export default Layout;
