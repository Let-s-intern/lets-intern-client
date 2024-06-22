import { Checkbox, FormControl, MenuItem, Select } from '@mui/material';

import TD from '../../../ui/table/regacy/TD';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';

export interface DetailTableBodyProps {
  reviewList: {
    id: number;
    name: string;
    nps: number;
    npsAns: string;
    npsCheckAns: boolean;
    content: string;
    score: number;
    createdDate: string;
    isVisible: boolean;
  }[];
  programType: string;
}

const TableBody = ({ reviewList, programType }: DetailTableBodyProps) => {
  const queryClient = useQueryClient();

  const editReviewVisible = useMutation({
    mutationFn: async (params: { reviewId: number; isVisible: boolean }) => {
      const res = await axios.patch(
        `/review/${params.reviewId}/status`,
        {},
        {
          params: {
            isVisible: params.isVisible,
          },
        },
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [programType.toLowerCase()],
      });
    },
  });

  const handleVisibleCheckboxClicked = (
    reviewId: number,
    isVisible: boolean,
  ) => {
    editReviewVisible.mutate({ reviewId, isVisible });
  };

  return (
    <tbody>
      {reviewList.map((review, index) => (
        <tr key={index}>
          <TD>{review.name || '익명'}</TD>
          <TD>{review.nps}</TD>
          <TD whiteSpace="wrap">{review.npsAns}</TD>
          <TD whiteSpace="wrap">{review.npsCheckAns ? 'O' : 'X'}</TD>
          <TD>{review.score}</TD>
          <TD>{review.content}</TD>
          <TD>{dayjs(review.createdDate).format('YYYY년 M월 D일')}</TD>
          <TD>
            <Checkbox
              checked={review.isVisible}
              onChange={() =>
                handleVisibleCheckboxClicked(review.id, !review.isVisible)
              }
            />
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
