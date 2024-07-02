import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import BottomAction from '../../../components/admin/program/program-user/bottom-action/BottomAction';
import UserTableBody from '../../../components/admin/program/program-user/table-content/TableBody';
import TableHead, {
  UserTableHeadProps,
} from '../../../components/admin/program/program-user/table-content/TableHead';
import Table from '../../../components/admin/ui/table/regacy/Table';
import {
  ChallengeApplication,
  challengeApplicationsSchema,
  LiveApplication,
  liveApplicationsSchema,
} from '../../../schema';
import axios from '../../../utils/axios';

const ProgramUsers = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const [filter, setFilter] = useState<UserTableHeadProps['filter']>({
    name: null,
    isFeeConfirmed: null,
  });

  const programType = searchParams.get('programType') || '';

  const {
    data: challengeApplications = [],
    refetch: refetchChallengeApplications,
  } = useQuery({
    enabled: programType === 'CHALLENGE',
    queryKey: ['challenge', params.programId, 'applications'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/applications`,
      );

      return challengeApplicationsSchema.parse(res.data.data).applicationList;
    },
  });

  const { data: liveApplications = [], refetch: refetchLiveApplications } =
    useQuery({
      enabled: programType === 'LIVE',
      queryKey: ['live', params.programId, 'applications'],
      queryFn: async () => {
        const res = await axios.get(`/live/${params.programId}/applications`);
        return liveApplicationsSchema.parse(res.data.data).applicationList;
      },
    });

  const applications = useMemo<
    (ChallengeApplication | LiveApplication)[]
  >(() => {
    if (programType === 'CHALLENGE') {
      return challengeApplications;
    }
    if (programType === 'LIVE') {
      return liveApplications;
    }
    return [];
  }, [challengeApplications, liveApplications, programType]);

  const filteredApplications = useMemo(() => {
    let result = applications;
    if (filter.name) {
      result = result.sort((a, b) =>
        filter.name === 'ASCENDING'
          ? (a.name ?? '') >= (b.name ?? '')
            ? 1
            : -1
          : filter.name === 'DESCENDING'
            ? (a.name ?? '') <= (b.name ?? '')
              ? 1
              : -1
            : 0,
      );
    }
    if (filter.isFeeConfirmed !== null) {
      result = result.filter(
        (application) => application.isConfirmed === filter.isFeeConfirmed,
      );
    }
    return result;
  }, [applications, filter.isFeeConfirmed, filter.name]);

  const { data: programTitleData } = useQuery({
    queryKey: [programType.toLowerCase(), params.programId, 'title'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );

      return res.data;
    },
  });

  const programTitle = programTitleData?.data?.title;

  useEffect(() => {
    refetchChallengeApplications();
    refetchLiveApplications();
  }, [filter, refetchChallengeApplications, refetchLiveApplications]);

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-1.5-bold">참여자 보기 - {programTitle}</h1>
      </div>
      <main className="mb-20">
        <Table
          minWidth={
            programType === 'LIVE' || programType === 'VOD' ? 2000 : 1000
          }
        >
          <TableHead
            filter={filter}
            setFilter={setFilter}
            programType={programType}
          />
          <UserTableBody
            applications={filteredApplications}
            programType={programType}
          />
        </Table>
      </main>
      <BottomAction
        applications={filteredApplications}
        programType={programType}
        programTitle={programTitle}
      />
    </div>
  );
};

export default ProgramUsers;
