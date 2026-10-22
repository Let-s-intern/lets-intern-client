import {
  AllInOnePassDetail,
  AllInOnePassListItemResponse,
  AllInOnePassPrivilegeType,
  AllInOnePassProgramType,
} from '@/api/all-in-one-pass/allInOnePassSchema';
import dayjs from '@/lib/dayjs';
import {
  AllInOnePassListItem,
  PassCalendarEvent,
  PassExtensionOption,
  PassExternalLink,
  PassFormInput,
  PassPermission,
  PassPlan,
} from '@/domain/all-in-one-pass/types';
import {
  serializeLandingDescription,
  toLandingConfig,
} from '@/domain/all-in-one-pass/util/landingDescriptionMapper';

/** 백엔드 membership DTO ↔ FE 폼 타입(PassFormInput) 변환 레이어. */

// ── permission ↔ privilege ────────────────────────────
const PERMISSION_TO_PRIVILEGE: Record<
  PassPermission,
  {
    programType: AllInOnePassProgramType;
    privilegeType: AllInOnePassPrivilegeType;
  }
> = {
  CHALLENGE_ALL_IN_ONE: {
    programType: 'CHALLENGE',
    privilegeType: 'ALL_IN_ONE',
  },
  GUIDEBOOK_ALL_IN_ONE: {
    programType: 'GUIDEBOOK',
    privilegeType: 'ALL_IN_ONE',
  },
  VOD_ALL_IN_ONE: { programType: 'VOD', privilegeType: 'ALL_IN_ONE' },
  LIVE_CLASS_ALL_IN_ONE: { programType: 'LIVE', privilegeType: 'ALL_IN_ONE' },
};

const privilegeToPermission = (
  programType: AllInOnePassProgramType,
  privilegeType: AllInOnePassPrivilegeType,
): PassPermission | null => {
  const found = (
    Object.entries(PERMISSION_TO_PRIVILEGE) as [
      PassPermission,
      (typeof PERMISSION_TO_PRIVILEGE)[PassPermission],
    ][]
  ).find(
    ([, v]) =>
      v.programType === programType && v.privilegeType === privilegeType,
  );
  return found ? found[0] : null;
};

interface DescriptionBlob {
  calendarEvents: PassCalendarEvent[];
  externalLinks: PassExternalLink[];
  mentoringCouponAutoIssue: boolean;
}

const migrateCalendarEvent = (
  e: PassCalendarEvent & { date?: string | null },
): PassCalendarEvent => ({
  id: e.id,
  startDate: e.startDate ?? e.date ?? null,
  endDate: e.endDate ?? e.date ?? null,
  type: e.type,
  title: e.title,
  url: e.url ?? null,
});

const parseDescription = (description?: string | null): DescriptionBlob => {
  const empty: DescriptionBlob = {
    calendarEvents: [],
    externalLinks: [],
    mentoringCouponAutoIssue: false,
  };
  if (!description) return empty;
  try {
    const parsed = JSON.parse(description) as Partial<DescriptionBlob>;
    return {
      calendarEvents: (parsed.calendarEvents ?? []).map(migrateCalendarEvent),
      externalLinks: parsed.externalLinks ?? [],
      mentoringCouponAutoIssue: parsed.mentoringCouponAutoIssue ?? false,
    };
  } catch {
    return empty;
  }
};

const serializeDescription = (input: PassFormInput): string =>
  JSON.stringify({
    calendarEvents: input.calendarEvents,
    externalLinks: input.externalLinks,
    mentoringCouponAutoIssue: input.mentoringCouponAutoIssue,
  } satisfies DescriptionBlob);

// ── 목록 ──────────────────────────────────────────────
export const toListItem = (
  vo: AllInOnePassListItemResponse,
): AllInOnePassListItem => ({
  id: vo.membershipId,
  title: vo.title,
  purchaseStartDate: vo.beginning ?? null,
  purchaseEndDate: vo.deadline ?? null,
  passDays: vo.periodDays ?? 0,
  isVisible: vo.isVisible,
  currentApplicantCount: vo.applicationCount ?? 0,
  maxApplicantCount: null, // BE 미제공(정원 개념 없음)
  createdAt: vo.createDate ?? '',
});

