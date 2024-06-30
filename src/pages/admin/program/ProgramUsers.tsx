import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import BottomAction from '../../../components/admin/program/program-user/bottom-action/BottomAction';
import TableBody from '../../../components/admin/program/program-user/table-content/TableBody';
import TableHead, {
  UserTableHeadProps,
} from '../../../components/admin/program/program-user/table-content/TableHead';
import Table from '../../../components/admin/ui/table/regacy/Table';
import axios from '../../../utils/axios';

export interface ApplicationType {
  couponName: string;
  created_date: string;
  createDate: string;
  email: string;
  grade: string;
  inflowPath: string;
  isConfirmed: boolean;
  major: string;
  name: string;
  paymentId: number;
  phoneNum: string;
  totalCost: number;
  university: string;
  wishCompany: string;
  wishJob: string;
  motivate: string;
  question: string;
}

const ProgramUsers = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const queryClient = useQueryClient();

  const [program, setProgram] = useState<any>();
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [filter, setFilter] = useState<UserTableHeadProps['filter']>({
    name: null,
    isFeeConfirmed: null,
  });

  const programType = searchParams.get('programType') || '';

  const getApplicationList = useQuery({
    queryKey: [programType.toLowerCase(), params.programId, 'applications'],
    queryFn: async () => {
      const res = await axios.get(
        `/${programType.toLowerCase()}/${params.programId}/applications`,
      );
      let filteredApplications =
        filter.name === null
          ? res.data.data.applicationList
          : res.data.data.applicationList.sort(
              (a: ApplicationType, b: ApplicationType) =>
                filter.name === 'ASCENDING'
                  ? a.name >= b.name
                    ? 1
                    : -1
                  : filter.name === 'DESCENDING' && a.name <= b.name
                    ? 1
                    : -1,
            );
      filteredApplications =
        filter.isFeeConfirmed === null
          ? filteredApplications
          : filteredApplications.filter(
              (application: ApplicationType) =>
                application.isConfirmed === filter.isFeeConfirmed,
            );
      setApplications(filteredApplications);
      return res.data;
    },
  });

  const { data: programTitleData } = useQuery({
    queryKey: [programType.toLowerCase(), params.programId, 'title'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      setProgram(res.data.data.program);
      return res.data;
    },
  });

  const programTitle = programTitleData?.data?.title;

  // const getProgram = useQuery({
  //   queryKey: ['program', params.programId],
  //   queryFn: async ({ queryKey }) => {
  //     const res = await axios.get(`/program/admin/${queryKey[1]}`);
  //     return res.data;
  //   },
  // });

  // const getApplicationList = useQuery({
  //   queryKey: ['applications', 'admin', params.programId],
  //   queryFn: async ({ queryKey }) => {
  //     const res = await axios.get(`/application/admin/${params.programId}`, {
  //       params: queryKey[3],
  //     });
  //     return res.data;
  //   },
  // });

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
      await queryClient.invalidateQueries({
        queryKey: [programType.toLowerCase()],
      });
    },
  });

  useEffect(() => {
    getApplicationList.refetch();
  }, [filter]);

  const handleApplicationStatusChange = (e: any, applicationId: number) => {
    const status = e.target.value;
    changeApplicationStatus.mutate({ applicationId, status });
  };

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-1.5-bold">참여자 보기 - {programTitle}</h1>
        {/* {program.type === 'LETS_CHAT' && (
          <div className="flex gap-2">
            <MentorDropdown program={program} />
            <ActionButton
              to={`/admin/programs/${program.id}/check-attendance`}
              bgColor="blue"
            >
              출석체크
            </ActionButton>
          </div>
        )} */}
      </div>
      <main className="mb-20">
        <Table
          minWidth={
            programType === 'LIVE' || programType === 'VOD' ? 2000 : 1000
          }
        >
          <TableHead
            program={program}
            filter={filter}
            setFilter={setFilter}
            programType={programType}
          />
          <TableBody
            applications={applications}
            handleApplicationStatusChange={handleApplicationStatusChange}
            programType={programType}
          />
        </Table>
      </main>
      <BottomAction
        applications={applications}
        programType={programType}
        programTitle={programTitle}
      />
    </div>
  );
};

export default ProgramUsers;
