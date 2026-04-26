import { Link } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import { IoIosArrowDown } from 'react-icons/io';

import { useIsAdminQuery } from '@/api/user/user';

// 메인 web 으로 이동하는 외부 링크의 호스트.
// VITE_WEB_URL 미설정 시 admin 자기 자신의 root 로 fallback (안전장치).
const WEB_URL = import.meta.env.VITE_WEB_URL ?? '/';

const navData = [
  {
    title: '프로그램 관리',
    itemList: [
      {
        name: '프로그램 개설',
        url: '/programs',
      },
      {
        name: '후기 관리',
        url: '/review/challenge',
      },
    ],
  },
  {
    title: '챌린지 관리',
    itemList: [
      {
        name: '콘텐츠 관리',
        url: '/challenge/contents',
      },
      {
        name: '미션 관리',
        url: '/challenge/missions',
      },
      {
        name: '챌린지 운영',
        url: '/challenge/operation',
      },
      {
        name: '피드백 운영',
        url: '/challenge/feedback-operation',
      },
    ],
  },
  {
    title: '사용자 관리',
    itemList: [
      {
        name: '커리어 DB',
        url: '/users',
      },
      {
        name: '쿠폰 관리',
        url: '/coupons',
      },
      {
        name: '멘토 관리',
        url: '/mentors',
      },
      {
        name: '리드 관리',
        url: '/leads/managements',
      },
    ],
  },
  {
    title: '홈 관리',
    itemList: [
      {
        name: '홈 큐레이션 관리',
        url: '/home/curation',
      },
    ],
  },
  {
    title: '배너/팝업 관리',
    itemList: [
      {
        name: '상단 띠 배너 관리',
        url: '/banner/top-bar-banners',
      },
      {
        name: '통합 배너 관리',
        url: '/banner/common-banners',
      },
      {
        name: '팝업 관리',
        url: '/banner/pop-up',
      },
    ],
  },
  {
    title: '블로그',
    itemList: [
      {
        name: '블로그 글 관리/등록',
        url: '/blog/list',
      },
      {
        name: '블로그 후기',
        url: '/blog/reviews',
      },
      {
        name: '블로그 광고 배너',
        url: '/blog/banner',
      },
    ],
  },
  {
    title: '마그넷',
    itemList: [
      {
        name: '마그넷 관리/등록',
        url: '/magnet/list',
      },
    ],
  },
  {
    title: '리드 관리',
    itemList: [
      {
        name: '리드 이벤트',
        url: '/leads/events',
      },
    ],
  },
  {
    title: '서류 진단',
    itemList: [
      {
        name: '서류 진단 프로그램 관리',
        url: '/report/list',
      },
    ],
  },
  {
    title: '나가기',
    itemList: [
      {
        name: '홈페이지로 이동',
        url: WEB_URL,
        isExit: true,
        external: true,
      },
    ],
  },
];

export const AdminSidebar = () => {
  const { data: isAdmin, isLoading } = useIsAdminQuery();

  if (isLoading || !isAdmin) return null;

  return (
    <aside>
      <nav className="sticky left-0 top-0 z-50 flex h-screen w-48 flex-col gap-4 overflow-y-auto bg-[#353535] py-20 pt-4 text-white shadow-xl">
        {navData.map((navSection, index) => (
          <div key={index}>
            <div className="flex items-center justify-between border-b border-b-neutral-600 pb-3 pl-4 pr-8">
              <h3 className="text-xsmall16 font-medium">{navSection.title}</h3>
              <i className="text-xl text-neutral-600">
                <IoIosArrowDown />
              </i>
            </div>
            <ul>
              {navSection.itemList.map((navItem, index) => {
                const isExternal =
                  'external' in navItem && navItem.external === true;
                const className =
                  'flex items-center gap-1 py-2 pl-6 text-xsmall14 hover:bg-[#2A2A2A]';
                const content = (
                  <>
                    {navItem.name}
                    {'isExit' in navItem && (
                      <i>
                        <ImExit className="translate-y-[1px]" />
                      </i>
                    )}
                  </>
                );

                return (
                  <li key={index}>
                    {isExternal ? (
                      <a href={navItem.url} className={className}>
                        {content}
                      </a>
                    ) : (
                      <Link to={navItem.url} className={className}>
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
