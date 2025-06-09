'use client';

import { usePathname } from 'next/navigation';
import BottomNavBar from './BottomNavBar';

function NextBottomNavBarWithPathname() {
  const pathname = usePathname();
  return <BottomNavBar isNextRouter pathname={pathname} />;
}

export default NextBottomNavBarWithPathname;
