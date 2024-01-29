import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import ActionButton from '../../../components/admin/ActionButton';
import Header from '../../../components/admin/Header';
import Heading from '../../../components/admin/Heading';
import Table from '../../../components/admin/table/Table';
import Filter from '../../../components/admin/Filter';
import TableBody from '../../../components/admin/table/table-content/users/TableBody';
import TableHead from '../../../components/admin/table/table-content/users/TableHead';
import AdminPagination from '../../../components/admin/AdminPagination';
import classes from './Users.module.scss';

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<any>(null);
  const [managers, setManagers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [searchValues, setSearchValues] = useState<any>({});
  const [maxPage, setMaxPage] = useState(1);

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
          const accountRes = await axios.get(`/user/admin/${user.id}`);
          const { accountType, accountNumber } = accountRes.data;
          searchedUsers.push({
            ...user,
            programs: [...res.data.userProgramList],
            accountType,
            accountNumber,
          });
        }
        searchedUsers = searchUsersWithQuery(searchedUsers);
        setUsers(searchedUsers);
        setMaxPage(res.data.pageInfo.totalPages);
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
      <main className={classes.main}>
        <div className={classes.filterWrapper}>
          <Filter
            searchValues={searchValues}
            managers={managers}
            onChangeSearchValues={handleChangeSearchValues}
            setSearchValues={setSearchValues}
          />
        </div>
        {error ? (
          <div>에러 발생</div>
        ) : (
          <>
            {loading || !users ? (
              <div className={classes.loading}>로딩 중...</div>
            ) : users.length === 0 ? (
              <div className={classes.empty}>유저 정보가 없습니다.</div>
            ) : (
              <>
                <Table>
                  <TableHead />
                  <TableBody
                    users={users}
                    setUsers={setUsers}
                    onDeleteUser={handleDeleteUser}
                  />
                </Table>
                <div className={classes.pagination}>
                  <AdminPagination maxPage={maxPage} />
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Users;
