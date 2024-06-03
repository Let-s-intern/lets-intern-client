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

  console.log(programType);

  const getApplicationList = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const res = await axios.get(
        `/${programType.toLowerCase()}/${params.programId}/applications`,
      );
      console.log(res.data.data.applicationList);
      setApplications(res.data.data.applicationList);
      return res.data;
    },
  });

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
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  useEffect(() => {
    if (applications) {
      let filteredApplications =
        filter.name === null
          ? applications
          : applications.sort((a: any, b: any) =>
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
              (application) =>
                application.isConfirmed === filter.isFeeConfirmed,
            );
      setApplications(filteredApplications);
    }
  }, [applications]);

  useEffect(() => {
    getApplicationList.refetch();
  }, [filter]);

  // useEffect(() => {
  //   if (getProgram.data) {
  //     setProgram(getProgram.data);
  //   }
  // }, [getProgram]);

  const handleApplicationStatusChange = (e: any, applicationId: number) => {
    const status = e.target.value;
    changeApplicationStatus.mutate({ applicationId, status });
  };

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-1.5-bold">참여자 보기 - {}</h1>
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
            program={program}
            applications={applications}
            handleApplicationStatusChange={handleApplicationStatusChange}
            programType={programType}
          />
        </Table>
      </main>
      {/* <BottomAction applications={applications} program={program} /> */}
    </div>
  );
};

export default ProgramUsers;
