'use client';

import { useUserAdminQuery } from '@/api/user';
import Header from '@/components/admin/ui/header/Header';
import Heading from '@/components/admin/ui/heading/Heading';
import AdminUserFilter from '@/components/admin/user/users/filter/AdminUserFilter';
import UserAdminTable from '@/components/admin/user/users/table-content/UserAdminTable';
import { useState } from 'react';

const AdminUsersPage = () => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchValues, setSearchValues] = useState<{
    name: string;
    email: string;
    phoneNum: string;
    university: string;
    memo: string;
  }>({
    name: '',
    email: '',
    phoneNum: '',
    university: '',
    memo: '',
  });

  const { data, isLoading, isError } = useUserAdminQuery({
    email: searchValues.email,
    name: searchValues.name,
    phoneNum: searchValues.phoneNum,
    university: searchValues.university,
    memo: searchValues.memo,
    pageable: {
      page: pageNum,
      size: pageSize,
    },
  });

  const handlePageChange = (page: number, size: number) => {
    setPageNum(page);
    setPageSize(size);
  };

  return (
    <div className="p-8">
      <Header>
        <Heading>커리어 DB</Heading>
      </Header>
      <main>
        <div className="mb-4">
          <AdminUserFilter setSearchValues={setSearchValues} />
        </div>
        {isError ? (
          <div className="py-4 text-center">에러가 발생했습니다.</div>
        ) : (
          <UserAdminTable
            userList={data?.userAdminList || []}
            isLoading={isLoading}
            pageNum={pageNum}
            pageSize={pageSize}
            totalElements={data?.pageInfo.totalElements || 0}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};

export default AdminUsersPage;
