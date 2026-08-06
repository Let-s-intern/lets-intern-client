import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LiveMentoringOpenBadge from '@/pages/live-mentoring/ui/LiveMentoringOpenBadge';
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
  /** true 면 대주제 클릭으로 하위 항목을 열고 닫는 드롭다운으로 동작한다. */
  collapsible?: boolean;
  /** true 면 그룹 이름 옆에 1대1 라이브 멘토링 오픈 상태 배지를 붙인다. */
  showLiveMentoringStatus?: boolean;
}

type NavItem = NavLeaf | NavGroup;

const navItems: NavItem[] = [
  { type: 'leaf', name: '공지사항', url: '/notice' },
  {
    type: 'group',
    name: '피드백',
    matchPrefix: '/feedback',
    children: [
      { type: 'leaf', name: '피드백 캘린더', url: '/' },
      { type: 'leaf', name: '피드백 내역', url: '/feedback-management' },
      {
        type: 'leaf',
        name: 'LIVE 슬롯 오픈',
        url: '/feedback/live-availability',
      },
      // [임시 숨김] 예약 현황 (dusvlf111, 2026-07-17)
      // 멘티가 신청한 라이브 피드백 예약 내역 페이지(/feedback/live-reservation).
      // 사이드바 진입점만 가림 — 라우트/페이지는 유지, 추후 복원 시 주석 해제.
      // { type: 'leaf', name: '예약 현황', url: '/feedback/live-reservation' },
    ],
  },
  {
    type: 'group',
    name: '1대1 라이브 멘토링',
    matchPrefix: '/live-mentoring',
    collapsible: true,
    showLiveMentoringStatus: true,
    children: [
      { type: 'leaf', name: '오픈 설정', url: '/live-mentoring/open-settings' },
      {
        type: 'leaf',
        name: '상세 페이지 설정',
        url: '/live-mentoring/detail-settings',
      },
      { type: 'leaf', name: '오픈 현황', url: '/live-mentoring/open-status' },
      { type: 'leaf', name: '정산 현황', url: '/live-mentoring/settlement' },
    ],
  },
  // [임시 숨김] 참여중인 챌린지 (dusvlf111, 2026-07-17)
  // 멘토가 참여 중인 챌린지 목록 페이지(/challenges).
  // 사이드바 진입점만 가림 — 라우트/페이지는 유지, 추후 복원 시 주석 해제.
  // { type: 'leaf', name: '참여중인 챌린지', url: '/challenges' },
  { type: 'leaf', name: '프로필', url: '/profile' },
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

  // collapsible 그룹의 열림 상태 — 활성 그룹은 기본 열림.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      navItems
        .filter(
          (i): i is NavGroup => i.type === 'group' && Boolean(i.collapsible),
        )
        .map((g) => [g.name, isGroupActive(pathname, g)]),
    ),
  );

  const toggleGroup = (name: string) =>
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));

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

                const groupActive = isGroupActive(pathname, item);
                const isCollapsible = Boolean(item.collapsible);
                const expanded = isCollapsible ? openGroups[item.name] : true;
                const parentClass = `text-xsmall16 rounded px-3 py-2.5 tracking-[-0.6px] ${
                  groupActive
                    ? 'text-primary font-semibold'
                    : 'text-neutral-40 font-medium'
                }`;
                // 이름 옆 상태 배지 — 오픈 중이 아니면 배지 컴포넌트가 스스로 null 을 낸다.
                const groupLabel = (
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate">{item.name}</span>
                    {item.showLiveMentoringStatus && <LiveMentoringOpenBadge />}
                  </span>
                );
                return (
                  <li key={item.name}>
                    {isCollapsible ? (
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => toggleGroup(item.name)}
                        className={`${parentClass} flex w-full items-center justify-between gap-2`}
                      >
                        {groupLabel}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        >
                          <path
                            d="M6 8l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : (
                      <p className={parentClass}>{groupLabel}</p>
                    )}
                    {expanded && (
                      <ul className="mt-0.5 flex flex-col">
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
