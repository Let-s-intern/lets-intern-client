import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';

import ActionButton from '../../../components/admin/ActionButton';
import Table from '../../../components/admin/table/Table';
import TableHead from '../../../components/admin/table/table-content/program-users/TableHead';
import TableBody from '../../../components/admin/table/table-content/program-users/TableBody';
import axios from '../../../utils/axios';
import AdminPagination from '../../../components/admin/AdminPagination';
import BottomDownload from '../../../components/admin/BottomDownload';
import classes from './ProgramUsers.module.scss';

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
      console.log(applicationList);
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
      <div className={classes.top}>
        <h1 className={classes.heading}>참여자 보기 - {[program.title]}</h1>
        {program.type === 'LETS_CHAT' && (
          <div className={classes.buttonGroup}>
            <ActionButton
              to={`/admin/programs/${program.id}/check-attendance`}
              bgColor="blue"
            >
              출석체크
            </ActionButton>
          </div>
        )}
      </div>
      <main className={classes.main}>
        <Table minWidth={2000}>
          <TableHead />
          <TableBody
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
        {applications.length > 0 && (
          <div className={classes.pagination}>
            <AdminPagination maxPage={maxPage} />
          </div>
        )}
      </main>
    </>
  );
};

export default ProgramUsers;
