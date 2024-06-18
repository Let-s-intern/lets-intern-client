import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../utils/axios';
import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import Table from '../../../components/admin/ui/table/regacy/Table';
import Filter from '../../../components/admin/user/users/filter/Filter';
import TableBody from '../../../components/admin/user/users/table-content/TableBody';
import TableHead from '../../../components/admin/user/users/table-content/TableHead';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';

const Users = () => {
  const [searchParams] = useSearchParams();
  const [searchValues, setSearchValues] = useState<any>({});

  const params = {
    page: searchParams.get('page') || '1',
    size: 10,
    ...searchValues,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', 'admin', params],
    queryFn: async () => {
      const res = await axios.get('/user/admin', {
        params,
      });
      return res.data;
    },
  });

  const userList = data?.data?.userAdminList || [];
  const maxPage = data?.data?.pageInfo?.totalPages || 1;

  return (
    <div className="p-8">
      <Header>
        <Heading>회원 관리</Heading>
      </Header>
      <main>
        <div className="mb-4">
          <Filter setSearchValues={setSearchValues} />
        </div>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : userList.length === 0 ? (
          <div className="py-4 text-center">유저가 없습니다.</div>
        ) : (
          <>
            <Table>
              <TableHead />
              <TableBody userList={userList} />
            </Table>
            <div className="mt-4">
              <AdminPagination maxPage={maxPage} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Users;
