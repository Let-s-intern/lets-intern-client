import { FormControl, MenuItem, Select } from '@mui/material';

import TD from '../../../ui/table/regacy/TD';

export interface DetailTableBodyProps {
  reviewList: {
    id: number;
    userName: string;
    grade: number;
    reviewContents: string;
    suggestContents: string;
    createdAt: string;
    status: string;
  }[];
  handleVisibleChanged: (reviewId: number, status: string) => void;
}

const DetailTableBody = ({
  reviewList,
  handleVisibleChanged,
}: DetailTableBodyProps) => {
  return (
    <tbody>
      {reviewList.map((review) => (
        <tr key={review.id}>
          <TD>{review.userName ? '회원' : '비회원'}</TD>
          <TD>{review.userName ? review.userName : '익명'}</TD>
          <TD>{review.grade}</TD>
          <TD whiteSpace="wrap">{review.reviewContents}</TD>
          <TD whiteSpace="wrap">{review.suggestContents}</TD>
          <TD>{review.createdAt}</TD>
          <TD>
            <FormControl sx={{ width: 100 }}>
              <Select
                labelId="status"
                id="status"
                name="status"
                value={review.status}
                onChange={(e) =>
                  handleVisibleChanged(review.id, e.target.value)
                }
              >
                <MenuItem value="VISIBLE">노출</MenuItem>
                <MenuItem value="INVISIBLE">비노출</MenuItem>
              </Select>
            </FormControl>
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default DetailTableBody;
