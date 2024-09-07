import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Routes 컴포넌트가 매번 새롭게 리렌더링되어 너무 빠르게 이동하면 주소가 잘못 잡히는 문제가 있음.
    // Router 를 제대로 구성하면 setTimeout 안해도 될 듯.
    setTimeout(() => {
      navigate('/report/landing/resume');
    }, 50);
  }, [navigate]);

  return null;
};

export default ReportPage;
