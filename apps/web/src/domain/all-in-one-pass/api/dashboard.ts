import { useMypageApplicationsQuery } from '@/api/application';
import { useGetUserProgramQuery } from '@/api/program';
import dayjs from '@/lib/dayjs';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { applicationDetailFixture } from '../mock/dashboardFixtures';
import { mockDelay } from '../mock/mockDelay';
import type {
  AllInOnePassApplication,
  AllInOnePassApplicationDetail,
  PassCalendarEvent,
  PassDescriptionBlob,
  PassExternalLink,
} from '../types';

// U-1 대시보드 훅. 모두 내 신청 상세(단일 소스)에서 파생 — 실 API 시 useGetMembershipApplication 만 교체.

/** description(JSON) 파싱 → 캘린더(게릴라/마일스톤)·외부링크·멘토링쿠폰 */
const parsePassDescription = (description: string) => {
  let blob: PassDescriptionBlob;
  try {
    blob = JSON.parse(description) as PassDescriptionBlob;
  } catch {
    blob = {
      calendarEvents: [],
      externalLinks: [],
      mentoringCouponAutoIssue: false,
    };
  }
  // id 는 챌린지(programId)와 안 겹치게 오프셋
  const calendarEvents: PassCalendarEvent[] = (blob.calendarEvents ?? []).map(
    (e, i) => ({
      id: 1_000_000 + i,
      type: e.type,
      title: e.title,
      description: null,
      startDate: e.startDate,
      endDate: e.endDate,
      url: e.url ?? null,
    }),
  );
  const externalLinks: PassExternalLink[] = (blob.externalLinks ?? []).map(
    (l, i) => ({ id: i + 1, name: l.name, url: l.url }),
  );
  return {
    calendarEvents,
    externalLinks,
    mentoringCouponAutoIssue: blob.mentoringCouponAutoIssue ?? false,
  };
};

/**
 * 내 신청 상세 — 접근 가드 + 기간/이용권/연장 공통 소스. 403/404 → isError → 레이아웃 redirect.
 * // TODO(BE): queryFn 을 GET /membership-application/{applicationId} 로 교체.
 */
export const useGetMembershipApplication = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'application', applicationId],
    queryFn: (): Promise<AllInOnePassApplicationDetail> =>
      mockDelay(applicationDetailFixture),
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    retry: false, // 403/404 는 즉시 에러로 (가드 redirect)
    refetchOnWindowFocus: false,
  });

export const useGetMyPass = (applicationId: number) => {
  const { data, isLoading, isError } =
    useGetMembershipApplication(applicationId);
  return useMemo(() => {
    if (!data) return { data: undefined, isLoading, isError };
    const { mentoringCouponAutoIssue } = parsePassDescription(data.description);
    const myPass: AllInOnePassApplication = {
      id: data.membershipApplicationId,
      passTitle: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      plan: {
        id: 0,
        title: data.plan.title,
        description: null,
        price: 0,
        discount: null,
        privileges: data.plan.privilegeList,
      },
      // 멘토링 쿠폰은 현재 고정 — 자동발급이면 쿠폰명 노출
      mentoringCoupons: mentoringCouponAutoIssue
        ? [{ name: '1:1 LIVE 멘토링 50% 할인 쿠폰', count: 1 }]
        : [],
    };
    return { data: myPass, isLoading, isError };
  }, [data, isLoading, isError]);
};

export const useGetPassExternalLinks = (applicationId: number) => {
  const { data, isLoading, isError } =
    useGetMembershipApplication(applicationId);
  return useMemo(
    () => ({
      data: (data
        ? parsePassDescription(data.description).externalLinks
        : []) as PassExternalLink[],
      isLoading,
      isError,
    }),
    [data, isLoading, isError],
  );
};

export const useGetPassCalendar = (applicationId: number) => {
  const catalogQuery = useGetUserProgramQuery({
    pageable: { page: 1, size: 100 },
    searchParams: { type: 'CHALLENGE' },
  });
  const applicationsQuery = useMypageApplicationsQuery();
  const { data: application } = useGetMembershipApplication(applicationId);

  return useMemo(() => {
    const apps = (applicationsQuery.data ?? []).filter(
      (a) => a.programType === 'CHALLENGE' && a.programId != null,
    );
    const enrolledIds = new Set(apps.map((a) => a.programId));

    const enrolled: PassCalendarEvent[] = apps.map((a) => ({
      id: a.programId as number,
      type: 'CHALLENGE',
      title: a.programTitle ?? '',
      description: null,
      startDate: a.programStartDate?.toISOString() ?? '',
      endDate: a.programEndDate?.toISOString() ?? null,
      programId: a.programId as number,
      challengeApplicationId: a.id,
    }));

    const now = dayjs();
    const notEnrolled: PassCalendarEvent[] = (
      catalogQuery.data?.programList ?? []
    )
      .filter(
        (p) =>
          !enrolledIds.has(p.programInfo.id) &&
          (!p.programInfo.deadline ||
            !now.isAfter(dayjs(p.programInfo.deadline))),
      )
      .map((p) => ({
        id: p.programInfo.id,
        type: 'CHALLENGE',
        title: p.programInfo.title ?? '',
        description: null,
        startDate: p.programInfo.startDate ?? '',
        endDate: p.programInfo.endDate ?? null,
        programId: p.programInfo.id,
        challengeApplicationId: null,
      }));

    const descEvents = application
      ? parsePassDescription(application.description).calendarEvents
      : [];

    return {
      data: [...enrolled, ...notEnrolled, ...descEvents],
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
    application,
  ]);
};
