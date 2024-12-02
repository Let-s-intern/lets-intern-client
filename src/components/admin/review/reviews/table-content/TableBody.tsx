import { useEditReviewVisible } from '@/api/challenge';
import { ReviewType } from '@/schema';
import { Checkbox } from '@mui/material';
import dayjs from 'dayjs';
import TD from '../../../ui/table/regacy/TD';

interface ReviewTableBodyProps {
  type: string;
  programTitle?: string | null;
  createDate?: string | null;
  reviewList: ReviewType[];
}

const TableBody = ({
  type,
  programTitle,
  createDate,
  reviewList,
}: ReviewTableBodyProps) => {
  const { mutate: editReviewVisible } = useEditReviewVisible();

  const handleVisibleCheckboxClicked = (
    reviewId: number,
    isVisible: boolean,
  ) => {
    editReviewVisible({ reviewId, isVisible, type, programTitle, createDate });
  };

  return (
    <thead>
      {reviewList.map((review) => (
        <tr key={review.id}>
          <TD>{dayjs(review.createdDate).format('YYYY.MM.DD')}</TD>
          <TD>{review.programTitle ?? '프로그램 없음'}</TD>
          <TD>{review.name ?? '-'}</TD>
          <TD>{review.nps}</TD>
          <TD>
            <p className="mx-auto w-full max-w-60 whitespace-pre-wrap break-words text-center">
              {review.npsAns}
            </p>
          </TD>
          <TD>{review.npsCheckAns ? '추천' : '비추천'}</TD>
          <TD>{review.score}</TD>
          <TD>
            <p className="mx-auto w-full max-w-60 whitespace-pre-wrap break-words text-center">
              {review.content}
            </p>
          </TD>
          <TD>
            <Checkbox
              checked={review.isVisible ?? false}
              onChange={() =>
                handleVisibleCheckboxClicked(review.id, !review.isVisible)
              }
            />
          </TD>
        </tr>
      ))}
    </thead>
  );
};

export default TableBody;
