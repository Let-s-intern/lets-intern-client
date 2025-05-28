import { Outlet } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';
import ChannelTalkBtn from './channel/ChannelTalkBtn';
import Footer from './footer/Footer';
import NavBar from './header/NavBar';

const Layout = () => {
  return (
    <div>
      <NavBar />
      <div className="min-h-[31rem] w-full">
        <Outlet />
      </div>
      <Footer />
      <ChannelTalkBtn />
      <BottomNavBar isNextRouter={false} />
    </div>
  );
};

export default Layout;
