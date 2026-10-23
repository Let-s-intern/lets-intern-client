// 가이드북 탭 — 열람 가능=benefit/guidebook(패스로 볼 수 있는 전체−보유), 보유 중=user/applications.
import { useMypageApplicationsQuery } from '@/api/application';
import { useMemo } from 'react';
import { useGetBenefitGuidebook } from '../../api/dashboard';
import type { PassProgramCardData } from './PassProgramCard';

export interface UsageGuidebook {
  available: PassProgramCardData[];
  owned: PassProgramCardData[];
  isLoading: boolean;
  isError: boolean;
}

export const useUsageGuidebook = (applicationId: number): UsageGuidebook => {
  const benefitQuery = useGetBenefitGuidebook(applicationId);
  const appsQuery = useMypageApplicationsQuery();

  return useMemo(() => {
    const apps = (appsQuery.data ?? []).filter(
      (a) => a.programType === 'GUIDEBOOK' && a.programId != null,
    );
    const ownedIds = new Set(apps.map((a) => a.programId));

    // 열람 가능 — 패스로 볼 수 있는 전체에서 보유분 제외
    const available: PassProgramCardData[] = (
      benefitQuery.data?.programList ?? []
    )
      .filter((p) => !ownedIds.has(p.programId))
      .map((p) => ({
        programId: p.programId,
        title: p.title ?? '',
        thumbnail: p.thumbnail,
        participation: 'BEFORE',
      }));

    // 보유 중 — 유저의 전체 보유(패스 외 포함) + 다운로드 정보. 이 패스로 받은 것만 뱃지.
    const owned: PassProgramCardData[] = apps.map((a) => ({
      programId: a.programId as number,
      title: a.programTitle ?? '',
      thumbnail: a.programThumbnail,
      participation: 'BEFORE',
      applicationId: a.id,
      isMembershipApplied:
        a.membershipApplicationId != null
          ? a.membershipApplicationId === applicationId
          : (a.isMembershipApplied ?? false),
      isDownloaded: a.isDownloaded ?? false,
      contentUrl: a.contentUrl,
      contentFileUrl: a.contentFileUrl,
    }));

    return {
      available,
      owned,
      isLoading: benefitQuery.isLoading || appsQuery.isLoading,
      isError: benefitQuery.isError || appsQuery.isError,
    };
  }, [
    benefitQuery.data,
    benefitQuery.isLoading,
    benefitQuery.isError,
    appsQuery.data,
    appsQuery.isLoading,
    appsQuery.isError,
    applicationId,
  ]);
};
