import {
  MembershipDetail,
  MembershipListItem,
  MembershipPrivilegeType,
  MembershipProgramType,
} from '@/api/all-in-one-pass/membershipSchema';
import {
  AllInOnePassListItem,
  PassBenefit,
  PassCalendarEvent,
  PassExternalLink,
  PassFormInput,
  PassPermission,
  PassPlan,
} from '@/domain/all-in-one-pass/types';

/**
 * 백엔드 membership DTO ↔ FE 화면 타입(PassFormInput 등) 변환 레이어.
 *
 * 주의: 서버 `description` 컬럼은 상세(렉시컬)·캘린더·외부링크 3가지를 JSON 한 덩어리로
 * 저장한다(형식은 FE 자유). 아래 (de)serialize 로 처리한다.
 */

// ── permission ↔ privilege ────────────────────────────
const PERMISSION_TO_PRIVILEGE: Record<
  PassPermission,
  { programType: MembershipProgramType; privilegeType: MembershipPrivilegeType }
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
  programType: MembershipProgramType,
  privilegeType: MembershipPrivilegeType,
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

// ── description JSON (상세·캘린더·외부링크) ─────────────
interface DescriptionBlob {
  detailContent: string | null;
  calendarEvents: PassCalendarEvent[];
  externalLinks: PassExternalLink[];
}

const parseDescription = (description?: string | null): DescriptionBlob => {
  const empty: DescriptionBlob = {
    detailContent: null,
    calendarEvents: [],
    externalLinks: [],
  };
  if (!description) return empty;
  try {
    const parsed = JSON.parse(description) as Partial<DescriptionBlob>;
    return {
      detailContent: parsed.detailContent ?? null,
      calendarEvents: parsed.calendarEvents ?? [],
      externalLinks: parsed.externalLinks ?? [],
    };
  } catch {
    return empty;
  }
};

const serializeDescription = (input: PassFormInput): string =>
  JSON.stringify({
    detailContent: input.detailContent,
    calendarEvents: input.calendarEvents,
    externalLinks: input.externalLinks,
  } satisfies DescriptionBlob);

// ── 목록 ──────────────────────────────────────────────
export const toListItem = (vo: MembershipListItem): AllInOnePassListItem => ({
  id: vo.membershipId,
  title: vo.title,
  purchaseStartDate: vo.beginning ?? null,
  purchaseEndDate: vo.deadline ?? null,
  passDays: vo.periodDays ?? 0,
  isVisible: vo.isVisible,
  currentApplicantCount: vo.applicationCount ?? 0,
  maxApplicantCount: null, // BE 미제공(정원 개념 없음)
  createdAt: vo.createdAt ?? '', // BE 추가 예정
});

// ── 상세 → 폼 ─────────────────────────────────────────
export const toFormInput = (detail: MembershipDetail): PassFormInput => {
  const blob = parseDescription(detail.description);
  return {
    title: detail.title,
    shortDescription: detail.introduction ?? '',
    purchaseStartDate: detail.beginning ?? null,
    purchaseEndDate: detail.deadline ?? null,
    passDays: detail.periodDays ?? null,
    thumbnailUrl: detail.thumbnail ?? null,
    plans: detail.planList.map((plan) => ({
      id: String(plan.membershipPlanId ?? crypto.randomUUID()),
      name: plan.title,
      description: plan.description ?? '',
      permissions: plan.privilegeList
        .map((pv) => privilegeToPermission(pv.programType, pv.privilegeType))
        .filter((p): p is PassPermission => p !== null),
      regularPrice: plan.price ?? null,
      discountPrice: plan.discount ?? null,
    })),
    calendarEvents: blob.calendarEvents,
    externalLinks: blob.externalLinks,
    detailContent: blob.detailContent,
    benefits: detail.benefitList.map((b) => ({
      id: String(b.membershipBenefitId),
      isVisible: true, // BE 미지원 — 노출 토글 보류
      category: b.type ?? '',
      thumbnailUrl: b.thumbnail ?? null,
      title: b.title,
      link: b.link ?? '',
      coupon: null, // 멘토링 쿠폰은 혜택과 별개
    })),
  };
};

// ── 폼 → 생성/수정 DTO ────────────────────────────────
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

export const benefitToDto = (benefit: PassBenefit) => ({
  title: benefit.title,
  type: benefit.category,
  link: benefit.link || null,
  thumbnail: benefit.thumbnailUrl,
});

/** 생성 요청 body */
export const toCreateDto = (input: PassFormInput) => ({
  title: input.title,
  introduction: input.shortDescription || null,
  description: serializeDescription(input),
  beginning: input.purchaseStartDate,
  deadline: input.purchaseEndDate,
  periodDays: input.passDays,
  thumbnail: input.thumbnailUrl,
  isVisible: false, // 개설 시 기본 비노출
  benefitList: input.benefits.map(benefitToDto),
  planList: input.plans.map(planToDto),
  // FAQ는 글로벌이라 멤버십 생성 payload에 포함하지 않음(/faq로 별도 관리)
});

/** 수정 요청 body (basic만 — 서버 PATCH가 plan/benefit/faq 미포함) */
export const toUpdateDto = (input: PassFormInput) => ({
  title: input.title,
  introduction: input.shortDescription || null,
  description: serializeDescription(input),
  beginning: input.purchaseStartDate,
  deadline: input.purchaseEndDate,
  periodDays: input.passDays,
  thumbnail: input.thumbnailUrl,
});
