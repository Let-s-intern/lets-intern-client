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

  return (
    <div>
      <NavBar isLoginPage={isLoginPage} />
      <div className="min-h-[31rem] w-full">{children}</div>
      {!isLoginPage && <Footer />}
      {!isLoginPage && <ChannelTalkBtn />}
      {!isLoginPage && <BottomNavBarWithPathname />}
    </div>
  );
};

export default ConditionalLayout;
