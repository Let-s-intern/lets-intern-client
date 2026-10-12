// 가이드북 탭 데이터 — GET /program(카탈로그) + GET /user/applications(보유 이력)를 programId로 조인.
import { useMypageApplicationsQuery } from '@/api/application';
import { useGetUserProgramQuery } from '@/api/program';
import { useMemo } from 'react';
import type { PassProgramCardData } from './PassProgramCard';

const CATALOG_PAGE = { page: 1, size: 100 } as const;

export interface UsageGuidebook {
  available: PassProgramCardData[];
  owned: PassProgramCardData[];
  isLoading: boolean;
  isError: boolean;
}

const toCard = (
  programId: number,
  title: string,
  thumbnail?: string | null,
): PassProgramCardData => ({
  programId,
  title,
  thumbnail,
  participation: 'BEFORE',
});

export const useUsageGuidebook = (): UsageGuidebook => {
  const catalogQuery = useGetUserProgramQuery({
    pageable: CATALOG_PAGE,
    searchParams: { type: 'GUIDEBOOK' },
  });
  const applicationsQuery = useMypageApplicationsQuery();

  return useMemo(() => {
    const applications = applicationsQuery.data ?? [];
    const guidebookApps = applications.filter(
      (a) => a.programType === 'GUIDEBOOK' && a.programId != null,
    );
    const ownedIds = new Set(guidebookApps.map((a) => a.programId));

    const available = (catalogQuery.data?.programList ?? [])
      .filter((p) => !ownedIds.has(p.programInfo.id))
      .map((p) =>
        toCard(
          p.programInfo.id,
          p.programInfo.title ?? '',
          p.programInfo.thumbnail,
        ),
      );

    const owned = guidebookApps.map((a) =>
      toCard(a.programId as number, a.programTitle ?? '', a.programThumbnail),
    );

    return {
      available,
      owned,
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
