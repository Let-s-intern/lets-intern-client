'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationBell from '@/domain/mentor/notification/ui/NotificationBell';

const navItems = [
  { name: '프로그램 일정', url: '/mentor' },
  { name: '피드백 현황', url: '/mentor/feedback-management' },
  { name: '참여중인 챌린지', url: '/mentor/challenges' },
  { name: '프로필', url: '/mentor/profile' },
  { name: '공지사항', url: '/mentor/notice' },
];

interface MentorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MentorSidebar = ({ isOpen, onClose }: MentorSidebarProps) => {
  const pathname = usePathname();
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    setIsPwa(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen transition-transform duration-200 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="border-neutral-80 flex h-screen w-[296px] flex-col justify-between border-r bg-white p-4">
          <div className="flex flex-col">
            <div className="flex h-[70px] items-center justify-between px-3 py-2.5">
              <Link href="/mentor" onClick={onClose}>
                <img
                  src="/logo/horizontal-logo.svg"
                  alt="Logo"
                  className="h-6 w-[160px]"
                />
              </Link>
              <div className="flex items-center gap-2">
                <NotificationBell />
                {/* Close button for mobile */}
                <button
                  type="button"
                  onClick={onClose}
                  className="text-neutral-40 p-1 lg:hidden"
                  aria-label="메뉴 닫기"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 5L15 15M15 5L5 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
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
                      onClick={onClose}
                      className={`text-xsmall16 block rounded px-3 py-2.5 tracking-[-0.6px] ${
                        isActive
                          ? 'bg-primary-5 text-primary font-semibold'
                          : 'text-neutral-40 font-medium'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {!isPwa && (
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
              <span className="text-xsmall16 text-neutral-40 font-medium tracking-[-0.6px]">
                홈페이지로 이동
              </span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};
