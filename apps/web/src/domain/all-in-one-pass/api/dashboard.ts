import { useMypageApplicationsQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { z } from 'zod';
import type {
  PassCalendarEvent,
  PassDescriptionBlob,
  PassExternalLink,
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
// 날짜 4필드는 BE 추가 대기(챌린지 혜택과 동일) — 내려오면 진행기간·모집뱃지 자동 표기, 이미 신청한 live 는 FE dedup 로 처리.
const benefitLiveSchema = z.object({
  accessible: z.boolean().nullish(),
  programList: z
    .array(
      z.object({
        programId: z.number(),
        title: z.string().nullish(),
        shortDesc: z.string().nullish(),
        thumbnail: z.string().nullish(),
        startDate: z.string().nullish(),
        endDate: z.string().nullish(),
        beginning: z.string().nullish(),
        deadline: z.string().nullish(),
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
  // benefit/challenge엔 신청 id가 없어 대시보드 route(/challenge/{appId}/{programId})를
  // 못 만든다. user/applications(캐시 공유)에서 programId로 매칭해 채운다.
  const appsQuery = useMypageApplicationsQuery();

  return useMemo(() => {
    // 참여 전 — 패스 혜택 benefit/challenge availableList(아직 신청 안 한 참여 가능 챌린지)
    const beforeEvents: PassCalendarEvent[] = (
      challengeQuery.data?.availableList ?? []
    ).map((c) => ({
      id: c.challengeId,
      type: 'CHALLENGE',
      title: c.title ?? '',
      description: null,
      startDate: c.startDate ?? '',
      endDate: c.endDate ?? null,
      programId: c.challengeId,
      challengeApplicationId: null,
      participationStatus: 'BEFORE',
    }));

    // 참여 중/완료 — 유저 전체 참여내역(user/applications). benefit/challenge의
    // ongoing/completed는 '이 패스로 신청한 건'만 내려줌(BE membershipApplication.id 조건)
    // 패스 외 참여가 누락되므로 혜택이용 탭과 동일하게 전체 참여를 쓴다.
    const participatedEvents: PassCalendarEvent[] = (appsQuery.data ?? [])
      .filter((a) => a.programType === 'CHALLENGE' && a.programId != null)
      .map((a) => {
        // 시작한 챌린지만 대시보드 입장(마이페이지와 동일 규칙)
        const started = a.programStartDate?.isBefore(dayjs()) ?? false;
        return {
          id: a.programId as number,
          type: 'CHALLENGE',
          title: a.programTitle ?? '',
          description: null,
          startDate: a.programStartDate?.toISOString() ?? '',
          endDate: a.programEndDate?.toISOString() ?? null,
          programId: a.programId as number,
          challengeApplicationId: started ? (a.id ?? null) : null,
          participationStatus:
            a.programStatusType === 'POST' ? 'DONE' : 'IN_PROGRESS',
        };
      });

    const descEvents = calendarQuery.data?.description
      ? parsePassDescription(calendarQuery.data.description).calendarEvents
      : [];

    return {
      data: [...beforeEvents, ...participatedEvents, ...descEvents],
      isLoading:
        challengeQuery.isLoading ||
        calendarQuery.isLoading ||
        appsQuery.isLoading,
      isError: challengeQuery.isError || calendarQuery.isError,
    };
  }, [
    challengeQuery.data,
    challengeQuery.isLoading,
    challengeQuery.isError,
    calendarQuery.data,
    calendarQuery.isLoading,
    calendarQuery.isError,
    appsQuery.data,
    appsQuery.isLoading,
  ]);
};
