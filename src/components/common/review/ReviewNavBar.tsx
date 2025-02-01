'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import HorizontalRule from '@components/ui/HorizontalRule';

function ReviewNavBar() {
  return (
    <>
      {/* 모바일 네비 바 */}
      <div>
        <nav className="px-5 md:hidden">
          <ul className="flex items-stretch">
            <MobileNavItem href="/review/program">
              프로그램 참여
              <br />
              후기
            </MobileNavItem>
            <MobileNavItem href="/review/blog">블로그 후기</MobileNavItem>
            <MobileNavItem href="/blog/list?category=PROGRAM_REVIEWS">
              프로그램
              <br />
              참여자 인터뷰
            </MobileNavItem>
          </ul>
        </nav>
        <HorizontalRule className="w-full h-3" />
      </div>

      {/* 데스크탑 네비 바 */}
      <nav className="relative hidden mr-8 md:block">
        <ul className="flex flex-col sticky top-20 w-[11.5rem] items-stretch">
          <DesktopNavItem href="/review/program">
            프로그램 참여 후기
          </DesktopNavItem>
          <DesktopNavItem href="/review/blog">블로그 후기</DesktopNavItem>
          <DesktopNavItem href="/blog/list?category=PROGRAM_REVIEWS">
            프로그램 참여자 인터뷰
          </DesktopNavItem>
        </ul>
      </nav>
    </>
  );
}

export default ReviewNavBar;

function MobileNavItem({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <li
      className={clsx(
        'flex-1 leading-4 text-center flex items-center justify-center pt-4 pb-3',
        {
          'border-b-2 border-primary': active,
        },
      )}
    >
      <Link
        className={`text-xxsmall12 ${active ? 'text-primary font-semibold' : 'text-neutral-35'}`}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

function DesktopNavItem({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <li className="px-3 py-2">
      <Link
        className={`text-xsmall16 ${active ? 'text-primary font-semibold' : 'text-neutral-35'}`}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}
