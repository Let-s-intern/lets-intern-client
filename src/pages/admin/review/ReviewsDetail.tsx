import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import axios from '../../../utils/axios';
import Table from '../../../components/admin/ui/table/regacy/Table';
import TableHead from '../../../components/admin/review/review-detail/table-content/TableHead';
import TableBody, {
  DetailTableBodyProps,
} from '../../../components/admin/review/review-detail/table-content/TableBody';
import Heading from '../../../components/admin/ui/heading/Heading';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';

const ReviewsDetail = () => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const [reviewList, setReviewList] = useState<
    DetailTableBodyProps['reviewList']
  >([]);
  const [program, setProgram] = useState<{ title: string }>();
  const [maxPage, setMaxPage] = useState<number>(0);

  const programType = searchParams.get('type') || '';

  useQuery({
    queryKey: [
      programType?.toLowerCase(),
      params.programId,
      'reviews',
      {
        page: searchParams.get('page') || 1,
        size: 10,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/${queryKey[0]}/${queryKey[1]}/reviews`, {
        params: queryKey[2],
      });
      setReviewList(res.data.data.reviewList);
      setMaxPage(res.data.data.pageInfo.totalPages);
      return res.data;
    },
  });

  useQuery({
    queryKey: [programType.toLowerCase(), params.programId, 'title'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      setProgram({ title: res.data.data.title });
      return res.data;
    },
  });

  return (
    <div className="p-8">
      <header className="mb-4">
        <Heading>후기 목록 {program && <>- {program.title}</>}</Heading>
      </header>
      <main>
        <Table>
          <TableHead />
          <TableBody reviewList={reviewList} programType={programType} />
        </Table>
        {reviewList.length > 0 && (
          <AdminPagination className="mt-4" maxPage={maxPage} />
        )}
      </main>
    </div>
  );
};

export default ReviewsDetail;
