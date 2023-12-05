import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import TD from '../TD';
import parseInflowPath from '../../../libs/parseInflowPath';
import parseGrade from '../../../libs/parseGrade';
import parsePhoneNum from '../../../libs/parsePhoneNum';

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
          <TD>
            {application.application.type === 'USER'
              ? '회원'
              : application.application.type === 'GUEST' && '비회원'}
          </TD>
          <TD>{parseInflowPath(application.application.inflowPath)}</TD>
          <TD>{application.application.email}</TD>
          <TD>{application.application.name}</TD>
          <TD>{application.application.phoneNum}</TD>
          <TD>
            {application.optionalInfo
              ? application.optionalInfo.university
              : ''}
          </TD>
          <TD>{parseGrade(application.application.grade)}</TD>
          <TD>
            {application.optionalInfo ? application.optionalInfo.major : ''}
          </TD>
          <TD>{application.application.wishJob}</TD>
          <TD>{application.application.wishCompany}</TD>
          <TD>{application.application.applyMotive}</TD>
          <TD>
            {application.application.way === 'OFFLINE'
              ? '오프라인'
              : application.application.way === 'ONLINE'
              ? '온라인'
              : ''}
          </TD>
          <TD>
            <FormControl>
              <InputLabel id="status">참가 확정</InputLabel>
              <Select
                labelId="status"
                id="status"
                label="참가 확정"
                name="status"
                value={application.application.status}
                onChange={(e) =>
                  handleApplicationStatusChange(e, application.application.id)
                }
              >
                <MenuItem value="APPLIED">대기</MenuItem>
                <MenuItem value="IN_PROGRESS">참가확정</MenuItem>
                <MenuItem value="APPLIED_NOT_APPROVED">미선발</MenuItem>
              </Select>
            </FormControl>
          </TD>
          <TD>{application.application.createdAt}</TD>
          <TD>{application.application.preQuestions}</TD>
        </tr>
      ))}
    </tbody>
  );
};

export default UserTableBody;
