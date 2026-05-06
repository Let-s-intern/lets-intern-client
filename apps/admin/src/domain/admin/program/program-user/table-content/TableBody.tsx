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

const getRowKey = (
  item:
    | ChallengeApplication
    | LiveApplication
    | GuidebookApplication
    | VodApplication,
  programType: ProgramTypeUpperCase,
): number => {
  if (programType === 'CHALLENGE') {
    return (item as ChallengeApplication).application.id;
  }
  return (item as LiveApplication | GuidebookApplication | VodApplication).id;
};

const UserTableBody = ({ applications, programType }: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((item) => (
        <TableRow
          key={getRowKey(item, programType)}
          applicationItem={item}
          programType={programType}
        />
      ))}
    </tbody>
  );
};

export default UserTableBody;
