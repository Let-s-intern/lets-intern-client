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

/**
 * `vodPassPrice`·`vodPassDurationDays` 는 선택한 개월 수 기준의 총액·총일수다.
 * `vodPassMonths` 는 개월 선택이 생기기 전에 persist 된 상태에서는 없고, 그때는 1개월이다.
 */
export interface VodPassSelection {
  vodPassProductId?: Amount;
  vodPassPrice?: Amount;
  vodPassDurationDays?: Amount;
  vodPassMonths?: Amount;
}

export interface VodPassRequestFields {
  vodPassProductId: number;
  vodPassExpectedPrice: number;
  vodPassExpectedDurationDays: number;
  vodPassMonths: number;
}

export interface VodPassProductPricing {
  price: number;
  additionalMonthPrice?: Amount;
  durationDays: number;
  maxPurchaseMonths?: Amount;
  availableMonths?: Amount;
}

export const VOD_PASS_MIN_MONTHS = 1;
/**
 * 서버가 상한을 내려주지 않을 때 쓰는 기본 상한이다. 서버의 기본 1회 상한(3개월)과 같다.
 * 상한은 어드민이 정하고 서버가 `availableMonths`·`maxPurchaseMonths` 로 내려준다.
 */
export const VOD_PASS_MAX_MONTHS = 3;

/**
 * 이 사용자가 고를 수 있는 최대 개월 수. 서버가 사용자별로 계산한 `availableMonths` 를 우선하고,
 * 없으면 1회 상한, 그것도 없으면 기본 상한이다. 최소 1개월은 보장한다.
 */
export function getVodPassMaxMonths(
  product: Pick<VodPassProductPricing, 'maxPurchaseMonths' | 'availableMonths'>,
): number {
  const limit = product.availableMonths ?? product.maxPurchaseMonths;
  if (typeof limit !== 'number' || !Number.isFinite(limit)) {
    return VOD_PASS_MAX_MONTHS;
  }
  return Math.max(Math.trunc(limit), VOD_PASS_MIN_MONTHS);
}

/** 이 사용자가 지금 더 살 수 있는가. 서버가 구매 가능 개월 수를 0 으로 주면 보유 기간이 누적 상한에 찬 것이다. */
export function isVodPassPurchasable(
  product: Pick<VodPassProductPricing, 'availableMonths'>,
): boolean {
  return product.availableMonths !== 0;
}

/** 개월 수를 화면 범위(1 이상 상한 이하의 정수)로 맞춘다. */
export function clampVodPassMonths(
  months: number,
  maxMonths: number = VOD_PASS_MAX_MONTHS,
): number {
  if (!Number.isFinite(months)) {
    return VOD_PASS_MIN_MONTHS;
  }
  return Math.min(
    Math.max(Math.trunc(months), VOD_PASS_MIN_MONTHS),
    Math.max(maxMonths, VOD_PASS_MIN_MONTHS),
  );
}

/**
 * 개월 선택을 지원하는 서버인가. 추가 월 가격이 응답에 없으면 이전 서버라 1개월만 판다.
 * (이전 서버는 vodPassMonths 를 모르므로 보내도 금액 검증에서 거절된다.)
 */
export function supportsVodPassMonths(
  product: Pick<VodPassProductPricing, 'additionalMonthPrice'>,
): boolean {
  return typeof product.additionalMonthPrice === 'number';
}

/** 이용권 금액. 서버: `price + additionalMonthPrice * (months - 1)` */
export function calculateVodPassPrice(
  product: VodPassProductPricing,
  months: number,
): number {
  const safeMonths = clampVodPassMonths(months, getVodPassMaxMonths(product));
  return product.price + (product.additionalMonthPrice ?? 0) * (safeMonths - 1);
}

/** 총 이용일수. 서버: `durationDays * months` */
export function calculateVodPassDurationDays(
  product: Pick<
    VodPassProductPricing,
    'durationDays' | 'maxPurchaseMonths' | 'availableMonths'
  >,
  months: number,
): number {
  return (
    product.durationDays *
    clampVodPassMonths(months, getVodPassMaxMonths(product))
  );
}

/**
 * 결제 합계. 쿠폰·올인원패스 할인을 뺀 뒤(0 바닥) 이용권 가격을 더한다.
 * 이용권을 고르지 않았으면 이전 계산식(`정가 <= 할인+쿠폰 ? 0 : 정가 - 할인 - 쿠폰`)과 결과가 같다.
 */
export function calculateChallengeTotalWithVodPass({
  regularPrice,
  discount,
  couponPrice,
  vodPassPrice,
  membershipDiscount,
}: {
  regularPrice?: Amount;
  discount?: Amount;
  couponPrice?: Amount;
  vodPassPrice?: Amount;
  membershipDiscount?: Amount;
}): number {
  const afterCoupon = Math.max(
    (regularPrice ?? 0) -
      (discount ?? 0) -
      (couponPrice ?? 0) -
      (membershipDiscount ?? 0),
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
 * 서버는 네 값 중 하나라도 있으면 전부 요구하므로, 미선택이면 네 필드를 모두 내보내지 않는다.
 */
export function toVodPassRequestFields(
  selection: VodPassSelection,
): Partial<VodPassRequestFields> {
  if (!isVodPassSelected(selection)) {
    return {};
  }

  // 개월 선택 전에 담긴 선택은 단일 월 금액이라 1개월로 보내야 서버 계산과 맞는다
  const months = selection.vodPassMonths ?? 0;

  return {
    vodPassProductId: selection.vodPassProductId ?? 0,
    vodPassExpectedPrice: selection.vodPassPrice ?? 0,
    vodPassExpectedDurationDays: selection.vodPassDurationDays ?? 0,
    vodPassMonths: months > 0 ? months : VOD_PASS_MIN_MONTHS,
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
