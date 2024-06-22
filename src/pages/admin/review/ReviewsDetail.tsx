import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

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
  const [searchParams] = useSearchParams();

  const programType = searchParams.get('type') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: [
      programType.toLowerCase(),
      params.programId,
      'reviews',
      {
        page: searchParams.get('page') || 1,
        size: 10,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  const reviewList = data?.data?.reviewList || [];
  const maxPage = data?.data?.pageInfo?.totalPages || 1;

  const { data: programData } = useQuery({
    queryKey: [programType.toLowerCase(), params.programId, 'title'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  const program = {
    title: programData?.data?.title || '',
  };

  return (
    <div className="p-8">
      <header className="mb-4">
        <Heading>후기 목록 {program && <>- {program.title}</>}</Heading>
      </header>
      <main>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : reviewList.length === 0 ? (
          <div className="py-4 text-center">후기가 없습니다.</div>
        ) : (
          <>
            <Table>
              <TableHead />
              <TableBody reviewList={reviewList} programType={programType} />
            </Table>
            {reviewList.length > 0 && (
              <AdminPagination className="mt-4" maxPage={maxPage} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ReviewsDetail;
