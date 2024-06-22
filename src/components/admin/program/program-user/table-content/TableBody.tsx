import { ApplicationType } from '../../../../../pages/admin/program/ProgramUsers';
import TableRow from './TableRow';

interface UserTableBodyProps {
  applications: ApplicationType[];
  handleApplicationStatusChange: (e: any, applicationId: number) => void;
  programType: string;
}

const UserTableBody = ({
  applications,
  handleApplicationStatusChange,
  programType,
}: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((application, index) => (
        <TableRow
          key={index}
          application={application}
          handleApplicationStatusChange={handleApplicationStatusChange}
          programType={programType}
        />
      ))}
    </tbody>
  );
};

export default UserTableBody;
