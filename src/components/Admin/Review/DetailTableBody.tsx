import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import TD from '../TD';

interface DetailTableBodyProps {
  reviewList: any;
  handleVisibleChanged: (reviewId: number, status: string) => void;
}

const DetailTableBody = ({
  reviewList,
  handleVisibleChanged,
}: DetailTableBodyProps) => {
  return (
    <tbody>
      {reviewList.map((review: any) => (
        <tr>
          <TD>{review.username ? review.username : '익명'}</TD>
          <TD>{review.grade}</TD>
          <TD>{review.reviewContents}</TD>
          <TD>{review.suggestContents}</TD>
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
