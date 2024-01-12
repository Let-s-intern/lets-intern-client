import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import ActionButton from '../ActionButton';
import Table from '../Table';
import UserTableHead from './UserTableHead';
import UserTableBody from './UserTableBody';
import axios from '../../../utils/axios';
import AdminPagination from '../AdminPagination';

import './ProgramUsers.scss';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const ProgramUsers = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [program, setProgram] = useState<any>({});
  const [applications, setApplications] = useState<any>([]);
  const [maxPage, setMaxPage] = useState(1);

  const sizePerPage = 10;

  const applicationQuery = useQuery({
    queryKey: [
      'applications',
      'programs',
      params.programId,
      { page: searchParams.get('page') },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/application/admin/${queryKey[2]}`, {
        params: {
          page: queryKey[3],
          size: sizePerPage,
        },
      });
      return res.data;
    },
  });

  const programQuery = useQuery({
    queryKey: ['programs', params.programId],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/program/admin/${queryKey[1]}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (!applicationQuery || !programQuery) {
      return;
    }
    if (applicationQuery.isError) {
      setError(applicationQuery.error);
      setLoading(false);
      return;
    }
    if (programQuery.isError) {
      setError(programQuery.error);
      setLoading(false);
      return;
    }
    const { applicationList, pageInfo } = applicationQuery.data;
    setApplications(applicationList);
    setMaxPage(pageInfo.totalPages);
    setProgram(programQuery);
    setLoading(false);
  }, [applicationQuery]);

  const handleApplicationStatusChange = async (
    e: any,
    applicationId: number,
  ) => {
    try {
      await axios.patch(`/application/${applicationId}`, {
        status: e.target.value,
        isApproved: e.target.value === 'IN_PROGRESS',
      });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    } catch (err) {
      console.log(err);
      alert('참여 상태 변경에 실패했습니다.');
    }
  };

  const downloadFile = (fileName: string, fileContent: string) => {
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

  const handleDownloadList = async (
    isApproved: boolean,
    column: 'EMAIL' | 'PHONE',
  ) => {
    let allApplications: any[] = [];
    for (let pageNum = 1; pageNum <= maxPage; pageNum++) {
      const res = await axios.get(`/application/admin/${params.programId}`, {
        params: {
          page: pageNum,
          size: sizePerPage,
        },
      });
      allApplications = [...allApplications, ...res.data.applicationList];
    }
    const emailList = isApproved
      ? allApplications
          .filter(
            (application: any) =>
              application.application.status === 'IN_PROGRESS',
          )
          .map((application: any) => {
            if (column === 'EMAIL') {
              return application.application.email;
            }
            return application.application.phoneNum;
          })
      : allApplications
          .filter(
            (application: any) =>
              application.application.status === 'APPLIED_NOT_APPROVED',
          )
          .map((application: any) => {
            if (column === 'EMAIL') {
              return application.application.email;
            }
            return application.application.phoneNum;
          });
    const label =
      column === 'EMAIL' ? '이메일' : column === 'PHONE' && '전화번호';
    const subject =
      (isApproved ? `참가확정 ${label} 목록` : `미선발 ${label} 목록`) +
      ' - ' +
      program.title;
    const emailString = subject + '\n' + emailList.join('\n');
    downloadFile(subject + '.txt', emailString);
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
            program={program}
            applications={applications}
            handleApplicationStatusChange={handleApplicationStatusChange}
          />
        </Table>
        <ActionArea>
          <ActionButton
            width="10rem"
            bgColor="green"
            onClick={() => handleDownloadList(true, 'EMAIL')}
          >
            참가확정 이메일
          </ActionButton>
          <ActionButton
            width="10rem"
            bgColor="red"
            onClick={() => handleDownloadList(false, 'EMAIL')}
          >
            미선발 이메일
          </ActionButton>
          <ActionButton
            width="10rem"
            bgColor="green"
            onClick={() => handleDownloadList(true, 'PHONE')}
          >
            참가확정 전화번호
          </ActionButton>
          <ActionButton
            width="10rem"
            bgColor="red"
            onClick={() => handleDownloadList(false, 'PHONE')}
          >
            미선발 전화번호
          </ActionButton>
        </ActionArea>
        {applications.length > 0 && <AdminPagination maxPage={maxPage} />}
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

const ActionArea = styled.div`
  width: calc(100vw - 250px);
  position: fixed;
  bottom: 3rem;
  left: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
