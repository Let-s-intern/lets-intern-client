import { useEffect } from 'react';
import { ImExit } from 'react-icons/im';
import { IoIosArrowDown } from 'react-icons/io';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';
import { useQuery } from '@tanstack/react-query';
import axios from '../../../../utils/axios';

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
        name: '회원 DB',
        url: '/admin/users',
      },
      {
        name: '쿠폰 관리',
        url: '/admin/coupons',
      },
      {
        name: '출시 알림 신청',
        url: '/admin/notification/list',
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

const AdminLayout = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['user', 'isAdmin'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/${queryKey[0]}/${queryKey[1]}`);
      return res.data;
    },
  });

  const isAdmin = data?.data || false;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAdmin) {
      navigate('/');
    }
  }, [data, isAdmin, isLoading, navigate]);

  if (!isAdmin) return null;

  return (
    <main className="flex">
      <aside>
        <nav className="sticky left-0 top-0 z-50 flex h-screen w-48 flex-col gap-4 overflow-y-auto bg-[#353535] py-20 pt-4 text-white shadow-xl">
          {navData.map((navSection, index) => (
            <div key={index}>
              <div className="flex items-center justify-between border-b border-b-neutral-600 pb-3 pl-4 pr-8">
                <h3 className="text-xsmall16 font-medium">
                  {navSection.title}
                </h3>
                <i className="text-xl text-neutral-600">
                  <IoIosArrowDown />
                </i>
              </div>
              <ul>
                {navSection.itemList.map((navItem, index) => (
                  <li key={index}>
                    <Link
                      to={navItem.url}
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
      <section className="relative min-h-screen min-w-[800px] flex-1">
        <AdminSnackbarProvider>
          <Outlet />
        </AdminSnackbarProvider>
      </section>
    </main>
  );
};

export default AdminLayout;
