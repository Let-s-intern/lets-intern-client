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
  // 멤버십 랜딩은 자체 컴팩트 푸터(MembershipFooter)를 사용하므로 글로벌 푸터 숨김
  const isMembershipPage = pathname.startsWith('/membership');

  return (
    <div>
      <NavBar isLoginPage={isLoginPage} disableFixed={isCurationPage} />
      <div className="min-h-[31rem] w-full">{children}</div>
      {!isLoginPage && !isDarkPage && !isCurationPage && !isMembershipPage && (
        <Footer />
      )}
      {!isLoginPage && !isCurationPage && <ChannelTalkBtn />}
      {!isLoginPage && !isCurationPage && <BottomNavBarWithPathname />}
    </div>
  );
};

export default ConditionalLayout;
