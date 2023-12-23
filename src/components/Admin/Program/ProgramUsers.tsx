import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import ActionButton from '../ActionButton';
import Table from '../Table';
import UserTableHead from './UserTableHead';
import UserTableBody from './UserTableBody';
import axios from '../../../libs/axios';
import AdminPagination from '../AdminPagination';

import './ProgramUsers.scss';

const ProgramUsers = () => {
  const params = useParams();
  const [searchParams, _] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [program, setProgram] = useState<any>({});
  const [applications, setApplications] = useState<any>([]);

  const sizePerPage = 10;

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axios.get(`/program/admin/${params.programId}`);
        setProgram(res.data);
      } catch (err) {
        setError(err);
      }
    };
    const fetchProgramUsers = async () => {
      const currentPage = searchParams.get('page');
      const pageParams = {
        page: currentPage,
        size: sizePerPage,
      };
      try {
        const res = await axios.get(`/application/admin/${params.programId}`, {
          params: pageParams,
        });
        setApplications(res.data.applicationList);
      } catch (err) {
        setError(err);
      }
    };
    fetchProgram();
    fetchProgramUsers();
    setLoading(false);
  }, [params, searchParams]);

  const handleApplicationStatusChange = async (
    e: any,
    applicationId: number,
  ) => {
    try {
      await axios.patch(`/application/${applicationId}`, {
        status: e.target.value,
        isApproved: e.target.value === 'IN_PROGRESS',
      });
      const res = await axios.get(`/application/admin/${params.programId}`);
      console.log(res.data.applicationList);
      setApplications(res.data.applicationList);
    } catch (err) {
      alert('참여 상태 변경에 실패했습니다.');
    }
  };

  const handleEmailListDownload = (fileName: string, fileContent: string) => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEmailSend = async (isApproved: boolean) => {
    const emailList = isApproved
      ? applications
          .filter(
            (application: any) =>
              application.application.status === 'IN_PROGRESS',
          )
          .map((application: any) => application.application.email)
      : applications
          .filter(
            (application: any) =>
              application.application.status === 'APPLIED_NOT_APPROVED',
          )
          .map((application: any) => application.application.email);
    const subject =
      (isApproved ? '참가확정 이메일 목록' : '미선발 이메일 목록') +
      ' - ' +
      program.title;
    const emailString = subject + '\n' + emailList.join('\n');
    handleEmailListDownload(subject + '.txt', emailString);
  };

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
      <main className="program-users-main">
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
            onClick={() => handleEmailSend(true)}
          >
            참가확정 이메일 보내기
          </EmailActionButton>
          <EmailActionButton
            width="13rem"
            bgColor="red"
            onClick={() => handleEmailSend(false)}
          >
            미선발 이메일 보내기
          </EmailActionButton>
        </EmailActionArea>
        <div className="bottom">
          <AdminPagination maxPage={10} />
        </div>
      </main>
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
