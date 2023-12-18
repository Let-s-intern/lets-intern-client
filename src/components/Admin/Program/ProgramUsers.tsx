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
  onEmailSend: (isApproved: boolean) => void;
}

const ProgramUsers = ({
  loading,
  error,
  program,
  applications,
  handleApplicationStatusChange,
  onEmailSend,
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
              to={`/admin/programs/${program.id}/check-attendance`}
              bgColor="blue"
            >
              출석체크
            </ActionButton>
          </ActionButtonGroup>
        )}
      </Top>
      <Table minWidth={2000}>
        <UserTableHead />
        <UserTableBody
          applications={applications}
          handleApplicationStatusChange={handleApplicationStatusChange}
        />
      </Table>
      <EmailActionArea>
        <EmailActionButton
          width="13rem"
          bgColor="green"
          onClick={() => onEmailSend(true)}
        >
          참가확정 이메일 보내기
        </EmailActionButton>
        <EmailActionButton
          width="13rem"
          bgColor="red"
          onClick={() => onEmailSend(false)}
        >
          미선발 이메일 보내기
        </EmailActionButton>
      </EmailActionArea>
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

const EmailActionArea = styled.div`
  width: calc(100vw - 250px);
  position: fixed;
  bottom: 3rem;
  left: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const EmailActionButton = styled(ActionButton)``;
