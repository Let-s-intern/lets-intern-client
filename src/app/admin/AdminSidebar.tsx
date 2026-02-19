'use client';

import Link from 'next/link';
import { ImExit } from 'react-icons/im';
import { IoIosArrowDown } from 'react-icons/io';

import { useIsAdminQuery } from '@/api/user/user';

const navData = [
  {
    title: '프로그램 관리',
    itemList: [
      {
        name: '프로그램 개설',
        url: '/admin/programs',
      },
      {
        name: '후기 관리',
        url: '/admin/review/challenge',
      },
    ],
  },
  {
    title: '챌린지 관리',
    itemList: [
      {
        name: '콘텐츠 관리',
        url: '/admin/challenge/contents',
      },
      {
        name: '미션 관리',
        url: '/admin/challenge/missions',
      },
      {
        name: '챌린지 운영',
        url: '/admin/challenge/operation',
      },
    ],
  },
  {
    title: '사용자 관리',
    itemList: [
      {
        name: '커리어 DB',
        url: '/admin/users',
      },
      {
        name: '쿠폰 관리',
        url: '/admin/coupons',
      },
      {
        name: '멘토 관리',
        url: '/admin/mentors',
      },
    ],
  },
  {
    title: '홈 관리',
    itemList: [
      {
        name: '홈 큐레이션 관리',
        url: '/admin/home/curation',
      },
      {
        name: '홈 상단 배너 관리',
        url: '/admin/home/main-banners',
      },
      {
        name: '홈 하단 배너 관리',
        url: '/admin/home/bottom-banners',
      },
    ],
  },
  {
    title: '배너/팝업 관리',
    itemList: [
      {
        name: '상단 띠 배너 관리',
        url: '/admin/banner/top-bar-banners',
      },
      {
        name: '프로그램 배너 관리',
        url: '/admin/banner/program-banners',
      },
      {
        name: '팝업 관리',
        url: '/admin/banner/pop-up',
      },
    ],
  },
  {
    title: '블로그',
    itemList: [
      {
        name: '블로그 글 관리/등록',
        url: '/admin/blog/list',
      },
      {
        name: '블로그 후기',
        url: '/admin/blog/reviews',
      },
      {
        name: '블로그 광고 배너',
        url: '/admin/blog/banner',
      },
      {
        name: '마그넷 관리/등록',
        url: '/admin/blog/magnet/list',
      },
    ],
  },
  {
    title: '리드 관리',
    itemList: [
      {
        name: '리드 히스토리',
        url: '/admin/leads/history',
      },
      {
        name: '리드 이벤트',
        url: '/admin/leads/events',
      },
    ],
  },
  {
    title: '서류 진단',
    itemList: [
      {
        name: '서류 진단 프로그램 관리',
        url: '/admin/report/list',
      },
    ],
  },
  {
    title: '나가기',
    itemList: [
      {
        name: '홈페이지로 이동',
        url: '/',
        isExit: true,
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
              {navSection.itemList.map((navItem, index) => (
                <li key={index}>
                  <Link
                    href={navItem.url}
                    className="flex items-center gap-1 py-2 pl-6 text-xsmall14 hover:bg-[#2A2A2A]"
                  >
                    {navItem.name}
                    {'isExit' in navItem && (
                      <i>
                        <ImExit className="translate-y-[1px]" />
                      </i>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
