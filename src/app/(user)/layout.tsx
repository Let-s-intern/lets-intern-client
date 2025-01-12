import Providers from '@/context/Providers';
import ChannelTalkBtn from '@components/common/ui/layout/channel/ChannelTalkBtn';
import Footer from '@components/common/ui/layout/next-footer/Footer';
import NavBar from '@components/common/ui/layout/next-nav/NavBar';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <div>
        <NavBar />
        <div className="min-h-[31rem] w-full">{children}</div>
        <Footer />
        <ChannelTalkBtn />
      </div>
    </Providers>
  );
};

export default layout;
