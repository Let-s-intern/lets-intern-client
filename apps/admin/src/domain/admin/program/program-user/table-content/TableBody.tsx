import {
  ChallengeApplication,
  GuidebookApplication,
  LiveApplication,
  ProgramTypeUpperCase,
  VodApplication,
} from '@/schema';
import { RefundTarget } from '../ui/RefundModal';
import TableRow from './TableRow';

interface UserTableBodyProps {
  applications: (
    | ChallengeApplication
    | LiveApplication
    | GuidebookApplication
    | VodApplication
  )[];
  programType: ProgramTypeUpperCase;
  programTitle: string;
  /** 어드민 환불로 취소된 신청서 id. 유저 환불과 라벨을 구분하는 데 쓴다. */
  adminRefundedIds: Set<number>;
  onRefundClick: (target: RefundTarget) => void;
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

const UserTableBody = ({
  applications,
  programType,
  programTitle,
  adminRefundedIds,
  onRefundClick,
}: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((item) => (
        <TableRow
          key={getRowKey(item, programType)}
          applicationItem={item}
          programType={programType}
          programTitle={programTitle}
          adminRefundedIds={adminRefundedIds}
          onRefundClick={onRefundClick}
        />
      ))}
    </tbody>
  );
};

export default UserTableBody;
