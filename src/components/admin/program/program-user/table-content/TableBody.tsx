import { ChallengeApplication, LiveApplication } from '../../../../../schema';
import TableRow from './TableRow';

interface UserTableBodyProps {
  applications: (ChallengeApplication | LiveApplication)[];
  programType: string;
}

const UserTableBody = ({ applications, programType }: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((application, index) => (
        <TableRow
          key={index}
          application={application}
          programType={programType}
        />
      ))}
    </tbody>
  );
};

export default UserTableBody;
