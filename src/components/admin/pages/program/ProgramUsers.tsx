import BottomAction from '@/components/admin/program/program-user/bottom-action/BottomAction';
import UserTableBody from '@/components/admin/program/program-user/table-content/TableBody';
import TableHead, {
  UserTableHeadProps,
} from '@/components/admin/program/program-user/table-content/TableHead';
import Table from '@/components/admin/ui/table/regacy/Table';
import {
  adminMentorInfoSchema,
  ChallengeApplication,
  challengeApplicationsSchema,
  LiveApplication,
  liveApplicationsSchema,
  ProgramTypeEnum,
  ProgramTypeUpperCase,
} from '@/schema';
import axios from '@/utils/axios';
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const { CHALLENGE, LIVE, VOD } = ProgramTypeEnum.enum;

const ProgramUsers = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const programId = Number(params.programId);

  const [filter, setFilter] = useState<UserTableHeadProps['filter']>({
    name: null,
    isFeeConfirmed: null,
  });

  const programType = searchParams.get('programType') ?? CHALLENGE;

  const {
    data: challengeApplications = [],
    refetch: refetchChallengeApplications,
  } = useQuery({
    enabled: programType === CHALLENGE,
    queryKey: ['challenge', programId, 'applications'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${programId}/applications`);
      const list = challengeApplicationsSchema.parse(
        res.data.data,
      ).applicationList;
      list.sort((a, b) => {
        return a.application.isCanceled === b.application.isCanceled
          ? 0
          : a.application.isCanceled
            ? -1
            : 1;
      });
      return list;
    },
  });

  const { data: liveApplications = [], refetch: refetchLiveApplications } =
    useQuery({
      enabled: programType === LIVE,
      queryKey: ['live', programId, 'applications'],
      queryFn: async () => {
        const res = await axios.get(`/live/${programId}/applications`);
        const list = liveApplicationsSchema.parse(
          res.data.data,
        ).applicationList;
        list.sort((a, b) => {
          return a.isCanceled === b.isCanceled ? 0 : a.isCanceled ? -1 : 1;
        });
        return list;
      },
    });

  const applicationList = useMemo<
    (ChallengeApplication | LiveApplication)[]
  >(() => {
    if (programType === CHALLENGE) {
      return challengeApplications;
    }
    if (programType === LIVE) {
      return liveApplications;
    }
    return [];
  }, [challengeApplications, liveApplications, programType]);

  const filteredApplicationList = useMemo(() => {
    const result = applicationList;

    const compareChallengeAppName = (
      a: ChallengeApplication,
      b: ChallengeApplication,
    ) =>
      filter.name === 'ASCENDING'
        ? (a.application.name ?? '') >= (b.application.name ?? '')
          ? 1
          : -1
        : filter.name === 'DESCENDING'
          ? (a.application.name ?? '') <= (b.application.name ?? '')
            ? 1
            : -1
          : 0;
    const compareLiveAppName = (a: LiveApplication, b: LiveApplication) =>
      filter.name === 'ASCENDING'
        ? (a.name ?? '') >= (b.name ?? '')
          ? 1
          : -1
        : filter.name === 'DESCENDING'
          ? (a.name ?? '') <= (b.name ?? '')
            ? 1
            : -1
          : 0;

    if (filter.name && programType === CHALLENGE) {
      (result as ChallengeApplication[]).sort(compareChallengeAppName);

      if (filter.name && programType !== CHALLENGE) {
        (result as LiveApplication[]).sort(compareLiveAppName);
      }
    }

    if (!filter.isFeeConfirmed) return result;

    if (programType === CHALLENGE) {
      return (result as ChallengeApplication[]).filter(
        (item) => item.application.isCanceled === filter.isFeeConfirmed,
      );
    }

    return (result as LiveApplication[]).filter(
      (application) => application.isCanceled === filter.isFeeConfirmed,
    );
  }, [applicationList, filter.isFeeConfirmed, filter.name, programType]);

  const filteredApplications =
    programType === CHALLENGE
      ? (filteredApplicationList as ChallengeApplication[]).map(
          (item) => item.application,
        )
      : (filteredApplicationList as LiveApplication[]);

  const { data: programTitleData } = useQuery({
    queryKey: [programType.toLowerCase(), programId, 'title'],
    queryFn: async () => {
      const res = await axios.get(
        `/${programType.toLowerCase()}/${programId}/title`,
      );

      return res.data;
    },
  });

  const { data: mentorInfo = {} } = useQuery({
    enabled: programType === 'LIVE' && !!programId,
    queryKey: [programType.toLowerCase(), programId, 'mentorPassword'],
    queryFn: async () => {
      const res = await axios.get(`/live/${programId}/mentor`);
      return adminMentorInfoSchema.parse(res.data.data);
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
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            onClick={() => {
              navigator.clipboard
                .writeText(
                  `${window.location.origin}/live/${programId}/mentor/notification/before?code=${mentorInfo?.mentorPassword}`,
                )
                .then(() => {
                  alert('링크가 클립보드에 복사되었습니다.');
                })
                .catch(() => {
                  alert('복사에 실패했습니다');
                });
            }}
          >
            클래스 전 안내사항
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              navigator.clipboard
                .writeText(
                  `${window.location.origin}/live/${programId}/mentor/notification/after?code=${mentorInfo?.mentorPassword}`,
                )
                .then(() => alert('링크가 클립보드에 복사되었습니다.'))
                .catch(() => alert('복사에 실패했습니다'));
            }}
          >
            클래스 후 안내사항
          </Button>
        </div>
      </div>

      <main className="mb-20">
        <Table
          minWidth={programType === LIVE || programType === VOD ? 2000 : 1000}
        >
          <TableHead
            filter={filter}
            setFilter={setFilter}
            programType={programType as ProgramTypeUpperCase}
          />
          <UserTableBody
            applications={filteredApplicationList}
            programType={programType as ProgramTypeUpperCase}
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
