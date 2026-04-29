import { useLocation } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';

function BottomNavBarWithPathname() {
  const pathname = useLocation().pathname;
  return <BottomNavBar pathname={pathname} />;
}
export default BottomNavBarWithPathname;
