'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

type NavItem = { id: string; label: string; href: string };

/** 올인원패스 대시보드 사이드바(4탭). 챌린지 NavBar 구조를 따르되 서브아이템 없이 평면. */
const AllInOnePassNavBar = () => {
  const params = useParams<{ applicationId: string }>();
  const pathname = usePathname();
  const base = `/all-in-one-pass/${params.applicationId}`;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: '패스 대시보드', href: base },
    { id: 'benefits', label: '나의 패스 이용', href: `${base}/benefits` },
    { id: 'retrospectives', label: '회고록', href: `${base}/retrospectives` },
    { id: 'notices', label: '공지사항 / 패스 가이드', href: `${base}/notices` },
  ];

  const isActive = (href: string) => pathname === href;

  const linkClass = (active: boolean) =>
    clsx(
      'rounded-xxs text-xsmall14 md:text-xsmall16 flex flex-row items-center whitespace-nowrap transition-colors md:h-[44px] md:px-3',
      active
        ? 'text-primary md:bg-primary-5 font-semibold'
        : 'text-neutral-40 font-medium',
    );

  return (
    <nav className="flex w-full flex-col md:w-[220px]">
      <ul className="scrollbar-hide flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 md:sticky md:h-auto md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
        {navItems.map((item) => (
          <li key={item.id} className="flex-shrink-0 md:flex-shrink">
            <Link href={item.href} className={linkClass(isActive(item.href))}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* TODO: 사이드바 하단 외부 링크(오공고·플레이북·커뮤니티 등) — mock 붙일 때 추가 */}
    </nav>
  );
};

export default AllInOnePassNavBar;
