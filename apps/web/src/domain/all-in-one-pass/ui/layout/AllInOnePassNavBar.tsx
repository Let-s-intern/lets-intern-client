'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

type NavItem = { id: string; label: string; href: string };

const AllInOnePassNavBar = () => {
  const params = useParams<{ id: string; applicationId: string }>();
  const pathname = usePathname();
  const base = `/all-in-one-pass/${params.id}/${params.applicationId}`;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: '패스 대시보드', href: base },
    { id: 'usage', label: '나의 패스 이용', href: `${base}/usage` },
    { id: 'materials', label: '패스 ONLY 자료집', href: `${base}/materials` },
    {
      id: 'retrospectives',
      label: '취준 회고록',
      href: `${base}/retrospectives`,
    },
    { id: 'notices', label: '공지사항 / 패스 가이드', href: `${base}/notices` },
  ];

  const isActive = (href: string) => pathname === href;

  const linkClass = (active: boolean) =>
    clsx(
      'rounded-xxs text-xsmall14 md:text-xsmall16 flex flex-row items-center whitespace-nowrap font-medium transition-colors md:h-[44px] md:px-3',
      active ? 'text-primary md:bg-primary-5' : 'md:text-neutral-40',
    );

  return (
    <nav className="sticky top-[44px] z-20 flex w-full flex-col md:static md:z-auto md:w-[220px]">
      <ul className="scrollbar-hide flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 md:h-auto md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
        {navItems.map((item) => (
          <li key={item.id} className="flex-shrink-0 md:flex-shrink">
            <Link href={item.href} className={linkClass(isActive(item.href))}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AllInOnePassNavBar;
