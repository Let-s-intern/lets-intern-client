'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

type NavItem = {
  id: string;
  label: string;
  href?: string;
  subItems?: NavItem[];
};

const NavBar = () => {
  const params = useParams<{ programId: string; applicationId: string }>();
  const pathname = usePathname();
  const base = `/challenge/${params.applicationId}/${params.programId}`;

  if (pathname.endsWith('user/info')) return null;

  const isDetailPage = /\/feedback\/live\/[^/]+$/.test(pathname);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: '대시보드', href: base },
    { id: 'my-mission', label: '나의 미션', href: `${base}/me` },
    {
      id: 'feedback',
      label: '미션 피드백',
      subItems: [
        {
          id: 'feedback-written',
          label: '서면 피드백',
          href: `${base}/feedback/written`,
        },
        {
          id: 'feedback-live',
          label: '라이브 피드백',
          href: `${base}/feedback/live`,
        },
      ],
    },
    { id: 'guide', label: '공지사항 / 챌린지 가이드', href: `${base}/guides` },
  ];

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) =>
    item.subItems?.some((child) => isActive(child.href ?? '')) ?? false;

  const linkClass = (active: boolean) =>
    clsx(
      'rounded-xxs text-xsmall14 md:text-xsmall16 flex flex-row items-center whitespace-nowrap transition-colors md:h-[44px] md:px-3',
      active
        ? 'text-primary md:bg-primary-5 font-semibold'
        : 'text-neutral-40 font-medium',
    );

  return (
    <nav
      className={clsx('w-full md:w-[220px]', isDetailPage && 'hidden md:block')}
    >
      <ul className="scrollbar-hide flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 md:sticky md:h-auto md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
        {navItems.map((item) => {
          const parentActive = isParentActive(item);
          const selfActive = item.href ? isActive(item.href) : false;

          if (item.subItems) {
            return (
              <li key={item.id} className="group flex-shrink-0 md:flex-shrink">
                {/* 모바일: 첫 번째 subItem으로 직접 이동 */}
                <Link
                  href={item.subItems[0].href ?? ''}
                  className={clsx(linkClass(parentActive), 'md:hidden')}
                >
                  {item.label}
                </Link>
                {/* 데스크톱: 호버로 서브아이템 노출 */}
                <span
                  className={clsx(
                    linkClass(parentActive),
                    'hidden w-full justify-between md:flex',
                  )}
                >
                  {item.label}
                </span>
                <ul
                  className={clsx(
                    'hidden md:flex md:max-h-0 md:flex-col md:overflow-hidden md:opacity-0 md:transition-all md:duration-200',
                    'md:group-hover:max-h-40 md:group-hover:opacity-100',
                    parentActive && 'md:max-h-40 md:opacity-100',
                  )}
                >
                  {item.subItems.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={child.href ?? ''}
                        className={clsx(
                          'text-xsmall14 md:rounded-xxs flex items-center whitespace-nowrap py-1 pl-6 transition-colors md:h-[36px] md:px-3',
                          isActive(child.href ?? '')
                            ? 'text-primary font-medium'
                            : 'text-neutral-10 font-medium',
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }

          return (
            <li key={item.id} className="flex-shrink-0 md:flex-shrink">
              <Link href={item.href ?? ''} className={linkClass(selfActive)}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
