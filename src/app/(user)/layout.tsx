'use client';

import ChannelTalkBtn from '@components/common/ui/layout/channel/ChannelTalkBtn';
import Footer from '@components/common/ui/layout/footer/Footer';
import NavBar from '@components/common/ui/layout/nav/NavBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <NavBar />
        <div className="min-h-[31rem] w-full">{children}</div>
        <Footer />
        <ChannelTalkBtn />
      </div>
    </QueryClientProvider>
  );
};

export default layout;
