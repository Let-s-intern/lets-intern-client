import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import TD from '../TD';

const AttendTableBody = () => {
  return (
    <tbody>
      <tr>
        <TD>챌린지 1기</TD>
        <TD>홍민서</TD>
        <TD>
          <FormControl sx={{ width: 100 }}>
            <InputLabel id="type">참여 확정</InputLabel>
            <Select labelId="type" id="type" label="참여 확정">
              <MenuItem value="ATTENDANCE">출석</MenuItem>
              <MenuItem value="LATE">지각</MenuItem>
              <MenuItem value="ABSENT">결석</MenuItem>
            </Select>
          </FormControl>
        </TD>
      </tr>
    </tbody>
  );
};

export default AttendTableBody;
