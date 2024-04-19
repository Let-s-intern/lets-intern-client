import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import Table from '../../../components/admin/ui/table/regacy/Table';
import Filter from '../../../components/admin/user/users/filter/Filter';
import TableBody from '../../../components/admin/user/users/table-content/TableBody';
import TableHead from '../../../components/admin/user/users/table-content/TableHead';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import classes from './Users.module.scss';
import { useQuery } from '@tanstack/react-query';

const Users = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<any>();
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<unknown>();
  const [searchValues, setSearchValues] = useState<any>({});
  const [maxPage, setMaxPage] = useState(1);

  const sizePerPage = 10;

  const params = {
    page: searchParams.get('page') || '1',
    size: sizePerPage,
    ...searchValues,
  };

  const usersQuery = useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const res = await axios.get('/user/admin', {
        params,
      });
      setMaxPage(res.data.pageInfo.totalPages);
      return res.data.userList;
    },
  });

  useEffect(() => {
    if (!usersQuery.data) {
      return;
    }
    const fetchUsers = async () => {
      let newUsers: any = [];
      try {
        setIsUsersLoading(true);
        for (const user of usersQuery.data) {
          const programRes = await axios.get(`/program/admin/user/${user.id}`);
          const accountRes = await axios.get(`/user/admin/${user.id}`);
          const newUser = {
            ...user,
            programs: programRes.data.userProgramList,
            accountType: accountRes.data.accountType,
            accountNumber: accountRes.data.accountNumber,
          };
          newUsers.push(newUser);
        }
        setUsers(newUsers);
      } catch (error: unknown) {
        setUsersError(error);
      } finally {
        setIsUsersLoading(false);
      }
    };
    fetchUsers();
  }, [usersQuery.data]);

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      alert('삭제가 취소되었습니다.');
      return;
    }
    await axios.delete(`/user/admin/${userId}`);
    const newUsers = users.filter((user: any) => user.id !== userId);
    setUsers(newUsers);
    alert('삭제되었습니다.');
  };

  return (
    <div className="p-8">
      <Header>
        <Heading>회원 관리</Heading>
        <ActionButton to="/admin/users/create" bgColor="blue">
          등록
        </ActionButton>
      </Header>
      <main className={classes.main}>
        <div className={classes.filterWrapper}>
          <Filter setSearchValues={setSearchValues} />
        </div>
        {usersError ? (
          <div>에러 발생</div>
        ) : (
          <>
            {isUsersLoading || !users ? (
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
    </div>
  );
};

export default Users;
