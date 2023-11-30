import { Outlet } from 'react-router-dom';

import NavBar from './NavBar';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="mx-auto min-h-screen max-w-5xl font-notosans">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
