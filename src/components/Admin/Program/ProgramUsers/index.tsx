import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import ActionButton from '../../ActionButton';
import Table from '../../Table';
import UserTableHead from './UserTableHead';
import UserTableBody from './UserTableBody';
import axios from '../../../../utils/axios';
import AdminPagination from '../../AdminPagination';
import BottomDownload from './BottomDownload';

import './styles.scss';

const ProgramUsers = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [program, setProgram] = useState<any>({});
  const [applications, setApplications] = useState<any>([]);
  const [maxPage, setMaxPage] = useState(1);

  const pageParams = {
    page: Number(searchParams.get('page') || 1),
    size: 10,
  };

  const programQuery = useQuery({
    queryKey: ['program', params.programId],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/program/admin/${queryKey[1]}`);
      setProgram(res.data);
      return res.data;
    },
  });

  const applicationsQuery = useQuery({
    queryKey: [
      'applications',
      'program',
      params.programId,
      { page: pageParams.page },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/application/admin/${queryKey[2]}`, {
        params: pageParams,
      });
      const { applicationList, pageInfo } = res.data;
      setApplications(applicationList);
      setMaxPage(pageInfo.totalPages);
      return res.data;
    },
  });

  useEffect(() => {
    if (applicationsQuery.isLoading || programQuery.isLoading) {
      return;
    }
    if (applicationsQuery.isError) {
      setError(applicationsQuery.error);
    } else if (programQuery.isError) {
      setError(programQuery.error);
    }
    setLoading(false);
  }, [applicationsQuery, programQuery]);

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
        <BottomDownload
          program={program}
          sizePerPage={pageParams.size}
          maxPage={maxPage}
        />
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
