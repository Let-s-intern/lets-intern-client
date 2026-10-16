import type { VodPass } from '@/api/vodPass';
import dayjs from '@/lib/dayjs';

/**
 * 환불할 수 없는 이용권에 그 이유를 알려주는 문구 (LC-3438).
 * 환불할 수 있거나 이미 취소된 이용권은 문구가 없다(취소는 별도 배너가 보여준다).
 *
 * 환불은 이용 시작 전(`UNACTIVATED`, `SCHEDULED`)에만 된다. 그 두 상태가 환불 불가인 것은
 * 결제 정보가 없거나 서버가 막은 경우라 이유를 특정하지 않는다.
 */
export function getVodPassRefundBlockedReason(pass: VodPass): string | null {
  if (pass.refundable || pass.status === 'CANCELED') {
    return null;
  }

  switch (pass.status) {
    case 'ACTIVE':
      return '이용이 시작된 이용권은 환불할 수 없습니다';
    case 'EXPIRED':
      return '이용 기간이 종료된 이용권은 환불할 수 없습니다';
    default:
      return '현재 환불할 수 없는 이용권입니다';
  }
}

/**
 * 이용권 환불 실패 중 BE 가 사유를 문구로 내려주는 경우의 메시지.
 * 409(환불 결과 확인 중, 이미 취소됨 등)와 400 `APPLICATION_CANNOT_CANCELED`(0원·결제 없음 등)가
 * 해당한다. 그 밖의 실패는 null 이고 기존 실패 안내를 쓴다.
 *
 * axios 인터셉터가 응답 에러를 ApiError(status, code, serverMessage)로 감싸 던진다.
 */
export function getVodPassRefundErrorMessage(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const { status, code, serverMessage } = error as {
    status?: unknown;
    code?: unknown;
    serverMessage?: unknown;
  };
  const isExplained =
    status === 409 ||
    (status === 400 && code === 'APPLICATION_CANNOT_CANCELED');
  if (!isExplained || typeof serverMessage !== 'string' || !serverMessage) {
    return null;
  }

  return serverMessage;
}

/**
 * 이 이용권 뒤에 예약된 이용권이 있는가.
 * 앞선 이용권을 환불해도 뒤 이용권의 시작일은 앞당겨지지 않아 환불 전에 알려야 한다.
 */
export function hasLaterVodPass(pass: VodPass, passes: VodPass[]): boolean {
  if (!pass.endsAt) {
    return false;
  }

  const end = dayjs(pass.endsAt);
  return passes.some(
    (other) =>
      other.applicationId !== pass.applicationId &&
      other.status !== 'CANCELED' &&
      other.startsAt != null &&
      !dayjs(other.startsAt).isBefore(end),
  );
}
