import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import { IoIosArrowDown } from 'react-icons/io';

import axios from '../../../../utils/axios';

const AdminLayout = () => {
  const navigate = useNavigate();

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
          name: '챌린지 운영',
          url: '/admin/challenge',
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
    <div className="flex font-notosans">
      <aside>
        <nav className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col gap-8 bg-[#353535] pt-20 text-white">
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
