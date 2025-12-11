import BottomNavBarWithPathname from './BottomNavBarWithPathname';
import ChannelTalkBtn from './channel/ChannelTalkBtn';
import Footer from './footer/Footer';
import NavBar from './header/NavBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar />
      <div className="min-h-[31rem] w-full">
        {children}
      </div>
      <Footer />
      <ChannelTalkBtn />
      <BottomNavBarWithPathname />
    </div>
  );
};

export default Layout;
