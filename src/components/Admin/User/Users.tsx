import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../../../libs/axios';
import ActionButton from '../ActionButton';
import Header from '../Header';
import Heading from '../Heading';
import Table from '../Table';
import Filter from './Filter';
import TableBody from './TableBody';
import TableHead from './TableHead';
import AdminPagination from '../AdminPagination';

import './Users.scss';

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<any>(null);
  const [managers, setManagers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [searchValues, setSearchValues] = useState<any>({});

  const sizePerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setUsers(null);
      try {
        const currentPage = searchParams.get('page');
        const params = {
          page: currentPage,
          size: sizePerPage,
        };
        const res = await axios.get('/user/admin', {
          params,
        });
        let searchedUsers = [];
        for (const user of res.data.userList) {
          const res = await axios.get(`/program/admin/user/${user.id}`);
          searchedUsers.push({
            ...user,
            programs: [...res.data.userProgramList],
          });
        }
        searchedUsers = searchUsersWithQuery(searchedUsers);
        setUsers(searchedUsers);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchManagers = async () => {
      try {
        const res = await axios.get('/user/admin/manager');
        setManagers(res.data.managerList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    fetchManagers();
  }, [searchParams]);

  const searchUsersWithQuery = (users: any) => {
    const keyword = searchParams.get('keyword');
    const type = searchParams.get('type');
    const th = Number(searchParams.get('th'));
    const managerId = Number(searchParams.get('managerId'));
    if (keyword) {
      users = users.filter(
        (user: any) =>
          user.name.includes(keyword) ||
          user.email.includes(keyword) ||
          user.phoneNum.includes(keyword),
      );
    }
    if (type) {
      users = users.filter((user: any) => {
        for (const program of user.programs) {
          if (program.type === type) {
            return true;
          }
        }
        return false;
      });
    }
    if (th) {
      users = users.filter((user: any) => {
        for (const program of user.programs) {
          if (program.th === th) {
            return true;
          }
        }
        return false;
      });
    }
    if (managerId) {
      if (managerId === 0) {
        users = users.filter((user: any) => user.managerId === null);
      } else {
        users = users.filter((user: any) => user.managerId === managerId);
      }
    }

    return users;
  };

  const handleChangeSearchValues = (e: any) => {
    const { name, value } = e.target;
    setSearchValues({
      ...searchValues,
      [name]: value,
    });
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      alert('삭제가 취소되었습니다.');
      return;
    }
    await axios.delete(`/user/admin/${userId}`);
    const newUser = users.filter((user: any) => user.id !== userId);
    setUsers(newUser);
    alert('삭제되었습니다.');
  };

  return (
    <>
      <Header>
        <Heading>회원 관리</Heading>
        <ActionButton to="/admin/users/create" bgColor="blue">
          등록
        </ActionButton>
      </Header>
      <main className="users-main">
        <FilterWrapper>
          <Filter
            searchValues={searchValues}
            managers={managers}
            onChangeSearchValues={handleChangeSearchValues}
            setSearchValues={setSearchValues}
          />
        </FilterWrapper>
        {error ? (
          <div>에러 발생</div>
        ) : (
          <>
            {loading || !users ? (
              <div className="loading-table">로딩 중...</div>
            ) : users.length === 0 ? (
              <div className="empty-table">유저 정보가 없습니다.</div>
            ) : (
              <Table>
                <TableHead />
                <TableBody
                  users={users}
                  setUsers={setUsers}
                  onDeleteUser={handleDeleteUser}
                />
              </Table>
            )}
          </>
        )}
        <AdminPagination maxPage={10} />
      </main>
    </>
  );
};

export default Users;

const FilterWrapper = styled.div`
  margin-bottom: 1rem;
`;
