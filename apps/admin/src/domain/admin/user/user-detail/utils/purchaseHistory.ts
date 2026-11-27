import dayjs from '@/lib/dayjs';
import type { RefundTarget } from '@/domain/admin/program/program-user/ui/RefundModal';
import { resolveRefundableState } from '@/domain/admin/program/program-user/utils/refundState';
import type { UserApplicationDetailInfo } from '@/schema';
import type { Dayjs } from 'dayjs';

export type PurchaseStatus =
  | '진행 전'
  | '진행 중'
  | '종료'
  | '환불·취소됨'
  | '기간 없음';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 행의 상태 글자. 기간과 지금을 비교한 표시용 값이다.
 * 환불 가능 여부의 기준이 아니다. 그 기준은 서버 검증과 `resolveRefundableState` 다.
 */
export const resolvePurchaseStatus = (
  item: Pick<
    UserApplicationDetailInfo,
    'isCanceled' | 'programStartDate' | 'programEndDate'
  >,
  now: Dayjs = dayjs(),
): PurchaseStatus => {
  if (item.isCanceled) return '환불·취소됨';

  const { programStartDate: start, programEndDate: end } = item;
  if (!start && !end) return '기간 없음';

  if (start && now.isBefore(dayjs(start))) return '진행 전';
  // 날짜만 오는 종료일은 그날 끝까지를 기간으로 본다.
  if (
    end &&
    now.isAfter(DATE_ONLY.test(end) ? dayjs(end).endOf('day') : dayjs(end))
  ) {
    return '종료';
  }
  return '진행 중';
};

export interface PurchaseEntry {
  item: UserApplicationDetailInfo;
  status: PurchaseStatus;
}

/**
 * 참여중은 진행 전 또는 진행 중인 신청이다.
 * 종료·환불·취소 건과, 기간이 없어 진행을 말할 수 없는 건(VOD, 가이드북 등)은 참여했던으로 둔다.
 */
export const splitPurchaseHistory = (
  items: UserApplicationDetailInfo[],
  now: Dayjs = dayjs(),
) => {
  const current: PurchaseEntry[] = [];
  const past: PurchaseEntry[] = [];
  items.forEach((item) => {
    const status = resolvePurchaseStatus(item, now);
    const isCurrent = status === '진행 전' || status === '진행 중';
    (isCurrent ? current : past).push({ item, status });
  });
  return { current, past };
};

/** 올인원패스 행은 신청 id 가 없고 멤버십 신청 id 가 있다. */
export const isMembershipRow = (item: UserApplicationDetailInfo) =>
  item.programType === 'MEMBERSHIP' || item.membershipApplicationId != null;

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE',
  VOD: 'VOD',
  REPORT: '리포트',
  GUIDEBOOK: '가이드북',
  LIVE_MENTORING: '1:1 멘토링',
  MEMBERSHIP: '올인원패스',
  VOD_PASS: 'VOD 이용권',
};

export const programTypeLabel = (programType?: string | null) =>
  programType ? (PROGRAM_TYPE_LABELS[programType] ?? programType) : '-';

const PLAN_LABELS: Record<string, string> = {
  BASIC: '베이직',
  STANDARD: '스탠다드',
  PREMIUM: '프리미엄',
  LIGHT: '라이트',
};

export const planLabel = (plan: string) => PLAN_LABELS[plan] ?? plan;

/** 쿠폰 할인 -1 은 금액이 아니라 100% 할인 표시다. */
export const formatCouponLabel = (
  name?: string | null,
  discount?: number | null,
) => {
  if (!name) return '없음';
  if (discount === -1) return `${name} (100% 할인)`;
  if (discount == null) return name;
  return `${name} (${discount.toLocaleString()}원 할인)`;
};

export const formatWon = (value?: number | null) =>
  value == null ? '-' : `${value.toLocaleString()}원`;

export const formatPeriod = (start?: string | null, end?: string | null) => {
  if (!start && !end) return '-';
  const format = (value?: string | null) =>
    value ? dayjs(value).format('YYYY-MM-DD') : '';
  return `${format(start)} ~ ${format(end)}`;
};

export const formatPaymentDate = (value?: string | null) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';

const VOD_PASS_REFUND_NOTICE =
  '환불하면 금액과 상관없이 이용권이 취소되어 시청이 중단됩니다.';

/**
 * 환불 버튼 노출 기준. 참여자 표와 같은 `resolveRefundableState` 를 쓴다.
 * 신청 id 가 없는 행(올인원패스)은 이 환불 경로가 아니다.
 */
export const resolveRowRefund = (item: UserApplicationDetailInfo) => {
  if (item.applicationId == null) {
    return { canRefund: false, canPartialRefund: false };
  }
  const { canRefund, canPartialRefund } = resolveRefundableState({
    isCanceled: item.isCanceled ?? false,
    hasUser: true,
    finalPrice: item.finalPrice ?? null,
  });
  return { canRefund, canPartialRefund };
};

/** 참여자 표(`TableRow`)가 `RefundTarget` 을 만드는 값과 같다. 신청자 정보는 유저 상세가 이미 가진다. */
export const buildRefundTarget = (
  item: UserApplicationDetailInfo,
  user: Pick<RefundTarget, 'name' | 'email' | 'phoneNum'>,
): RefundTarget => {
  const isChallenge = item.programType === 'CHALLENGE';
  const isVodPass = item.programType === 'VOD_PASS';
  return {
    applicationId: item.applicationId as number,
    ...user,
    programTitle: item.programTitle ?? programTypeLabel(item.programType),
    orderId: item.orderId ?? '',
    pricePlanType: isChallenge ? (item.challengePricePlanType ?? null) : null,
    couponName: item.couponName ?? null,
    couponDiscount: item.couponDiscount ?? null,
    finalPrice: item.finalPrice ?? 0,
    additionalPaidAmount: isChallenge ? (item.additionalPaidAmount ?? 0) : 0,
    pendingManualRefundAmount: isChallenge
      ? (item.pendingManualRefundAmount ?? 0)
      : 0,
    ...(isVodPass ? { notice: VOD_PASS_REFUND_NOTICE } : {}),
  };
};

/**
 * 올인원패스 수동 환불(이용 권한 회수) 대상인가.
 * 이미 처리된 건과, 호출에 필요한 멤버십 id(`programId`)·신청 id 가 없는 건은 제외한다.
 */
export const canRevokeMembership = (item: UserApplicationDetailInfo) =>
  isMembershipRow(item) &&
  !item.isCanceled &&
  item.programId != null &&
  item.membershipApplicationId != null;
