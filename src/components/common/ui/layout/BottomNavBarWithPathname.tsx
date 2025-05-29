import { useLocation } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';

function BottomNavBarWithPathname() {
  const location = useLocation();
  return <BottomNavBar isNextRouter={false} pathname={location.pathname} />;
}

export default BottomNavBarWithPathname;
