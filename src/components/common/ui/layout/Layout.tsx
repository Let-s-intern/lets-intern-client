import { Outlet } from 'react-router-dom';

import ChannelTalkBtn from './channel/ChannelTalkBtn';
import Footer from './footer/Footer';
import NavBar from './nav/NavBar';

const Layout = () => {
  return (
    <div className="font-pretendard">
      <NavBar />
      <div className="min-h-screen w-full">
        <Outlet />
      </div>
      <Footer />
      <ChannelTalkBtn />
    </div>
  );
};

export default Layout;
