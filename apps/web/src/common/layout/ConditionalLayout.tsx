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
  // VOD 등 외부 서비스에 임베드되는 SSO 로그인 화면(LC-3208). 렛츠커리어 사이트라는 티가
  // 나면 안 되므로 NavBar·Footer·채널톡·바텀바를 전부 없앤 완전히 빈 페이지로 띄운다.
  const isSsoLoginPage = pathname === '/sso/login';

  if (isSsoLoginPage) {
    return <div>{children}</div>;
  }

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
