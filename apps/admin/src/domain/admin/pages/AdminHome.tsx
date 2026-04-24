import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/programs');
  }, [navigate]);

  return <></>;
};

export default AdminHome;
