import { ReviewType } from '@/schema';
import TD from '../../../ui/table/regacy/TD';

interface ReviewTableBodyProps {
  reviewList: ReviewType[];
}

const TableBody = ({ reviewList }: ReviewTableBodyProps) => {
  return (
    <thead>
      {reviewList.map((review) => (
        <tr key={review.id}>
          <TD whiteSpace="wrap">{review.createdDate}</TD>
          <TD>프로그램명</TD>
          <TD>이름</TD>
          <TD>{review.nps}</TD>
          <TD>{review.npsAns}</TD>
          <TD>{review.npsCheckAns ? '추천' : '비추천'}</TD>
          <TD>{review.score}</TD>
          <TD>{review.content}</TD>
          <TD>노출여부</TD>
        </tr>
      ))}
    </thead>
  );
};

export default TableBody;
