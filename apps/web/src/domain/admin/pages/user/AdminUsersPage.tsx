'use client';

import { useUserAdminQuery } from '@/api/user/user';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import AdminUserFilter from '@/domain/admin/user/users/filter/AdminUserFilter';
import UserAdminTable from '@/domain/admin/user/users/table-content/UserAdminTable';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import { useState } from 'react';

const AdminUsersPage = () => {
  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 10 });

  // UserAdminTable은 pageNum이 1부터 시작하므로 변환 필요
  const pageNum = paginationModel.page + 1;
  const pageSize = paginationModel.pageSize;
  const [searchValues, setSearchValues] = useState<{
    createDate: string;
    name: string;
    email: string;
    phoneNum: string;
    university: string;
    wishJob: string;
    wishIndustry: string;
    wishEmploymentType: string;
    programTitle: string;
    title: string;
    company: string;
    job: string;
    memo: string;
  }>({
    createDate: '',
    name: '',
    email: '',
    phoneNum: '',
    university: '',
    wishJob: '',
    wishIndustry: '',
    wishEmploymentType: '',
    programTitle: '',
    title: '',
    company: '',
    job: '',
    memo: '',
  });

  const { data, isLoading, isError } = useUserAdminQuery({
    email: searchValues.email,
    name: searchValues.name,
    phoneNum: searchValues.phoneNum,
    university: searchValues.university,
    wishJob: searchValues.wishJob,
    wishIndustry: searchValues.wishIndustry,
    wishEmploymentType: searchValues.wishEmploymentType,
    programTitle: searchValues.programTitle,
    title: searchValues.title,
    company: searchValues.company,
    job: searchValues.job,
    memo: searchValues.memo,
    pageable: {
      page: pageNum,
      size: pageSize,
    },
  });

  const handlePageChange = (page: number, size: number) => {
    // UserAdminTable에서 받은 page는 1부터 시작하므로 0부터 시작하는 형식으로 변환
    handlePaginationModelChange({ page: page - 1, pageSize: size });
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
