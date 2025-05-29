import { Outlet } from 'react-router-dom';
import BottomNavBarWithPathname from './BottomNavBarWithPathname';
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
      <BottomNavBarWithPathname />
    </div>
  );
};

export default Layout;
