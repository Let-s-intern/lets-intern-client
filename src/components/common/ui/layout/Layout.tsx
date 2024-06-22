import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import ChannelService from '../../../../ChannelService';
import Footer from './footer/Footer';
import NavBar from './nav/NavBar';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.ChannelIO) {
      ChannelService.loadScript();
      ChannelService.boot({
        pluginKey: '3acfb692-c643-456f-86e8-dd64da454947',
      });
    }
  }, []);

  useEffect(() => {
    const programPathRegex = /^\/program\/detail\/\d+$/; // /program/detail/:programId
    if (programPathRegex.test(location.pathname)) {
      ChannelService.hideChannelButton();
    } else {
      ChannelService.showChannelButton();
    }
  }, [location]);

  useEffect(() => {
    navigate('/maintenance');
  }, [location]);

  return <Outlet />;

  return (
    <div className="font-pretendard">
      <NavBar />
      <div className="min-h-screen w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
