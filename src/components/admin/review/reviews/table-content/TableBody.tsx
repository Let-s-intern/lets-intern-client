import { ReviewType } from '@/schema';
import dayjs from 'dayjs';
import TD from '../../../ui/table/regacy/TD';

interface ReviewTableBodyProps {
  reviewList: ReviewType[];
}

const TableBody = ({ reviewList }: ReviewTableBodyProps) => {
  return (
    <thead>
      {reviewList.map((review) => (
        <tr key={review.id}>
          <TD>{dayjs(review.createdDate).format('YYYY.MM.DD')}</TD>
          <TD>프로그램명</TD>
          <TD>이름</TD>
          <TD>{review.nps}</TD>
          <TD>
            <p className="mx-auto w-full max-w-60 whitespace-pre-wrap break-words text-center">
              {review.npsAns}
            </p>
          </TD>
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
