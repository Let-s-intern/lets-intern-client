import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';

import { useGetTotalReview } from '@/api/challenge';
import TableBody from '@/components/admin/review/reviews/table-content/TableBody';
import TableHead, {
  ReviewsTableHeadProps,
} from '@/components/admin/review/reviews/table-content/TableHead';
import Table from '@/components/admin/ui/table/regacy/Table';
import { ProgramTypeUpperCase } from '@/schema';
import ChallengeReviewTable from '@components/admin/review/reviews/ChallengeReviewTable';

const Reviews = () => {
  const [type, setType] = useState<ProgramTypeUpperCase>('CHALLENGE');
  const [filter, setFilter] = useState<ReviewsTableHeadProps['filter']>({
    programTitle: null,
    createdDate: null,
  });

  const { data, isLoading, error } = useGetTotalReview({
    type,
    programTitle: filter.programTitle,
    createdDate: filter.createdDate,
  });

  return (
    <div className="p-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-1.5-bold">후기 관리</h1>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as ProgramTypeUpperCase)}
          className="mb-4"
        >
          <MenuItem value="CHALLENGE">챌린지</MenuItem>
          <MenuItem value="LIVE">라이브</MenuItem>
          <MenuItem value="VOD">VOD</MenuItem>
          <MenuItem value="REPORT">리포트</MenuItem>
        </Select>
      </header>
      <main>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : !data || data.reviewList?.length === 0 ? (
          <div className="py-4 text-center">후기가 없습니다.</div>
        ) : type === 'CHALLENGE' ? (
          <ChallengeReviewTable
            type={type}
            reviewList={data.reviewList ?? []}
          />
        ) : (
          <Table minWidth={1000}>
            <TableHead type={type} filter={filter} setFilter={setFilter} />
            <TableBody
              type={type}
              programTitle={filter.programTitle}
              createDate={filter.createdDate}
              reviewList={data.reviewList ?? []}
            />
          </Table>
        )}
      </main>
    </div>
  );
};

export default Reviews;
