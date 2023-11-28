import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import TD from '../TD';

interface UserTableBodyProps {
  applications: any;
}

const UserTableBody = ({ applications }: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((application: any) => (
        <tr>
          <TD></TD>
          <TD>{application.inflowPath}</TD>
          <TD></TD>
          <TD></TD>
          <TD></TD>
          <TD>{application.grade}</TD>
          <TD></TD>
          <TD>{application.wishJob}</TD>
          <TD>{application.wishCompany}</TD>
          <TD>{application.applyMotive}</TD>
          <TD>
            <FormControl sx={{ width: 100 }}>
              <InputLabel id="type">참가 확정</InputLabel>
              <Select labelId="type" id="type" label="참가 확정">
                <MenuItem value="PUBLIC">대기</MenuItem>
                <MenuItem value="PRIVATE">참가확정</MenuItem>
                <MenuItem value="NOT">미선발</MenuItem>
              </Select>
            </FormControl>
          </TD>
          <TD></TD>
          <TD>{application.preQuestions}</TD>
        </tr>
      ))}
    </tbody>
  );
};

export default UserTableBody;
