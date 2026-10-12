/**
 * 챌린지 결제에 함께 담는 VOD 이용권(LC-3438)의 합계·선택·요청 필드 계산.
 *
 * 서버 합계식은 쿠폰 적용 뒤에 이용권 금액을 더한다.
 *
 *   amount = max(정가 - 할인 - 쿠폰, 0) + 이용권 가격
 *
 * 이용권 금액을 정가·할인에 합치면 쿠폰이 이용권까지 깎아 서버가 INVALID_PRICE 로 결제를 거절한다.
 * 화면에 보이는 합계와 서버로 보내는 amount 는 반드시 이 파일의 함수 하나에서 나와야 한다.
 */

/** 스토어에 persist 된 이전 상태는 이용권 필드가 undefined 라 null·undefined 를 0 으로 본다. */
type Amount = number | null | undefined;

export interface VodPassSelection {
  vodPassProductId?: Amount;
  vodPassPrice?: Amount;
  vodPassDurationDays?: Amount;
}

export interface VodPassRequestFields {
  vodPassProductId: number;
  vodPassExpectedPrice: number;
  vodPassExpectedDurationDays: number;
}

/**
 * 결제 합계. 쿠폰 적용 뒤(0 바닥) 이용권 가격을 더한다.
 * 이용권을 고르지 않았으면 이전 계산식(`정가 <= 할인+쿠폰 ? 0 : 정가 - 할인 - 쿠폰`)과 결과가 같다.
 */
export function calculateChallengeTotalWithVodPass({
  regularPrice,
  discount,
  couponPrice,
  vodPassPrice,
}: {
  regularPrice?: Amount;
  discount?: Amount;
  couponPrice?: Amount;
  vodPassPrice?: Amount;
}): number {
  const afterCoupon = Math.max(
    (regularPrice ?? 0) - (discount ?? 0) - (couponPrice ?? 0),
    0,
  );
  return afterCoupon + (vodPassPrice ?? 0);
}

/** 이용권을 골랐는가. 상품 ID 가 0 이하이면 미선택이다. */
export function isVodPassSelected(selection: VodPassSelection): boolean {
  return (selection.vodPassProductId ?? 0) > 0;
}

/**
 * 주문 생성 요청 본문에 합칠 이용권 필드.
 * 서버는 세 값 중 하나라도 있으면 전부 요구하므로, 미선택이면 세 필드를 모두 내보내지 않는다.
 */
export function toVodPassRequestFields(
  selection: VodPassSelection,
): Partial<VodPassRequestFields> {
  if (!isVodPassSelected(selection)) {
    return {};
  }

  return {
    vodPassProductId: selection.vodPassProductId ?? 0,
    vodPassExpectedPrice: selection.vodPassPrice ?? 0,
    vodPassExpectedDurationDays: selection.vodPassDurationDays ?? 0,
  };
}

/** Toss requestPayment 의 orderName 최대 길이 */
const ORDER_NAME_MAX_LENGTH = 100;
const VOD_PASS_ORDER_NAME_SUFFIX = ' + VOD 이용권';

/**
 * Toss 결제창에 보이는 주문명. 이용권을 담았으면 이름 뒤에 ` + VOD 이용권` 을 붙이되
 * 길이 제한(100자)을 넘지 않도록 프로그램 이름을 자른다. 미선택이면 이름 그대로다.
 */
export function getOrderName(
  programTitle: string | null | undefined,
  selection: VodPassSelection,
): string {
  const title = programTitle ?? '';
  if (!isVodPassSelected(selection)) {
    return title;
  }

  const maxTitleLength =
    ORDER_NAME_MAX_LENGTH - VOD_PASS_ORDER_NAME_SUFFIX.length;
  return `${title.slice(0, maxTitleLength)}${VOD_PASS_ORDER_NAME_SUFFIX}`;
}
