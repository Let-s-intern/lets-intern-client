'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

type Tab = {
  href: string;
  label: string;
};

const TABS: readonly Tab[] = [
  { href: '/admin/review/mission', label: '미션' },
  { href: '/admin/review/challenge', label: '챌린지' },
  { href: '/admin/review/live', label: '라이브' },
  { href: '/admin/review/report', label: '리포트' },
  { href: '/admin/review/blog', label: '블로그' },
] as const;

function isActive(currentPath: string | null, href: string) {
  if (!currentPath) return false;
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function AdminReviewHeader() {
  const pathname = usePathname();

  return (
    <header className="mx-2 my-1">
      <h1 className="mb-2 font-bold text-medium22">후기 관리</h1>
      <nav aria-label="Review navigation">
        <ul className="flex py-5">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            const className = clsx(
              'px-4 py-2 text-gray-500',
              active && 'font-bold text-primary',
            );
            return (
              <li key={tab.href}>
                <Link href={tab.href} className={className} aria-current={active ? 'page' : undefined}>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
