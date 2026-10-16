import type { PostApplicationResult } from '@/api/application';
import dayjs from '@/lib/dayjs';

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

/** 상품이 바뀌어 주문이 거절됐는가. 이때는 신청폼을 다시 받아야 최신 이용권 정보가 보인다. */
export function isVodPassProductChangedError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const { status, code } = error as { status?: unknown; code?: unknown };
  return status === 409 && code === 'VOD_PASS_PRODUCT_CHANGED';
}

const formatDate = (date: string) => dayjs(date).format('YYYY.MM.DD');

/**
 * 결제 성공 화면에 보여줄 이용권 이용 안내.
 * 서버가 배정한 기간(`ACTIVE` 면 즉시 시작, `SCHEDULED` 면 앞선 이용 종료 뒤 시작)을 그대로 쓴다.
 * 기간을 알 수 없으면 마이페이지에서 확인하도록만 안내한다.
 */
export function getVodPassResultNotice(
  vodPass: PostApplicationResult['vodPass'],
): string {
  const fallback =
    'VOD 이용권이 결제되었습니다. 이용 기간은 마이페이지 결제 내역에서 확인할 수 있습니다';

  if (!vodPass?.startsAt || !vodPass.endsAt) {
    return fallback;
  }

  const period = `${formatDate(vodPass.startsAt)} ~ ${formatDate(vodPass.endsAt)}`;
  switch (vodPass.status) {
    case 'ACTIVE':
      return `VOD 이용권을 지금부터 이용할 수 있습니다. 이용 기간은 ${period} 입니다`;
    case 'SCHEDULED':
      return `이미 이용 중인 이용권이 있어 ${formatDate(vodPass.startsAt)}부터 VOD 이용권 이용이 시작됩니다. 이용 기간은 ${period} 입니다`;
    default:
      return fallback;
  }
}
