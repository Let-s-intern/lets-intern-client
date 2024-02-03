import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import { useEffect } from 'react';

import axios from '../../../../utils/axios';
import styled from 'styled-components';

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
          name: '챌린지 관리',
          url: '/admin/challenge',
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
    <AdminLayoutBlock>
      <LeftSection>
        <NavBar>
          {navData.map((navSection, index) => (
            <NavSection key={index}>
              <NavSectionHeading>{navSection.title}</NavSectionHeading>
              <NavSectionList>
                {navSection.itemList.map((navItem, index) => (
                  <NavListItem key={index}>
                    <NavLink to={navItem.url}>
                      {navItem.name}
                      {'isExit' in navItem && (
                        <NavIcon>
                          <ExitIcon />
                        </NavIcon>
                      )}
                    </NavLink>
                  </NavListItem>
                ))}
              </NavSectionList>
            </NavSection>
          ))}
        </NavBar>
        <NavSpacer />
      </LeftSection>
      <RightSection>
        <Outlet />
      </RightSection>
    </AdminLayoutBlock>
  );
};

export default AdminLayout;

const AdminLayoutBlock = styled.div`
  display: flex;
  font-family: NotoSansKR, sans-serif;
`;

const LeftSection = styled.aside``;

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 250px;
  height: 100vh;
  background-color: #e0e7ff;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const NavSection = styled.div``;

const NavSectionHeading = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
`;

const NavSectionList = styled.ul``;

const NavListItem = styled.li`
  margin-top: 0.75rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const NavIcon = styled.i``;

const ExitIcon = styled(ImExit)`
  transform: translateY(1px);
`;

const NavSpacer = styled.div`
  width: 250px;
`;

const RightSection = styled.section`
  position: relative;
  flex: 1;
  width: calc(100% - 250px);
  min-height: 100vh;
`;
