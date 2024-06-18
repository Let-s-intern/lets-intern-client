import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Table from '../../../components/admin/ui/table/regacy/Table';
import TableHead from '../../../components/admin/program/programs/table-content/TableHead';
import TableBody from '../../../components/admin/program/programs/table-content/TableBody';

import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import axios from '../../../utils/axios';

const Programs = () => {
  const [searchParams] = useSearchParams();

  const sizePerPage = 10;
  const currentPage = searchParams.get('page') || 1;

  const { data, isLoading, error } = useQuery({
    queryKey: ['program', 'admin', { page: currentPage, size: sizePerPage }],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: { page: currentPage, size: sizePerPage },
      });
      return res.data;
    },
  });

  const programList = data?.data?.programList || [];
  const maxPage = data?.data?.pageInfo?.totalPages || 1;

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
                <AdminPagination maxPage={maxPage} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Programs;
