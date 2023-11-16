import { Outlet } from 'react-router-dom';

import NavBar from './NavBar';

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="mx-auto max-w-5xl font-notosans">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
