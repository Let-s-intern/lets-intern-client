import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

type NavItem = {
  id: string;
  label: string;
  href: string;
  subItems?: NavItem[];
};

const NavBar = () => {
  const params = useParams<{ programId: string; applicationId: string }>();
  const pathname = usePathname();
  const base = `/challenge/${params.applicationId}/${params.programId}`;

  if (pathname.endsWith('user/info')) return null;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: '대시보드', href: base },
    { id: 'my-mission', label: '나의 미션', href: `${base}/me` },
    { id: 'guide', label: '공지사항 / 챌린지 가이드', href: `${base}/guides` },
  ];

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) =>
    item.subItems?.some((child) => isActive(child.href)) ?? false;

  const linkClass = (active: boolean) =>
    clsx(
      'rounded-xxs text-xsmall14 md:text-xsmall16 flex flex-row items-center whitespace-nowrap transition-colors md:h-[44px] md:px-3',
      active
        ? 'text-primary md:bg-primary-5 font-semibold'
        : 'text-neutral-30 font-medium',
    );

  return (
    <nav className="w-full md:w-[220px]">
      <ul className="scrollbar-hide flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 md:sticky md:h-auto md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
        {navItems.map((item) => {
          const parentActive = isParentActive(item);
          const selfActive = isActive(item.href);

          return (
            <li key={item.id} className="flex-shrink-0 md:flex-shrink">
              <Link
                href={item.href}
                className={linkClass(selfActive || parentActive)}
              >
                {item.label}
              </Link>
              {item.subItems && parentActive && (
                <ul className="hidden md:flex md:flex-col">
                  {item.subItems.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={child.href}
                        className={clsx(
                          'text-xsmall14 md:rounded-xxs md:text-xsmall14 flex items-center whitespace-nowrap py-1 pl-6 transition-colors md:h-[36px] md:px-3',
                          isActive(child.href)
                            ? 'text-primary md:bg-primary-5 font-semibold'
                            : 'text-neutral-30 font-medium',
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
