import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { z } from 'zod';
import type {
  PassCalendarEvent,
  PassDescriptionBlob,
  PassExternalLink,
  PassParticipationStatus,
} from '../types';

// 대시보드 훅 — 섹션별 실 API(가드·이용권·연장옵션·캘린더·benefit/challenge).

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

// ─── GET /{id}/extension-option — 연장 모달 옵션(isVisible 은 BE가 필터) ───
const extensionOptionSchema = z.object({
  membershipOptionId: z.number(),
  title: z.string().nullish(),
  extensionDays: z.number(),
  price: z.number(),
  discount: z.number().nullish(),
  isVisible: z.boolean().nullish(),
});
const extensionOptionsSchema = z.object({
  optionList: z.array(extensionOptionSchema).default([]),
});
export type ExtensionOption = z.infer<typeof extensionOptionSchema>;

export const useGetExtensionOptions = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'extensionOption', applicationId],
    queryFn: async () => {
      const res = await axios.get(
        `/membership-application/${applicationId}/extension-option`,
      );
      return extensionOptionsSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });

// ─── GET /{id}/calendar — 게릴라/마일스톤·외부링크(description). 챌린지는 benefit/challenge ───
const calendarSchema = z.object({
  description: z.string().nullish(),
});

export const useGetPassCalendarData = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'calendar', applicationId],
    queryFn: async () => {
      const res = await axios.get(
        `/membership-application/${applicationId}/calendar`,
      );
      return calendarSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });

// ─── GET /{id}/benefit/challenge — 캘린더 챌린지 바(참여전/중/완료), 챌린지 탭과 공유 ───
const benefitChallengeSchema = z.object({
  challengeId: z.number(),
  title: z.string().nullish(),
  thumbnail: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  beginning: z.string().nullish(),
  deadline: z.string().nullish(),
});
const benefitChallengesSchema = z.object({
  applicableUntil: z.string().nullish(),
  availableList: z.array(benefitChallengeSchema).default([]),
  ongoingList: z.array(benefitChallengeSchema).default([]),
  completedList: z.array(benefitChallengeSchema).default([]),
});
export type BenefitChallenge = z.infer<typeof benefitChallengeSchema>;
export type BenefitChallenges = z.infer<typeof benefitChallengesSchema>;

export const useGetBenefitChallenges = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'benefitChallenge', applicationId],
    queryFn: async (): Promise<BenefitChallenges> => {
      const res = await axios.get(
        `/membership-application/${applicationId}/benefit/challenge`,
      );
      return benefitChallengesSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });

// ─── GET /{id}/benefit/guidebook — 가이드북 탭 열람 가능 목록(패스로 볼 수 있는 전체). 보유 분리는 user/applications ───
const benefitGuidebookSchema = z.object({
  accessible: z.boolean().nullish(),
  programList: z
    .array(
      z.object({
        programId: z.number(),
        title: z.string().nullish(),
        shortDesc: z.string().nullish(),
        thumbnail: z.string().nullish(),
      }),
    )
    .default([]),
});
export type BenefitGuidebook = z.infer<typeof benefitGuidebookSchema>;

export const useGetBenefitGuidebook = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'benefitGuidebook', applicationId],
    queryFn: async (): Promise<BenefitGuidebook> => {
      const res = await axios.get(
        `/membership-application/${applicationId}/benefit/guidebook`,
      );
      return benefitGuidebookSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });

// ─── GET /{id}/benefit/live — 라이브 탭 참여 가능 목록(패스 대상·모집예정 포함·마감 제외). 참여 중/완료는 user/applications ───
// benefit/live 는 날짜 미제공(BE 요청 대기) + 이미 신청한 live 를 안 거르므로, 기간 표시 생략·FE dedup 로 처리.
const benefitLiveSchema = z.object({
  accessible: z.boolean().nullish(),
  programList: z
    .array(
      z.object({
        programId: z.number(),
        title: z.string().nullish(),
        shortDesc: z.string().nullish(),
        thumbnail: z.string().nullish(),
      }),
    )
    .default([]),
});
export type BenefitLive = z.infer<typeof benefitLiveSchema>;

export const useGetBenefitLives = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'benefitLive', applicationId],
    queryFn: async (): Promise<BenefitLive> => {
      const res = await axios.get(
        `/membership-application/${applicationId}/benefit/live`,
      );
      return benefitLiveSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });

export const useGetPassExternalLinks = (applicationId: number) => {
  const { data, isLoading, isError } = useGetPassCalendarData(applicationId);
  return useMemo(
    () => ({
      data: (data?.description
        ? parsePassDescription(data.description).externalLinks
        : []) as PassExternalLink[],
      isLoading,
      isError,
    }),
    [data, isLoading, isError],
  );
};

export const useGetPassCalendar = (applicationId: number) => {
  const challengeQuery = useGetBenefitChallenges(applicationId);
  const calendarQuery = useGetPassCalendarData(applicationId);

  return useMemo(() => {
    const toEvent = (
      c: BenefitChallenge,
      status: PassParticipationStatus,
    ): PassCalendarEvent => ({
      id: c.challengeId,
      type: 'CHALLENGE',
      title: c.title ?? '',
      description: null,
      startDate: c.startDate ?? '',
      endDate: c.endDate ?? null,
      programId: c.challengeId,
      participationStatus: status, // BE 3분류를 그대로 사용(FE 파생 X)
    });

    const ch = challengeQuery.data;
    const challengeEvents: PassCalendarEvent[] = ch
      ? [
          ...ch.availableList.map((c) => toEvent(c, 'BEFORE')),
          ...ch.ongoingList.map((c) => toEvent(c, 'IN_PROGRESS')),
          ...ch.completedList.map((c) => toEvent(c, 'DONE')),
        ]
      : [];

    const descEvents = calendarQuery.data?.description
      ? parsePassDescription(calendarQuery.data.description).calendarEvents
      : [];

    return {
      data: [...challengeEvents, ...descEvents],
      isLoading: challengeQuery.isLoading || calendarQuery.isLoading,
      isError: challengeQuery.isError || calendarQuery.isError,
    };
  }, [
    challengeQuery.data,
    challengeQuery.isLoading,
    challengeQuery.isError,
    calendarQuery.data,
    calendarQuery.isLoading,
    calendarQuery.isError,
  ]);
};
