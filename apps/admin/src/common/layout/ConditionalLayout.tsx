import BottomNavBarWithPathname from '@/common/layout/BottomNavBarWithPathname';
import ChannelTalkBtn from '@/common/layout/channel/ChannelTalkBtn';
import Footer from '@/common/layout/footer/Footer';
import NavBar from '@/common/layout/header/NavBar';
import { useLocation } from 'react-router-dom';
import React from 'react';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = useLocation().pathname;
  const isLoginPage = pathname === '/login';
  const isDarkPage = pathname.startsWith('/challenge/feedback-mentoring');
  const isCurationPage = pathname.startsWith('/curation');

  return (
    <div>
      {!isCurationPage && <NavBar isLoginPage={isLoginPage} />}
      <div className="min-h-[31rem] w-full">{children}</div>
      {!isLoginPage && !isDarkPage && !isCurationPage && <Footer />}
      {!isLoginPage && !isCurationPage && <ChannelTalkBtn />}
      {!isLoginPage && !isCurationPage && <BottomNavBarWithPathname />}
    </div>
  );
};

export default ConditionalLayout;
