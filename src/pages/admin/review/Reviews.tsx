import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../utils/axios';
import TableHead from '../../../components/admin/review/reviews/table-content/TableHead';
import TableBody from '../../../components/admin/review/reviews/table-content/TableBody';
import Table from '../../../components/admin/ui/table/regacy/Table';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';

const Reviews = () => {
  const [searchParams] = useSearchParams();
  const [programList, setProgramList] = useState([]);
  const [maxPage, setMaxPage] = useState(1);

  const getProgramList = useQuery({
    queryKey: [
      'program',
      'admin',
      {
        page: searchParams.get('page'),
        size: 10,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get('/program/admin', {
        params: queryKey[2],
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (getProgramList.data) {
      setProgramList(getProgramList.data.programList);
      setMaxPage(getProgramList.data.pageInfo.totalPages);
    }
  }, [getProgramList]);

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
