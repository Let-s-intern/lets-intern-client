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

  return (
    <div>
      <NavBar isLoginPage={isLoginPage} />
      <div className="min-h-[31rem] w-full">{children}</div>
      {!isLoginPage && (
        <Footer
          className={
            isDarkPage
              ? 'border-white/10 bg-[#0C0A1D] text-gray-400'
              : undefined
          }
        />
      )}
      {!isLoginPage && <ChannelTalkBtn />}
      {!isLoginPage && <BottomNavBarWithPathname />}
    </div>
  );
};

export default ConditionalLayout;
