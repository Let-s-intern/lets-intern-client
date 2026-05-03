import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from '@/pages/notification/ui/NotificationBell';

interface NavLeaf {
  type: 'leaf';
  name: string;
  url: string;
}

interface NavGroup {
  type: 'group';
  name: string;
  /** 그룹 활성 판정용 prefix */
  matchPrefix: string;
  children: NavLeaf[];
}

type NavItem = NavLeaf | NavGroup;

const navItems: NavItem[] = [
  { type: 'leaf', name: '프로그램 일정', url: '/' },
  {
    type: 'group',
    name: '피드백',
    matchPrefix: '/feedback',
    children: [
      { type: 'leaf', name: '피드백 관리', url: '/feedback-management' },
      { type: 'leaf', name: '라이브 피드백 일정 열기', url: '/feedback/live-availability' },
      { type: 'leaf', name: '예약 현황', url: '/feedback/live-reservation' },
      { type: 'leaf', name: '멘티관리', url: '/feedback/live-mentee' },
    ],
  },
  { type: 'leaf', name: '참여중인 챌린지', url: '/challenges' },
  { type: 'leaf', name: '프로필', url: '/profile' },
  { type: 'leaf', name: '공지사항', url: '/notice' },
];

interface MentorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function isLeafActive(pathname: string, url: string): boolean {
  if (url === '/') return pathname === '/';
  return pathname === url || pathname.startsWith(`${url}/`);
}

function isGroupActive(pathname: string, group: NavGroup): boolean {
  return group.children.some((child) => isLeafActive(pathname, child.url));
}

export const MentorSidebar = ({ isOpen, onClose }: MentorSidebarProps) => {
  const pathname = useLocation().pathname;
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    setIsPwa(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  // 활성 경로가 포함된 그룹은 자동 펼침
  const initialOpenGroups = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const item of navItems) {
      if (item.type === 'group') {
        map[item.name] = isGroupActive(pathname, item);
      }
    }
    return map;
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    initialOpenGroups,
  );

  // 라우트 변경으로 새로 활성화된 그룹은 자동 펼침 (사용자 수동 펼침은 유지)
  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const item of navItems) {
        if (item.type === 'group' && isGroupActive(pathname, item)) {
          next[item.name] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

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
              <Link to="/" onClick={onClose}>
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
                if (item.type === 'leaf') {
                  const isActive = isLeafActive(pathname, item.url);
                  return (
                    <li key={item.url}>
                      <Link
                        to={item.url}
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
                }

                const groupOpen = !!openGroups[item.name];
                const groupActive = isGroupActive(pathname, item);
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.name)}
                      aria-expanded={groupOpen}
                      aria-controls={`nav-group-${item.name}`}
                      className={`text-xsmall16 flex w-full items-center justify-between rounded px-3 py-2.5 text-left tracking-[-0.6px] ${
                        groupActive
                          ? 'text-primary font-semibold'
                          : 'text-neutral-40 font-medium'
                      }`}
                    >
                      <span>{item.name}</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className={`transition-transform ${
                          groupOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {groupOpen && (
                      <ul
                        id={`nav-group-${item.name}`}
                        className="mt-0.5 flex flex-col"
                      >
                        {item.children.map((child) => {
                          const childActive = isLeafActive(pathname, child.url);
                          return (
                            <li key={child.url}>
                              <Link
                                to={child.url}
                                onClick={onClose}
                                className={`text-xsmall14 block rounded px-3 py-2 pl-6 tracking-[-0.6px] ${
                                  childActive
                                    ? 'bg-primary-5 text-primary font-semibold'
                                    : 'text-neutral-40 font-medium'
                                }`}
                              >
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          {!isPwa && (
            <a
              href={import.meta.env.VITE_WEB_URL ?? '#'}
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
            </a>
          )}
        </nav>
      </aside>
    </>
  );
};
