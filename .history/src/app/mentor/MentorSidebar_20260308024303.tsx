'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '프로그램 일정', url: '/mentor' },
  { name: '참여중인 챌린지', url: '/mentor/challenges' },
  { name: 'Profile', url: '/mentor/profile' },
  { name: '공지사항', url: '/mentor/notice' },
];

export const MentorSidebar = () => {
  const pathname = usePathname();

  return (
    <aside>
      <nav className="sticky left-0 top-0 z-50 flex h-screen w-48 flex-col gap-2 bg-white py-6 shadow-md">
        <div className="mb-8 px-6">
          <Link href="/mentor">
            <img src="/logo/horizontal-logo.svg" alt="Logo" />
          </Link>
        </div>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.url === '/mentor'
                ? pathname === '/mentor'
                : pathname.startsWith(item.url);

            return (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className={`block px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto px-6 pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-700"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6L8 1.5L14 6V13.5C14 13.7652 13.8946 14.0196 13.7071 14.2071C13.5196 14.3946 13.2652 14.5 13 14.5H3C2.73478 14.5 2.48043 14.3946 2.29289 14.2071C2.10536 14.0196 2 13.7652 2 13.5V6Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 14.5V8H10V14.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            홈페이지로 이동
          </Link>
        </div>
      </nav>
    </aside>
  );
};
