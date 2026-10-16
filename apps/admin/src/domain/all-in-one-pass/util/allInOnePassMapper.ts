import {
  AllInOnePassDetail,
  AllInOnePassListItemResponse,
  AllInOnePassPrivilegeType,
  AllInOnePassProgramType,
} from '@/api/all-in-one-pass/allInOnePassSchema';
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

/**
 * 백엔드 membership DTO ↔ FE 화면 타입(PassFormInput 등) 변환 레이어.
 *
 * 주의: 서버 `description` 컬럼은 상세(렉시컬)·캘린더·외부링크 3가지를 JSON 한 덩어리로
 * 저장한다(형식은 FE 자유). 아래 (de)serialize 로 처리한다.
 */

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

// ── description JSON (캘린더·외부링크·멘토링) ────────────
// 상세 렉시컬은 landingDescription, 연장 옵션은 optionList(server)로 분리한다.
interface DescriptionBlob {
  calendarEvents: PassCalendarEvent[];
  externalLinks: PassExternalLink[];
  mentoringCouponAutoIssue: boolean;
}

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
      calendarEvents: parsed.calendarEvents ?? [],
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

// 랜딩(landingDescription) (de)serialize 는 landingDescriptionMapper 로 분리.

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
    mentoringCouponAutoIssue: blob.mentoringCouponAutoIssue,
    landing: toLandingConfig(detail.landingDescription, blob.externalLinks),
    // 이 패스에 연결된(노출) FAQ id — 체크박스 prefill
    faqList: detail.faqList.map((f) => f.id),
  };
};

// ── 폼 → 생성/수정 DTO ────────────────────────────────
// 연장 옵션 → server optionList. title은 "{패스명} {N}일 연장"으로 자동생성.
const extensionToOption = (passTitle: string, opt: PassExtensionOption) => ({
  title: `${passTitle} ${opt.days ?? 0}일 연장`,
  extensionDays: opt.days ?? 0,
  price: opt.price ?? 0,
  discount: null,
});

const planToDto = (plan: PassPlan) => ({
  title: plan.name,
  description: plan.description || null,
  price: plan.regularPrice ?? 0,
  discount: plan.discountPrice ?? null,
  privilegeList: plan.permissions.map((perm) => ({
    ...PERMISSION_TO_PRIVILEGE[perm],
    programCount: null, // 현재 전달 안 함(필드만 유지)
  })),
});

/** 플랜 수정 요청 body (기존 플랜 PATCH — 권한은 별도 엔드포인트) */
export const planToUpdateDto = (plan: PassPlan) => ({
  title: plan.name,
  description: plan.description || null,
  price: plan.regularPrice ?? 0,
  discount: plan.discountPrice ?? null,
});

/** 권한 생성/수정 요청 body (privilege POST·PATCH 공용) */
export const permissionToPrivilegeDto = (perm: PassPermission) => ({
  ...PERMISSION_TO_PRIVILEGE[perm],
  programCount: null,
});

/** 생성 요청 body */
export const toCreateDto = (input: PassFormInput) => ({
  title: input.title,
  introduction: input.shortDescription || null,
  description: serializeDescription(input),
  landingDescription: serializeLandingDescription(input),
  beginning: input.purchaseStartDate,
  deadline: input.purchaseEndDate,
  periodDays: input.passDays,
  thumbnail: input.thumbnailUrl,
  isVisible: false, // 개설 시 기본 비노출
  planList: input.plans.map(planToDto),
  optionList: input.extensionOptions.map((opt) =>
    extensionToOption(input.title, opt),
  ),
  faqList: input.faqList.map((faqId) => ({ faqId })), // 이 패스에 노출할 공통 FAQ
});

/** 수정 요청 body (basic + faqList. plan/benefit은 각자 독립 엔드포인트) */
export const toUpdateDto = (input: PassFormInput) => ({
  title: input.title,
  introduction: input.shortDescription || null,
  description: serializeDescription(input),
  landingDescription: serializeLandingDescription(input),
  beginning: input.purchaseStartDate,
  deadline: input.purchaseEndDate,
  periodDays: input.passDays,
  thumbnail: input.thumbnailUrl,
  optionList: input.extensionOptions.map((opt) =>
    extensionToOption(input.title, opt),
  ),
  faqList: input.faqList.map((faqId) => ({ faqId })),
});
