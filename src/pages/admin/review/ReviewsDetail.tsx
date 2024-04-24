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

  const getReviewList = useQuery({
    queryKey: [
      'review',
      'admin',
      params.programId,
      {
        page: searchParams.get('page'),
        size: 10,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/review/admin/${params.programId}`, {
        params: queryKey[3],
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (getReviewList.data) {
      setReviewList(getReviewList.data.reviewList);
      setMaxPage(getReviewList.data.pageInfo.totalPages);
    }
  }, [getReviewList]);

  const getProgram = useQuery({
    queryKey: ['program', 'admin', params.programId],
    queryFn: async () => {
      const res = await axios.get(`/program/${params.programId}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (getProgram.data) {
      setProgram(getProgram.data.programDetailVo);
    }
  }, [getProgram]);

  const changeReviewVisible = useMutation({
    mutationFn: async (params: { reviewId: number; status: string }) => {
      const res = await axios.patch(`/review/${params.reviewId}`, {
        status: params.status,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['review'] });
    },
  });

  const handleVisibleChanged = async (reviewId: number, status: string) => {
    changeReviewVisible.mutate({ reviewId, status });
  };

  return (
    <div className="p-8">
      <header className="mb-4">
        <Heading>후기 목록 {program && <>- {program.title}</>}</Heading>
      </header>
      <main>
        <Table>
          <TableHead />
          <TableBody
            reviewList={reviewList}
            handleVisibleChanged={handleVisibleChanged}
          />
        </Table>
        {reviewList.length > 0 && (
          <AdminPagination className="mt-4" maxPage={maxPage} />
        )}
      </main>
    </div>
  );
};

export default ReviewsDetail;
