import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import TD from '../../../ui/table/TD';
import parseInflowPath from '../../../../../utils/parseInflowPath';
import parseGrade from '../../../../../utils/parseGrade';
import { bankTypeToText, wishJobToText } from '../../../../../utils/convert';
import axios from '../../../../../utils/axios';
import TableRow from './TableRow';

interface UserTableBodyProps {
  program: any;
  applications: any[];
  handleApplicationStatusChange: (e: any, applicationId: number) => void;
}

const UserTableBody = ({
  program,
  applications,
  handleApplicationStatusChange,
}: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((application: any) => (
        <TableRow
          key={application.application.id}
          application={application}
          program={program}
          handleApplicationStatusChange={handleApplicationStatusChange}
        />
      ))}
    </tbody>
  );
};

export default UserTableBody;
