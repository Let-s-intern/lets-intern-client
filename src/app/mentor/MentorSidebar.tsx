'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '프로그램 일정', url: '/mentor' },
  { name: '참여중인 챌린지', url: '/mentor/challenges' },
  { name: '프로필', url: '/mentor/profile' },
  { name: '공지사항', url: '/mentor/notice' },
];

export const MentorSidebar = () => {
  const pathname = usePathname();

  return (
    <aside>
      <nav className="sticky left-0 top-0 z-50 flex h-screen w-[296px] flex-col justify-between border-r border-neutral-80 bg-white p-4">
        <div className="flex flex-col">
          <div className="flex h-[70px] items-center justify-between px-3 py-2.5">
            <Link href="/mentor">
              <img
                src="/logo/horizontal-logo.svg"
                alt="Logo"
                className="h-6 w-[160px]"
              />
            </Link>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"
                stroke="#27272D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21a2 2 0 0 1-3.46 0"
                stroke="#27272D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <ul className="flex flex-col">
            {navItems.map((item) => {
              const isActive =
                item.url === '/mentor'
                  ? pathname === '/mentor'
                  : pathname.startsWith(item.url);

              return (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className={`block rounded px-3 py-2.5 text-xsmall16 tracking-[-0.6px] ${
                      isActive
                        ? 'bg-primary-5 font-semibold text-primary'
                        : 'font-medium text-neutral-40'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 rounded px-3 py-2.5"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              stroke="#7A7D84"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="15 3 21 3 21 9"
              stroke="#7A7D84"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="10"
              y1="14"
              x2="21"
              y2="3"
              stroke="#7A7D84"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xsmall16 font-medium tracking-[-0.6px] text-neutral-40">
            홈페이지로 이동
          </span>
        </Link>
      </nav>
    </aside>
  );
};
