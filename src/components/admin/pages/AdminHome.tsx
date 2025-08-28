import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navgiate = useNavigate();

  useEffect(() => {
    navgiate('/admin/programs');
  }, [navgiate]);

  return <></>;
};

export default AdminHome;
