// 챌린지 탭 — 참여 가능=benefit/challenge(모집 중+예정), 참여 중·완료=user/applications(유저 전체 참여).
import { useMypageApplicationsQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { useMemo } from 'react';
import { useGetBenefitChallenges } from '../../api/dashboard';
import type { PassProgramCardData } from './PassProgramCard';

export interface UsageChallenge {
  before: PassProgramCardData[];
  inProgress: PassProgramCardData[];
  done: PassProgramCardData[];
  isLoading: boolean;
  isError: boolean;
}

const periodText = (start?: string | null, end?: string | null) =>
  start
    ? `${dayjs(start).format('YY.MM.DD')} ~ ${dayjs(end).format('YY.MM.DD')}`
    : undefined;

export const useUsageChallenge = (applicationId: number): UsageChallenge => {
  const benefitQuery = useGetBenefitChallenges(applicationId);
  const appsQuery = useMypageApplicationsQuery();

  return useMemo(() => {
    // 참여 가능 — 패스 혜택(모집 안 끝남 + 미참여). beginning 미래면 모집 예정.
    const before: PassProgramCardData[] = (
      benefitQuery.data?.availableList ?? []
    ).map((c) => ({
      programId: c.challengeId,
      title: c.title ?? '',
      thumbnail: c.thumbnail,
      periodText: periodText(c.startDate, c.endDate),
      beginning: c.beginning,
      deadline: c.deadline,
      programStatusType:
        c.beginning && dayjs(c.beginning).isAfter(dayjs())
          ? 'PREV'
          : 'PROCEEDING',
      participation: 'BEFORE',
    }));

    // 참여 중/완료 — 유저의 전체 참여내역(패스 외 포함). 이 패스로 신청한 건만 뱃지.
    const apps = (appsQuery.data ?? []).filter(
      (a) => a.programType === 'CHALLENGE' && a.programId != null,
    );
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
      // 시작한 챌린지만 대시보드 입장(마이페이지 신청내역과 동일 규칙)
      canEnterDashboard: a.programStartDate
        ? a.programStartDate.isBefore(dayjs())
        : false,
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
