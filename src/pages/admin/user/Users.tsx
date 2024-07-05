import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import Table from '../../../components/admin/ui/table/regacy/Table';
import Filter from '../../../components/admin/user/users/filter/Filter';
import TableBody from '../../../components/admin/user/users/table-content/TableBody';
import TableHead from '../../../components/admin/user/users/table-content/TableHead';
import { IUser } from '../../../interfaces/User.interface';
import axios from '../../../utils/axios';

const Users = () => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [searchValues, setSearchValues] = useState<{
    name: string;
    email: string;
    phoneNum: string;
  }>({
    name: '',
    email: '',
    phoneNum: '',
  });

  const params = {
    page: pageNum,
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

  const userList: IUser[] = data?.data?.userAdminList || [];
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
              <AdminPagination
                maxPage={maxPage}
                pageNum={pageNum}
                setPageNum={setPageNum}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Users;
