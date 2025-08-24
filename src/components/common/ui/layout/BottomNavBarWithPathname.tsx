import { usePathname } from 'next/navigation';
import BottomNavBar from './BottomNavBar';

function BottomNavBarWithPathname() {
  const pathname = usePathname();
  return <BottomNavBar pathname={pathname} />;
}
export default BottomNavBarWithPathname;
