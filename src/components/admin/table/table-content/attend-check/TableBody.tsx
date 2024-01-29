import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import TD from '../../TD';

interface AttendTableBodyProps {
  program: any;
  applications: any[];
  onAttendCheckChange: (e: any, applicationId: number) => void;
}

const AttendTableBody = (props: AttendTableBodyProps) => {
  return (
    <tbody>
      {props.applications.map((application: any) => (
        <tr>
          <TD>{props.program.title}</TD>
          <TD>{application.application.name}</TD>
          <TD>
            <FormControl sx={{ width: 100 }}>
              <InputLabel id="type">출석상태</InputLabel>
              <Select
                labelId="type"
                id="type"
                label="출석상태"
                value={application.application.attendance}
                onChange={(e) =>
                  props.onAttendCheckChange(e, application.application.id)
                }
              >
                <MenuItem value="ATTENDED">출석</MenuItem>
                <MenuItem value="LATE">지각</MenuItem>
                <MenuItem value="ABSENT">결석</MenuItem>
              </Select>
            </FormControl>
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default AttendTableBody;
