'use client';

import { useUserAdminQuery } from '@/api/user';
import Header from '@/components/admin/ui/header/Header';
import Heading from '@/components/admin/ui/heading/Heading';
import AdminPagination from '@/components/admin/ui/pagination/AdminPagination';
import Table from '@/components/admin/ui/table/regacy/Table';
import AdminUserFilter from '@/components/admin/user/users/filter/AdminUserFilter';
import TableBody from '@/components/admin/user/users/table-content/TableBody';
import TableHead from '@/components/admin/user/users/table-content/TableHead';
import { useState } from 'react';

const AdminUsersPage = () => {
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
  const { data, isLoading, isError } = useUserAdminQuery({
    email: searchValues.email,
    name: searchValues.name,
    phoneNum: searchValues.phoneNum,
    pageable: {
      page: pageNum,
      size: 10,
    },
  });

  const maxPage = data?.pageInfo.totalPages || 1;

  return (
    <div className="p-8">
      <Header>
        <Heading>커리어 DB</Heading>
      </Header>
      <main>
        <div className="mb-4">
          <AdminUserFilter setSearchValues={setSearchValues} />
        </div>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : isError ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : !data || data.userAdminList.length === 0 ? (
          <div className="py-4 text-center">유저가 없습니다.</div>
        ) : (
          <>
            <Table>
              <TableHead />
              <TableBody userList={data.userAdminList} />
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

export default AdminUsersPage;
