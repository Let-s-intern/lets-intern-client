// 챌린지 탭 데이터 — GET /program(카탈로그) + GET /user/applications(참여내역)를 programId로 조인.
import { useMypageApplicationsQuery } from '@/api/application';
import { useGetUserProgramQuery } from '@/api/program';
import { useMemo } from 'react';
import type { PassProgramCardData } from './PassProgramCard';

const CATALOG_PAGE = { page: 1, size: 100 } as const;

export interface UsageChallenge {
  before: PassProgramCardData[];
  inProgress: PassProgramCardData[];
  done: PassProgramCardData[];
  isLoading: boolean;
  isError: boolean;
}

export const useUsageChallenge = (): UsageChallenge => {
  const catalogQuery = useGetUserProgramQuery({
    pageable: CATALOG_PAGE,
    searchParams: { type: 'CHALLENGE' },
  });
  const applicationsQuery = useMypageApplicationsQuery();

  return useMemo(() => {
    const applications = applicationsQuery.data ?? [];
    const challengeApps = applications.filter(
      (a) => a.programType === 'CHALLENGE' && a.programId != null,
    );
    const enrolledIds = new Set(challengeApps.map((a) => a.programId));

    const before: PassProgramCardData[] = (catalogQuery.data?.programList ?? [])
      .filter(
        (p) =>
          !enrolledIds.has(p.programInfo.id) &&
          p.programInfo.programStatusType !== 'POST',
      )
      .map((p) => ({
        programId: p.programInfo.id,
        title: p.programInfo.title ?? '',
        thumbnail: p.programInfo.thumbnail,
        startDate: p.programInfo.startDate,
        endDate: p.programInfo.endDate,
        beginning: p.programInfo.beginning,
        deadline: p.programInfo.deadline,
        programStatusType: p.programInfo.programStatusType,
        participation: 'BEFORE',
      }));

    const fromApplication = (
      a: (typeof challengeApps)[number],
    ): PassProgramCardData => ({
      programId: a.programId as number,
      title: a.programTitle ?? '',
      thumbnail: a.programThumbnail,
      startDate: a.programStartDate ? a.programStartDate.toISOString() : null,
      endDate: a.programEndDate ? a.programEndDate.toISOString() : null,
      participation: a.programStatusType === 'POST' ? 'DONE' : 'IN_PROGRESS',
      applicationId: a.id,
    });

    return {
      before,
      inProgress: challengeApps
        .filter((a) => a.programStatusType !== 'POST')
        .map(fromApplication),
      done: challengeApps
        .filter((a) => a.programStatusType === 'POST')
        .map(fromApplication),
      isLoading: catalogQuery.isLoading || applicationsQuery.isLoading,
      isError: catalogQuery.isError || applicationsQuery.isError,
    };
  }, [
    catalogQuery.data,
    catalogQuery.isLoading,
    catalogQuery.isError,
    applicationsQuery.data,
    applicationsQuery.isLoading,
    applicationsQuery.isError,
  ]);
};
