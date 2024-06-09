import { FormControl, MenuItem, Select } from '@mui/material';

import TD from '../../../ui/table/regacy/TD';
import dayjs from 'dayjs';

export interface DetailTableBodyProps {
  reviewList: {
    name: string;
    nps: number;
    npsAns: string;
    npsCheckAns: boolean;
    content: string;
    score: number;
    createdDate: string;
  }[];
}

const TableBody = ({ reviewList }: DetailTableBodyProps) => {
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
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
