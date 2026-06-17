import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/programs');
  }, [navigate]);

  return <></>;
};

export default AdminHome;
