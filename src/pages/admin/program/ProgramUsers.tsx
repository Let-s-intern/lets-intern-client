import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';

import ActionButton from '../../../components/admin/ui/button/ActionButton';
import Table from '../../../components/admin/ui/table/regacy/Table';
import TableHead, {
  UserTableHeadProps,
} from '../../../components/admin/program/program-user/table-content/TableHead';
import TableBody from '../../../components/admin/program/program-user/table-content/TableBody';
import axios from '../../../utils/axios';
import BottomAction from '../../../components/admin/program/program-user/bottom-action/BottomAction';
import MentorDropdown from '../../../components/admin/program/program-user/top-action/MentorDropdown';

const ProgramUsers = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [program, setProgram] = useState<any>({});
  const [applications, setApplications] = useState<any>([]);
  const [maxPage, setMaxPage] = useState(1);
  const [filter, setFilter] = useState<UserTableHeadProps['filter']>({
    name: null,
    isFeeConfirmed: null,
  });

  const pageParams = {
    page: Number(searchParams.get('page') || 1),
    size: 10000,
  };

  const getProgram = useQuery({
    queryKey: ['program', params.programId],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/program/admin/${queryKey[1]}`);
      return res.data;
    },
  });

  const getApplicationList = useQuery({
    queryKey: ['applications', 'admin', params.programId, pageParams],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/application/admin/${params.programId}`, {
        params: queryKey[3],
      });
      return res.data;
    },
  });

  const changeApplicationStatus = useMutation({
    mutationFn: async (params: { applicationId: number; status: string }) => {
      const res = await axios.patch(
        `/application/admin/${params.applicationId}`,
        {
          status: params.status,
          isApproved: params.status === 'IN_PROGRESS',
        },
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  useEffect(() => {
    if (getApplicationList.data) {
      const { applicationList, pageInfo } = getApplicationList.data;
      setMaxPage(pageInfo.totalPages);
      let filteredApplications =
        filter.name === null
          ? applicationList
          : applicationList.sort((a: any, b: any) =>
              filter.name === 'ASCENDING'
                ? a.application.name >= b.application.name
                  ? 1
                  : -1
                : filter.name === 'DESCENDING' &&
                  a.application.name <= b.application.name
                ? 1
                : -1,
            );
      filteredApplications =
        filter.isFeeConfirmed === null
          ? filteredApplications
          : filteredApplications.filter(
              (application: any) =>
                application.application.feeIsConfirmed ===
                filter.isFeeConfirmed,
            );
      setApplications(filteredApplications);
    }
  }, [getApplicationList]);

  useEffect(() => {
    getApplicationList.refetch();
  }, [filter]);

  useEffect(() => {
    if (getProgram.data) {
      setProgram(getProgram.data);
    }
  }, [getProgram]);

  const handleApplicationStatusChange = (e: any, applicationId: number) => {
    const status = e.target.value;
    changeApplicationStatus.mutate({ applicationId, status });
  };

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-1.5-bold">참여자 보기 - {[program.title]}</h1>
        {program.type === 'LETS_CHAT' && (
          <div className="flex gap-2">
            <MentorDropdown program={program} />
            <ActionButton
              to={`/admin/programs/${program.id}/check-attendance`}
              bgColor="blue"
            >
              출석체크
            </ActionButton>
          </div>
        )}
      </div>
      <main className="mb-20">
        <Table minWidth={3000}>
          <TableHead filter={filter} setFilter={setFilter} />
          <TableBody
            program={program}
            applications={applications}
            handleApplicationStatusChange={handleApplicationStatusChange}
          />
        </Table>
      </main>
      <BottomAction
        applications={applications}
        program={program}
        sizePerPage={pageParams.size}
        maxPage={maxPage}
      />
    </div>
  );
};

export default ProgramUsers;
