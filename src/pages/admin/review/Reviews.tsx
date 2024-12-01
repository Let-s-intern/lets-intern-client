import { useGetTotalReview } from '@/api/challenge';
import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import TableBody from '../../../components/admin/review/reviews/table-content/TableBody';
import TableHead from '../../../components/admin/review/reviews/table-content/TableHead';
import Table from '../../../components/admin/ui/table/regacy/Table';

const Reviews = () => {
  const [type, setType] = useState<'CHALLENGE' | 'LIVE' | 'REPORT' | 'VOD'>(
    'CHALLENGE',
  );

  const { data, isLoading, error } = useGetTotalReview(type);

  return (
    <div className="p-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-1.5-bold">후기 관리</h1>
        <Select
          value={type}
          onChange={(e) =>
            setType(e.target.value as 'CHALLENGE' | 'LIVE' | 'REPORT' | 'VOD')
          }
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
        ) : !data || data.reviewList.length === 0 ? (
          <div className="py-4 text-center">후기가 없습니다.</div>
        ) : (
          <>
            <Table minWidth={1000}>
              <TableHead />
              <TableBody reviewList={data.reviewList} />
            </Table>
          </>
        )}
      </main>
    </div>
  );
};

export default Reviews;
