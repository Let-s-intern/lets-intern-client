import styled from 'styled-components';

import ActionButton from '../ActionButton';
import Table from '../Table';
import UserTableHead from './UserTableHead';
import UserTableBody from './UserTableBody';

interface ProgramUsersProps {
  loading: boolean;
  error: unknown;
  program: any;
  applications: any;
  handleApplicationStatusChange: (e: any, applicationId: number) => void;
}

const ProgramUsers = ({
  loading,
  error,
  program,
  applications,
  handleApplicationStatusChange,
}: ProgramUsersProps) => {
  if (loading) {
    return <></>;
  }

  if (error) {
    return <>에러 발생</>;
  }

  return (
    <>
      <Top>
        <Heading>참여자 보기 - {[program.title]}</Heading>
        {program.type === 'LETS_CHAT' && (
          <ActionButtonGroup>
            <ActionButton
              to="/admin/programs/1/check-attendance"
              bgColor="blue"
            >
              출석체크
            </ActionButton>
          </ActionButtonGroup>
        )}
      </Top>
      <Table>
        <UserTableHead />
        <UserTableBody
          applications={applications}
          handleApplicationStatusChange={handleApplicationStatusChange}
        />
      </Table>
    </>
  );
};

export default ProgramUsers;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
`;
