'use client';

import BottomNavBarWithPathname from '@/common/ui/layout/BottomNavBarWithPathname';
import ChannelTalkBtn from '@/common/ui/layout/channel/ChannelTalkBtn';
import Footer from '@/common/ui/layout/footer/Footer';
import NavBar from '@/common/ui/layout/header/NavBar';
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
