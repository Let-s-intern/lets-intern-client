import { useMypageApplicationsQuery } from '@/api/application';
import { useGetUserProgramQuery } from '@/api/program';
import dayjs from '@/lib/dayjs';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { z } from 'zod';
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

// ─── GET /membership-application/{id} — 접근 가드 + 기본 정보(실 API) ───
const myMembershipApplicationSchema = z.object({
  membershipApplicationId: z.number(),
  membershipId: z.number(),
  title: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  periodDays: z.number().nullish(),
  deadline: z.string().nullish(), // 판매 종료일(연장 창 상한)
});
export type MyMembershipApplication = z.infer<
  typeof myMembershipApplicationSchema
>;

/** 접근 가드 + 기본 정보(기간·판매종료일). 본인 아니면 403 → isError → 레이아웃 redirect. */
export const useGetMyMembershipApplication = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'myApplication', applicationId],
    queryFn: async (): Promise<MyMembershipApplication> => {
      const res = await axios.get(`/membership-application/${applicationId}`);
      return myMembershipApplicationSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    retry: false, // 403/404 는 즉시 에러로(가드 redirect)
    refetchOnWindowFocus: false,
  });

// ─── GET /{id}/plan — 이용권 카드 ───
const planPrivilegeSchema = z.object({
  membershipPlanPrivilegeId: z.number().nullish(),
  programType: z.string(),
  privilegeType: z.string(),
  programCount: z.number().nullish(),
});
const myPassPlanSchema = z.object({
  title: z.string().nullish(),
  privilegeList: z.array(planPrivilegeSchema).default([]),
});
export type MyPassPlan = z.infer<typeof myPassPlanSchema>;

export const useGetMyPassPlan = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'plan', applicationId],
    queryFn: async (): Promise<MyPassPlan> => {
      const res = await axios.get(
        `/membership-application/${applicationId}/plan`,
      );
      return myPassPlanSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });

/**
 * 내 신청 상세(mock 단일 소스) — 기간/이용권/연장 파생. 섹션별 실 API로 순차 교체 예정.
 * // TODO(BE): 섹션별 엔드포인트로 분해 후 제거.
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
