import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import { IoIosArrowDown } from 'react-icons/io';

import axios from '../../../../utils/axios';
import { useQuery } from '@tanstack/react-query';

const AdminLayout = () => {
  const navigate = useNavigate();

  const [challengeId, setChallengeId] = useState<number>(0);

  useQuery({
    queryKey: ['program', 'admin', { type: 'CHALLENGE' }, 'admin_layout'],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: { type: 'CHALLENGE' },
      });
      const challengeId =
        Number(localStorage.getItem('admin-challenge-id')) || 0;
      if (challengeId) {
        res.data.programList
          .filter((challenge: any) => challenge.th !== 0)
          .forEach((challenge: any) => {
            if (challenge.id === challengeId) {
              setChallengeId(challenge.id);
              return;
            }
          });
      }
      return res.data;
    },
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');

    if (!accessToken || !refreshToken) {
      navigate('/login');
    }

    const fetchIsAdmin = async () => {
      try {
        const res = await axios.get('/user/isAdmin');
        if (!res.data) {
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchIsAdmin();
  }, [navigate]);

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
          url: '/admin/reviews',
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
          name: '챌린지 운영',
          url: challengeId
            ? `/admin/challenge/${challengeId}`
            : '/admin/challenge',
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
      ],
    },
    {
      title: '홈페이지 관리',
      itemList: [
        {
          name: '메인 배너 관리',
          url: '/admin/banners/main-banners',
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

  return (
    <div className="flex font-pretendard">
      <aside>
        <nav className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col gap-8 overflow-y-auto bg-[#353535] pt-20 text-white">
          {navData.map((navSection, index) => (
            <div key={index}>
              <div className="flex items-center justify-between border-b border-b-neutral-600 pb-3 pl-12 pr-8">
                <h3 className="text-lg font-medium">{navSection.title}</h3>
                <i className="text-xl text-neutral-600">
                  <IoIosArrowDown />
                </i>
              </div>
              <ul>
                {navSection.itemList.map((navItem, index) => (
                  <li key={index}>
                    <Link
                      to={navItem.url}
                      className="flex items-center gap-1 py-3 pl-12 hover:bg-[#2A2A2A]"
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
        <div className="w-64" />
      </aside>
      <section className="relative min-h-screen w-[calc(100%-16rem)] flex-1">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;
