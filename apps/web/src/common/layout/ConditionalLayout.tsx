'use client';

import BottomNavBarWithPathname from '@/common/layout/BottomNavBarWithPathname';
import ChannelTalkBtn from '@/common/layout/channel/ChannelTalkBtn';
import Footer from '@/common/layout/footer/Footer';
import NavBar from '@/common/layout/header/NavBar';
import { usePathname } from 'next/navigation';
import React from 'react';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isDarkPage = pathname.startsWith('/challenge/feedback-mentoring');
  const isCurationPage = pathname.startsWith('/curation');
  // 멤버십(이벤트) 랜딩은 전체화면 iframe 으로 임베드한다. 글로벌 크롬(푸터·채널톡·바텀바)
  // 없이, 헤더(실제 NavBar)와 iframe 은 MembershipEmbed 가 직접 렌더·제어한다.
  const isMembershipPage = pathname.startsWith('/membership');

  if (isMembershipPage) {
    return <>{children}</>;
  }

  return (
    <div>
      <NavBar isLoginPage={isLoginPage} disableFixed={isCurationPage} />
      <div className="min-h-[31rem] w-full">{children}</div>
      {!isLoginPage && !isDarkPage && !isCurationPage && <Footer />}
      {!isLoginPage && !isCurationPage && <ChannelTalkBtn />}
      {!isLoginPage && !isCurationPage && <BottomNavBarWithPathname />}
    </div>
  );
};

export default ConditionalLayout;
