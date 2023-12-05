import { Outlet } from 'react-router-dom';

import NavBar from './NavBar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="font-notosans">
      <NavBar />
      <div className="mx-auto min-h-screen max-w-5xl">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
