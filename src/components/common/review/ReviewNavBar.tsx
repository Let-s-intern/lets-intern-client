'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';
import HorizontalRule from '@components/ui/HorizontalRule';
import { SINGLE_ROW_NAVBAR_HEIGHT_OFFSET } from '../ui/layout/header/NextNavBar';

function ReviewNavBar() {
  const pathname = usePathname();

  const isMissionOrProgramReviewPage =
    pathname === '/review/mission' || pathname === '/review/program';

  return (
    <>
      {/* 모바일 네비 바 */}
      <div
        className={twMerge(
          'review_menu sticky z-10 bg-white',
          SINGLE_ROW_NAVBAR_HEIGHT_OFFSET,
        )}
      >
        <nav className="md:hidden">
          <ul className="flex items-stretch gap-6 border-b border-neutral-80 px-5 md:hidden">
            <MobileNavItem
              href="/review/program"
              subHref={['/review/mission', '/review/program']}
            >
              프로그램 참여 후기
            </MobileNavItem>
            <MobileNavItem href="/review/blog">블로그 후기</MobileNavItem>
            <MobileNavItem href="/blog/list?type=PROGRAM_REVIEWS">
              프로그램 참여자 인터뷰
            </MobileNavItem>
          </ul>
          {isMissionOrProgramReviewPage && (
            <ul className="my-2.5 flex h-[34px] items-stretch gap-1 px-5">
              <MobileNavSubItem href="/review/program">
                참여 후기
              </MobileNavSubItem>
              <MobileNavSubItem href="/review/mission">
                미션 수행 후기
              </MobileNavSubItem>
            </ul>
          )}
        </nav>
      </div>
      <HorizontalRule className="h-2 w-full md:hidden" />

      {/* 데스크탑 네비 바 */}
      <nav className="mr-8 hidden md:block">
        <ul className="review_menu sticky top-[116px] flex w-[11.5rem] flex-col items-stretch md:top-[140px] lg:top-[116px]">
          <DesktopNavItem
            href="/review/program"
            subHref={['/review/mission', '/review/program']}
          >
            프로그램 참여 후기
          </DesktopNavItem>
          {isMissionOrProgramReviewPage && (
            <>
              <DesktopNavSubItem href="/review/program">
                참여 후기
              </DesktopNavSubItem>
              <DesktopNavSubItem href="/review/mission">
                미션 수행 후기
              </DesktopNavSubItem>
            </>
          )}
          <DesktopNavItem href="/review/blog">블로그 후기</DesktopNavItem>
          <DesktopNavItem href="/blog/list?type=PROGRAM_REVIEWS">
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
  subHref,
}: {
  children: ReactNode;
  href: string;
  subHref?: string[];
}) {
  const pathname = usePathname();
  const active = pathname === href || (subHref && subHref.includes(pathname));
  return (
    <li
      className={clsx(
        'flex items-center justify-center whitespace-nowrap pb-3.5 pt-3.5 text-center leading-4',
        {
          'border-b-2 border-primary': active,
        },
      )}
    >
      <Link
        className={`text-xsmall14 ${active ? 'font-semibold text-primary' : 'text-neutral-35'}`}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

function MobileNavSubItem({
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
        'flex h-full items-center justify-center rounded-full px-2.5 py-1.5',
        {
          'bg-primary-10': active,
        },
      )}
    >
      <Link
        className={`text-xsmall14 ${active ? 'font-semibold text-primary' : 'text-neutral-35'}`}
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
  subHref,
}: {
  children: ReactNode;
  href: string;
  subHref?: string[];
}) {
  const pathname = usePathname();
  const active = pathname === href || (subHref && subHref.includes(pathname));
  return (
    <li className="px-3 py-2">
      <Link
        className={`text-xsmall16 ${active ? 'font-semibold text-primary' : 'text-neutral-35'}`}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

function DesktopNavSubItem({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <li className={`rounded-xxs px-4 py-2 ${active ? 'bg-primary-5' : ''}`}>
      <Link
        className={`text-xsmall14 ${active ? 'font-medium text-primary' : 'text-neutral-35'}`}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}
