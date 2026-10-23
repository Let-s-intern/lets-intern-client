// 챌린지/라이브 공통 — GET /program(카탈로그) + GET /user/applications(참여내역)를 programId로 조인해 참여 전/중/완료.
import { useMypageApplicationsQuery } from '@/api/application';
import { useGetUserProgramQuery } from '@/api/program';
import dayjs from '@/lib/dayjs';
import { useMemo } from 'react';
import type { PassProgramCardData } from './PassProgramCard';

type UsageProgramType = 'CHALLENGE' | 'LIVE';

const CATALOG_PAGE = { page: 1, size: 100 } as const;

export interface UsageProgramSections {
  before: PassProgramCardData[];
  inProgress: PassProgramCardData[];
  done: PassProgramCardData[];
  isLoading: boolean;
  isError: boolean;
}

// 라이브는 세션 시각까지, 챌린지는 날짜만
const periodText = (
  type: UsageProgramType,
  start?: string | null,
  end?: string | null,
): string | undefined => {
  if (!start) return undefined;
  if (type === 'LIVE') {
    return `${dayjs(start).format('YY.MM.DD HH:mm')}${
      end ? ` ~ ${dayjs(end).format('HH:mm')}` : ''
    }`;
  }
  return `${dayjs(start).format('YY.MM.DD')} ~ ${dayjs(end).format('YY.MM.DD')}`;
};

export const useUsageProgramTab = (
  type: UsageProgramType,
): UsageProgramSections => {
  const catalogQuery = useGetUserProgramQuery({
    pageable: CATALOG_PAGE,
    searchParams: { type },
  });
  const applicationsQuery = useMypageApplicationsQuery();

  return useMemo(() => {
    const applications = applicationsQuery.data ?? [];
    const apps = applications.filter(
      (a) => a.programType === type && a.programId != null,
    );
    const enrolledIds = new Set(apps.map((a) => a.programId));

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
        periodText: periodText(
          type,
          p.programInfo.startDate,
          p.programInfo.endDate,
        ),
        beginning: p.programInfo.beginning,
        deadline: p.programInfo.deadline,
        programStatusType: p.programInfo.programStatusType,
        participation: 'BEFORE',
      }));

    const fromApplication = (
      a: (typeof apps)[number],
    ): PassProgramCardData => ({
      programId: a.programId as number,
      title: a.programTitle ?? '',
      thumbnail: a.programThumbnail,
      periodText: periodText(
        type,
        a.programStartDate?.toISOString(),
        a.programEndDate?.toISOString(),
      ),
      participation: a.programStatusType === 'POST' ? 'DONE' : 'IN_PROGRESS',
      applicationId: a.id,
      isMembershipApplied: a.isMembershipApplied ?? false,
    });

    return {
      before,
      inProgress: apps
        .filter((a) => a.programStatusType !== 'POST')
        .map(fromApplication),
      done: apps
        .filter((a) => a.programStatusType === 'POST')
        .map(fromApplication),
      isLoading: catalogQuery.isLoading || applicationsQuery.isLoading,
      isError: catalogQuery.isError || applicationsQuery.isError,
    };
  }, [
    type,
    catalogQuery.data,
    catalogQuery.isLoading,
    catalogQuery.isError,
    applicationsQuery.data,
    applicationsQuery.isLoading,
    applicationsQuery.isError,
  ]);
};
