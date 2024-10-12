import { useState } from 'react';

import TableBody from '../../../components/admin/program/AdminProgramTableBody';
import TableHead from '../../../components/admin/program/AdminProgramTableHead';
import Table from '../../../components/admin/ui/table/regacy/Table';

import { useGetProgramAdminQuery } from '@/api/program';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';

const Programs = () => {
  const [pageNum, setPageNum] = useState<number>(1);

  const sizePerPage = 10;

  const { data, isLoading, error } = useGetProgramAdminQuery({
    pageable: { page: pageNum, size: sizePerPage },
  });

  const programList = data?.programList || [];
  const maxPage = data?.pageInfo?.totalPages || 1;

  return (
    <div className="p-8">
      <Header>
        <Heading>프로그램 관리</Heading>
        <ActionButton to="/admin/programs/create" bgColor="blue">
          등록
        </ActionButton>
      </Header>
      <main>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : programList.length === 0 ? (
          <div className="py-4 text-center">프로그램이 없습니다.</div>
        ) : (
          <>
            <Table>
              <TableHead />
              <TableBody programList={programList} />
            </Table>
            {programList.length > 0 && (
              <div className="mt-4">
                <AdminPagination
                  maxPage={maxPage}
                  pageNum={pageNum}
                  setPageNum={setPageNum}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Programs;
