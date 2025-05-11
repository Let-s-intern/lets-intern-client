import { Outlet } from 'react-router-dom';
import ChannelTalkBtn from './channel/ChannelTalkBtn';
import Footer from './footer/Footer';
import NavBar from './nav/NavBar';

const Layout = () => {
  return (
    <div>
      <NavBar />
      <div className="min-h-[31rem] w-full">
        <Outlet />
      </div>
      <Footer />
      <ChannelTalkBtn />
    </div>
  );
};

export default Layout;
