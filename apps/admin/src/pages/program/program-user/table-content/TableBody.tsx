import {
  ChallengeApplication,
  GuidebookApplication,
  LiveApplication,
  ProgramTypeUpperCase,
  VodApplication,
} from '@/schema';
import TableRow from './TableRow';

interface UserTableBodyProps {
  applications: (
    | ChallengeApplication
    | LiveApplication
    | GuidebookApplication
    | VodApplication
  )[];
  programType: ProgramTypeUpperCase;
}

const UserTableBody = ({ applications, programType }: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((item, index) => (
        <TableRow
          key={index}
          applicationItem={item}
          programType={programType}
        />
      ))}
    </tbody>
  );
};

export default UserTableBody;
