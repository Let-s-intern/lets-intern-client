import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import TD from '../TD';
import parseInflowPath from '../../../libs/parseInflowPath';
import parseGrade from '../../../libs/parseGrade';

interface UserTableBodyProps {
  applications: any[];
  handleApplicationStatusChange: (e: any, applicationId: number) => void;
}

const UserTableBody = ({
  applications,
  handleApplicationStatusChange,
}: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((application: any) => (
        <tr>
          <TD></TD>
          <TD>{parseInflowPath(application.inflowPath)}</TD>
          <TD></TD>
          <TD></TD>
          <TD></TD>
          <TD>{parseGrade(application.grade)}</TD>
          <TD></TD>
          <TD>{application.wishJob}</TD>
          <TD>{application.wishCompany}</TD>
          <TD>{application.applyMotive}</TD>
          <TD>
            <FormControl>
              <InputLabel id="status">참가 확정</InputLabel>
              <Select
                labelId="status"
                id="status"
                label="참가 확정"
                name="status"
                value={application.status}
                onChange={(e) =>
                  handleApplicationStatusChange(e, application.id)
                }
              >
                <MenuItem value="APPLIED">대기</MenuItem>
                <MenuItem value="IN_PROGRESS">참가확정</MenuItem>
                <MenuItem value="APPLIED_NOT_APPROVED">미선발</MenuItem>
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