// ── 상세 → 폼 ─────────────────────────────────────────
export const toFormInput = (detail: AllInOnePassDetail): PassFormInput => {
  const blob = parseDescription(detail.description);
  return {
    title: detail.title,
    shortDescription: detail.introduction ?? '',
    purchaseStartDate: detail.beginning ?? null,
    purchaseEndDate: detail.deadline ?? null,
    passDays: detail.periodDays ?? null,
    thumbnailUrl: detail.thumbnail ?? null,
    plans: detail.planList.map((plan) => {
      const privilegeIds: Partial<Record<PassPermission, number>> = {};
      plan.privilegeList.forEach((pv) => {
        const perm = privilegeToPermission(pv.programType, pv.privilegeType);
        if (perm && pv.membershipPlanPrivilegeId != null)
          privilegeIds[perm] = pv.membershipPlanPrivilegeId;
      });
      return {
        id: String(plan.membershipPlanId ?? crypto.randomUUID()),
        name: plan.title,
        description: plan.description ?? '',
        permissions: plan.privilegeList
          .map((pv) => privilegeToPermission(pv.programType, pv.privilegeType))
          .filter((p): p is PassPermission => p !== null),
        regularPrice: plan.price ?? null,
        discountPrice: plan.discount ?? null,
        privilegeIds,
      };
    }),
    calendarEvents: blob.calendarEvents,
    externalLinks: blob.externalLinks,
    extensionOptions: detail.optionList.map((opt) => ({
      id: String(opt.membershipOptionId ?? crypto.randomUUID()),
      days: opt.extensionDays ?? null,
      price: opt.price ?? null,
    })),
    mentoringCouponAutoIssue: true, // v1배포: 항상 포함(고정)
    landing: toLandingConfig(detail.landingDescription, blob.externalLinks),
    // 이 패스에 연결된(노출) FAQ id — 체크박스 prefill
    faqList: detail.faqList.map((f) => f.id),
  };
};

// ── 폼 → 생성/수정 DTO ────────────────────────────────
/** 폼 옵션 id가 서버 옵션(숫자)이면 true. uuid 는 신규 옵션. */
export const isServerOptionId = (id: string) => /^\d+$/.test(id);

/** 연장 옵션 생성 body (title "{N}일 연장" 자동, 할인가 생략) */
export const optionToCreateDto = (opt: PassExtensionOption) => ({
  title: `${opt.days ?? 0}일 연장`,
  extensionDays: opt.days ?? 0,
  price: opt.price ?? 0,
  discount: null,
});

/** 연장 옵션 수정 body */
export const optionToUpdateDto = (opt: PassExtensionOption) => ({
  title: `${opt.days ?? 0}일 연장`,
  extensionDays: opt.days ?? 0,
  price: opt.price ?? 0,
});

export const planToCreateDto = (plan: PassPlan) => ({
  title: plan.name,
  description: plan.description || null,
  price: plan.regularPrice ?? 0,
  discount: plan.discountPrice ?? null,
  privilegeList: plan.permissions.map((perm) => ({
    ...PERMISSION_TO_PRIVILEGE[perm],
    programCount: null, // 현재 전달 안 함(필드만 유지)
  })),
});

/** 폼 플랜 id가 서버 플랜(숫자)이면 true. uuid 는 아직 저장 안 된 신규 플랜. */
export const isServerPlanId = (id: string) => /^\d+$/.test(id);

/** 수정 PATCH inline planList 한 개 (id null=생성, privilegeList 전체=권한 full-sync). */
export const planToInMembershipDto = (plan: PassPlan) => ({
  membershipPlanId: isServerPlanId(plan.id) ? Number(plan.id) : null,
  title: plan.name,
  description: plan.description || null,
  price: plan.regularPrice ?? 0,
  discount: plan.discountPrice ?? null,
  privilegeList: plan.permissions.map((perm) => ({
    membershipPlanPrivilegeId: plan.privilegeIds?.[perm] ?? null,
    ...PERMISSION_TO_PRIVILEGE[perm],
    programCount: null,
  })),
});

// 판매 시작일은 당일 00:00:00, 종료일은 당일 23:59:59 로 정규화해 전송(시간 선택 UI 없음).
const toDayStart = (v: string | null) =>
  v ? dayjs(v).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : v;
const toDayEnd = (v: string | null) =>
  v ? dayjs(v).endOf('day').format('YYYY-MM-DDTHH:mm:ss') : v;

/** 생성 요청 body */
export const toCreateDto = (input: PassFormInput) => ({
  title: input.title,
  introduction: input.shortDescription || null,
  description: serializeDescription(input),
  landingDescription: serializeLandingDescription(input),
  beginning: toDayStart(input.purchaseStartDate),
  deadline: toDayEnd(input.purchaseEndDate),
  periodDays: input.passDays,
  thumbnail: input.thumbnailUrl,
  isVisible: false, // 개설 시 기본 비노출
  planList: input.plans.map(planToCreateDto),
  optionList: input.extensionOptions.map(optionToCreateDto),
  faqList: input.faqList.map((faqId) => ({ faqId })), // 이 패스에 노출할 공통 FAQ
});

/** 수정 요청 body. 플랜·권한은 planList inline full-sync, 삭제만 별도 DELETE. */
export const toUpdateDto = (input: PassFormInput) => ({
  title: input.title,
  introduction: input.shortDescription || null,
  description: serializeDescription(input),
  landingDescription: serializeLandingDescription(input),
  beginning: toDayStart(input.purchaseStartDate),
  deadline: toDayEnd(input.purchaseEndDate),
  periodDays: input.passDays,
  thumbnail: input.thumbnailUrl,
  planList: input.plans.map(planToInMembershipDto),
  faqList: input.faqList.map((faqId) => ({ faqId })),
});
