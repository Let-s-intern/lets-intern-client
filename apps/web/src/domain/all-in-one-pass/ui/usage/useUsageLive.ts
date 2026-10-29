// 라이브 탭 — 참여 가능=benefit/live(패스 대상·모집예정 포함·마감 제외), 참여 중·완료=user/applications(유저 전체 참여).
import { useMypageApplicationsQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { useMemo } from 'react';
import { useGetBenefitLives } from '../../api/dashboard';
import type { PassProgramCardData } from './PassProgramCard';

export interface UsageLive {
  before: PassProgramCardData[];
  inProgress: PassProgramCardData[];
  done: PassProgramCardData[];
  isLoading: boolean;
  isError: boolean;
}

// 라이브는 세션 시각까지 표기
const periodText = (start?: string | null, end?: string | null) =>
  start
    ? `${dayjs(start).format('YY.MM.DD HH:mm')}${
        end ? ` ~ ${dayjs(end).format('HH:mm')}` : ''
      }`
    : undefined;

export const useUsageLive = (applicationId: number): UsageLive => {
  const benefitQuery = useGetBenefitLives(applicationId);
  const appsQuery = useMypageApplicationsQuery();

  return useMemo(() => {
    // 참여 중/완료 — 유저의 전체 참여내역(패스 외 포함). 이 패스로 신청한 건만 뱃지.
    const apps = (appsQuery.data ?? []).filter(
      (a) => a.programType === 'LIVE' && a.programId != null,
    );
    const enrolledIds = new Set(apps.map((a) => a.programId));

    // 참여 가능 — 패스 혜택 라이브. benefit/live 는 이미 신청한 건을 안 거르므로 dedup.
    const before: PassProgramCardData[] = (benefitQuery.data?.programList ?? [])
      .filter((p) => !enrolledIds.has(p.programId))
      .map((p) => ({
        programId: p.programId,
        title: p.title ?? '',
        thumbnail: p.thumbnail,
        periodText: periodText(p.startDate, p.endDate),
        beginning: p.beginning,
        deadline: p.deadline,
        programStatusType:
          p.beginning || p.deadline
            ? p.beginning && dayjs(p.beginning).isAfter(dayjs())
              ? 'PREV'
              : 'PROCEEDING'
            : undefined,
        participation: 'BEFORE',
      }));

    const toCard = (a: (typeof apps)[number]): PassProgramCardData => ({
      programId: a.programId as number,
      title: a.programTitle ?? '',
      thumbnail: a.programThumbnail,
      periodText: periodText(
        a.programStartDate?.toISOString(),
        a.programEndDate?.toISOString(),
      ),
      participation: a.programStatusType === 'POST' ? 'DONE' : 'IN_PROGRESS',
      applicationId: a.id,
      isMembershipApplied:
        a.membershipApplicationId != null
          ? a.membershipApplicationId === applicationId
          : (a.isMembershipApplied ?? false),
    });

    return {
      before,
      inProgress: apps
        .filter((a) => a.programStatusType !== 'POST')
        .map(toCard),
      done: apps.filter((a) => a.programStatusType === 'POST').map(toCard),
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
