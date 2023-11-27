import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TD from '../TD';

const DetailTableBody = () => {
  return (
    <tbody>
      <tr>
        <TD>1기</TD>
        <TD>홍민서</TD>
        <TD>5</TD>
        <TD>배고파요. 근데 냉장고에 뭐가 없어요.</TD>
        <TD>누가 사다 주세요</TD>
        <TD>2023-11-24</TD>
        <TD>
          <FormControl sx={{ width: 100 }}>
            <InputLabel id="type">노출</InputLabel>
            <Select labelId="type" id="type" label="노출">
              <MenuItem value="PUBLIC">노출</MenuItem>
              <MenuItem value="PRIVATE">비노출</MenuItem>
            </Select>
          </FormControl>
        </TD>
      </tr>
    </tbody>
  );
};

export default DetailTableBody;
