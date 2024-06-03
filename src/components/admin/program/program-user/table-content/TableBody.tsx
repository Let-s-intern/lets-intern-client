import { ApplicationType } from '../../../../../pages/admin/program/ProgramUsers';
import TableRow from './TableRow';

interface UserTableBodyProps {
  program: any;
  applications: ApplicationType[];
  handleApplicationStatusChange: (e: any, applicationId: number) => void;
  programType: string;
}

const UserTableBody = ({
  program,
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
          program={program}
          handleApplicationStatusChange={handleApplicationStatusChange}
          programType={programType}
        />
      ))}
    </tbody>
  );
};

export default UserTableBody;
