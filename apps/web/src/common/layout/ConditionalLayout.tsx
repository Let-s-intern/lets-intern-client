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
  // 멤버십(이벤트) 랜딩은 본 웹앱에 직접 마운트한다(MembershipLanding). 글로벌 헤더(NavBar)는
  // 그대로 쓰되, 랜딩이 자체 하단 고정 ApplyBar 를 두므로 푸터·채널톡·바텀바는 띄우지 않는다.
  const isMembershipPage = pathname.startsWith('/membership');

  if (isMembershipPage) {
    return (
      <div>
        <NavBar />
        <div className="min-h-[31rem] w-full">{children}</div>
      </div>
    );
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
