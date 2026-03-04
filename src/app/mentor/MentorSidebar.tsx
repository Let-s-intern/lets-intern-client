'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '프로그램 일정', url: '/mentor' },
  { name: '참여중인 챌린지', url: '/mentor/challenges' },
  { name: 'Profile', url: '/mentor/profile' },
];

export const MentorSidebar = () => {
  const pathname = usePathname();

  return (
    <aside>
      <nav className="sticky left-0 top-0 z-50 flex h-screen w-48 flex-col gap-2 bg-white py-6 shadow-md">
        <div className="mb-8 px-6">
          <Link href="/mentor" className="text-lg font-bold text-neutral-900">
            Logo
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
      </nav>
    </aside>
  );
};
