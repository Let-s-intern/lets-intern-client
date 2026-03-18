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
  const isCurationPage = pathname === '/curation';
  const isDarkPage = pathname.startsWith('/challenge/feedback-mentoring');
  const hideLayout = isLoginPage || isCurationPage;

  return (
    <div>
      {!isCurationPage && <NavBar isLoginPage={isLoginPage} />}
      <div className={hideLayout ? '' : 'min-h-[31rem] w-full'}>
        {children}
      </div>
      {!hideLayout && !isDarkPage && <Footer />}
      {!hideLayout && <ChannelTalkBtn />}
      {!hideLayout && <BottomNavBarWithPathname />}
    </div>
  );
};

export default ConditionalLayout;
