import { useQuery } from '@tanstack/react-query';

import { useCallback, useState } from 'react';
import TableBody from '../../../components/admin/review/reviews/table-content/TableBody';
import TableHead from '../../../components/admin/review/reviews/table-content/TableHead';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import Table from '../../../components/admin/ui/table/regacy/Table';
import axios from '../../../utils/axios';

const Reviews = () => {
  const [pageNum, setPageNum] = useState<number>(1);
  const sizePerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['program', 'admin', { page: pageNum, size: sizePerPage }],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: { page: pageNum, size: sizePerPage },
      });
      return res.data;
    },
  });

  const programList = data?.data?.programList || [];
  const maxPage = data?.data?.pageInfo?.totalPages || 1;

  const copyReviewCreateLink = useCallback(
    (info: {
      id: number;
      title: string;
      startDate: string;
      programType: string;
    }) => {
      const url = `${window.location.protocol}//${window.location.host}/write-review/${info.programType.toLowerCase()}/${info.id}`;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert('링크가 클립보드에 복사되었습니다.');
        })
        .catch((err) => {
          console.error(err);
          alert('링크 복사에 실패했습니다.');
        });
    },
    [],
  );

  return (
    <div className="p-8">
      <header className="mb-4">
        <h1 className="text-1.5-bold">후기 관리</h1>
      </header>
      <main>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : programList.length === 0 ? (
          <div className="py-4 text-center">프로그램이 없습니다.</div>
        ) : (
          <>
            <Table minWidth={1000}>
              <TableHead />
              <TableBody
                programList={programList}
                copyReviewCreateLink={copyReviewCreateLink}
              />
            </Table>
            {programList.length > 0 && (
              <AdminPagination
                className="mt-4"
                maxPage={maxPage}
                pageNum={pageNum}
                setPageNum={setPageNum}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Reviews;
