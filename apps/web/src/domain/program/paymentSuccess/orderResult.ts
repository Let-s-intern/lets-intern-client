import type { PostApplicationInterface } from '@/api/application';
import {
  toVodPassRequestFields,
  type VodPassSelection,
} from '@/domain/program/vodPassPurchase';

/** 주문 생성 요청에 쓰는 신청 폼 스토어 값 */
export interface OrderRequestForm extends VodPassSelection {
  couponId: string | null;
  priceId: number | null;
  isFree: boolean | null;
  totalPrice: number | null;
  contactEmail: string | null;
  question: string | null;
}

/** Toss 가 successUrl 쿼리로 넘겨준 값 */
export interface OrderResultParams {
  orderId: string;
  paymentKey?: string | null;
  amount?: number | null;
}

/**
 * `POST /application/{programId}` 요청 본문.
 * `amount` 는 Toss 쿼리 값을 그대로 쓴다. 이용권이 이미 합산된 금액이라 여기서 다시 더하지 않는다.
 * 이용권은 선택했을 때만 필드 세 개를 모두 넣는다.
 */
export function buildPostApplicationBody(
  form: OrderRequestForm,
  params: OrderResultParams,
): PostApplicationInterface {
  const isFree = form.isFree === true;

  return {
    paymentInfo: {
      couponId: form.couponId ? Number(form.couponId) : null,
      priceId: form.priceId ?? -1,
      paymentKey: isFree || !params.paymentKey ? null : params.paymentKey,
      orderId: params.orderId,
      amount:
        isFree || !params.amount
          ? (form.totalPrice?.toString() ?? '0')
          : (params.amount?.toString() ?? '0'),
    },
    contactEmail: form.contactEmail ?? '',
    motivate: '',
    question: form.question ?? '',
    ...toVodPassRequestFields(form),
  };
}

export const VOD_PASS_PRODUCT_CHANGED_MESSAGE =
  'VOD 이용권 가격·기간이 변경되었으니 다시 선택해 주세요';
export const PAYMENT_ORDER_CONFLICT_MESSAGE =
  '이미 처리된 주문과 정보가 다릅니다. 결제 내역을 확인해 주세요';

/**
 * 주문 생성 실패 사유별 안내 문구. 구분할 수 없는 실패는 null 이고 기존 실패 화면을 그대로 쓴다.
 *
 * - 409 VOD_PASS_PRODUCT_CHANGED: PG 승인 전 검증이라 결제되지 않았다.
 * - 409 PAYMENT_ORDER_CONFLICT: 같은 주문번호가 다른 정보로 이미 처리돼 있다. 결제 여부를 확인해야 한다.
 *
 * axios 인터셉터가 응답 에러를 ApiError(status, code)로 감싸 던진다.
 */
export function getOrderErrorMessage(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const { status, code } = error as { status?: unknown; code?: unknown };
  if (status !== 409) {
    return null;
  }

  if (code === 'VOD_PASS_PRODUCT_CHANGED') {
    return VOD_PASS_PRODUCT_CHANGED_MESSAGE;
  }
  if (code === 'PAYMENT_ORDER_CONFLICT') {
    return PAYMENT_ORDER_CONFLICT_MESSAGE;
  }
  return null;
}
