import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../utils/axios';
import TableHead from '../../../components/admin/review/reviews/table-content/TableHead';
import TableBody, {
  ReviewTableBodyProps,
} from '../../../components/admin/review/reviews/table-content/TableBody';
import Table from '../../../components/admin/ui/table/regacy/Table';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';

const Reviews = () => {
  const [searchParams] = useSearchParams();
  const [programList, setProgramList] = useState<
    ReviewTableBodyProps['programList']
  >([]);
  const [maxPage, setMaxPage] = useState(1);

  const sizePerPage = 10;
  const currentPage = searchParams.get('page') || 1;

  const getProgramList = useQuery({
    queryKey: ['program', 'admin', { page: currentPage, size: sizePerPage }],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: { page: currentPage, size: sizePerPage },
      });
      setProgramList(res.data.data.programList);
      setMaxPage(res.data.data.pageInfo.totalPages);
      return res.data;
    },
  });

  const copyReviewCreateLink = (programId: number) => {
    const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/program/${programId}/review/create`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
      })
      .catch((err) => {
        console.error('복사에 실패했습니다:', err);
      });
  };

  return (
    <div className="p-8">
      <header className="mb-4">
        <h1 className="text-1.5-bold">후기 관리</h1>
      </header>
      <main>
        <Table minWidth={1000}>
          <TableHead />
          <TableBody
            programList={programList}
            copyReviewCreateLink={copyReviewCreateLink}
          />
        </Table>
        {programList.length > 0 && (
          <AdminPagination className="mt-4" maxPage={maxPage} />
        )}
      </main>
    </div>
  );
};

export default Reviews;
