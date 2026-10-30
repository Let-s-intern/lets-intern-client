// 올인원패스 주문에 함께 담는 VOD 이용권(LC-3533). 계산은 챌린지와 같은 vodPassPurchase.ts 함수를 쓴다.
import type { PostApplicationResult } from '@/api/application';
import type {
  CreateMembershipApplicationBody,
  MembershipVodPassProduct,
} from '@/domain/all-in-one-pass/api/purchase';
import type { MembershipOrderData } from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import {
  calculateChallengeTotalWithVodPass,
  calculateVodPassDurationDays,
  calculateVodPassPrice,
  clampVodPassMonths,
  getVodPassMaxMonths,
  isVodPassSelected,
  supportsVodPassMonths,
  toVodPassRequestFields,
  VOD_PASS_MIN_MONTHS,
} from '@/domain/program/vodPassPurchase';
import dayjs from '@/lib/dayjs';

/** 스토어에 담는 VOD 이용권 선택 */
export type VodPassOrderSelection = Pick<
  MembershipOrderData,
  'vodPassProductId' | 'vodPassPrice' | 'vodPassDurationDays' | 'vodPassMonths'
>;

/**
 * 고를 수 있는 개월 범위로 맞춘 개월 수.
 * 추가 월 가격이 없는 응답은 개월 선택을 지원하지 않는 서버라 1개월로 고정한다.
 */
export function getSelectableVodPassMonths(
  product: MembershipVodPassProduct,
  months: number,
): number {
  if (!supportsVodPassMonths(product)) {
    return VOD_PASS_MIN_MONTHS;
  }
  return clampVodPassMonths(months, getVodPassMaxMonths(product));
}

/** 상품과 개월 수로 스토어에 담을 선택 값을 만든다 */
export function toVodPassOrderSelection(
  product: MembershipVodPassProduct,
  months: number,
): VodPassOrderSelection {
  const safeMonths = getSelectableVodPassMonths(product, months);
  return {
    vodPassProductId: product.id,
    vodPassPrice: calculateVodPassPrice(product, safeMonths),
    vodPassDurationDays: calculateVodPassDurationDays(product, safeMonths),
    vodPassMonths: safeMonths,
  };
}

type OrderAmountFields = Pick<
  MembershipOrderData,
  'price' | 'discount' | 'couponPrice' | 'vodPassPrice'
>;

/**
 * 결제 금액. 화면 합계·토스 결제 금액·서버로 보내는 amount 가 모두 이 값이다.
 * 서버 합계식과 같다: max(정가 - 할인 - 쿠폰, 0) + VOD 이용권. 쿠폰은 패스 금액에만 적용된다.
 */
export function getMembershipOrderTotal(data: OrderAmountFields): number {
  return calculateChallengeTotalWithVodPass({
    regularPrice: data.price,
    discount: data.discount,
    couponPrice: data.couponPrice,
    vodPassPrice: data.vodPassPrice,
  });
}

/**
 * 쿠폰·VOD 선택이 바뀔 때 함께 담을 결제 금액과 무료 여부.
 * VOD 를 담으면 서버가 paymentKey 를 요구하므로 무료 신청으로 처리하지 않는다.
 */
export function getMembershipOrderTotals(
  data: OrderAmountFields & VodPassOrderSelection,
): Pick<MembershipOrderData, 'totalPrice' | 'isFree'> {
  const totalPrice = getMembershipOrderTotal(data);
  return {
    totalPrice,
    isFree: totalPrice === 0 && !isVodPassSelected(data),
  };
}

/** 올인원패스 신청 생성 본문. VOD 미선택이면 VOD 필드를 하나도 넣지 않는다 */
export function buildMembershipApplicationBody(
  data: OrderAmountFields &
    VodPassOrderSelection &
    Pick<
      MembershipOrderData,
      'membershipPlanId' | 'couponCode' | 'contactEmail' | 'isFree'
    >,
  payment: {
    orderId: string;
    paymentKey: string | null;
  },
): CreateMembershipApplicationBody {
  return {
    membershipPlanId: data.membershipPlanId ?? 0,
    orderId: payment.orderId,
    amount: String(getMembershipOrderTotal(data)),
    paymentKey: data.isFree ? null : payment.paymentKey,
    couponCode: data.couponCode,
    contactEmail: data.contactEmail,
    ...toVodPassRequestFields(data),
  };
}

const formatDate = (date: string) => dayjs(date).format('YYYY.MM.DD');

/** 서버가 배정한 VOD 이용권 이용 기간. 응답에 기간이 없으면 null */
export function getVodPassResultPeriod(
  vodPass: PostApplicationResult['vodPass'],
): string | null {
  if (!vodPass?.startsAt || !vodPass.endsAt) {
    return null;
  }
  return `${formatDate(vodPass.startsAt)} ~ ${formatDate(vodPass.endsAt)}`;
}
