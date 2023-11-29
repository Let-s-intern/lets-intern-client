import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import { useEffect } from 'react';

import axios from '../libs/axios';

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
  }, []);

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
      <aside className="min-w-60 h-screen min-w-[250px] bg-indigo-100 px-10 py-8">
        <nav className="flex flex-col gap-7">
          {navData.map((navSection, index) => (
            <section key={index}>
              <header className="text-xl font-bold">{navSection.title}</header>
              <ul>
                {navSection.itemList.map((navItem, index) => (
                  <li key={index} className="mt-3 flex">
                    <Link
                      to={navItem.url}
                      className="flex flex-1 items-center gap-1"
                    >
                      {navItem.name}
                      {'isExit' in navItem && (
                        <ImExit className="translate-y-[1px]" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </aside>
      <main className="container relative flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
