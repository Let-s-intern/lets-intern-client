import { Outlet } from 'react-router-dom';

import NavBar from './NavBar';
import Footer from './Footer';
import { useEffect } from 'react';
import ChannelService from '../ChannelService';

const Layout = () => {
  useEffect(() => {
    if (!window.ChannelIO) {
      ChannelService.loadScript();
      ChannelService.boot({
        pluginKey: '3acfb692-c643-456f-86e8-dd64da454947',
      });
    }
  }, []);

  return (
    <div className="font-notosans">
      <NavBar />
      <div className="mx-auto min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
