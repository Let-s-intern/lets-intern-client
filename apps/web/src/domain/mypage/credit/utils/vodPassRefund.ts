import type { VodPass } from '@/api/vodPass';

/**
 * 환불할 수 없는 이용권에 그 이유를 알려주는 문구 (LC-3438).
 * 환불할 수 있거나 이미 취소된 이용권은 문구가 없다(취소는 별도 배너가 보여준다).
 */
export function getVodPassRefundBlockedReason(pass: VodPass): string | null {
  if (pass.refundable || pass.status === 'CANCELED') {
    return null;
  }

  switch (pass.status) {
    case 'ACTIVE':
    case 'SCHEDULED':
    case 'EXPIRED':
      return '활성화한 이용권은 환불할 수 없습니다';
    default:
      return '현재 환불할 수 없는 이용권입니다';
  }
}

/**
 * 이용권 환불 실패 중 BE 가 사유를 문구로 내려주는 409 의 메시지.
 * (환불 결과 확인 중, 이미 취소됨 등) 그 밖의 실패는 null 이고 기존 실패 안내를 쓴다.
 *
 * axios 인터셉터가 응답 에러를 ApiError(status, serverMessage)로 감싸 던진다.
 */
export function getVodPassRefundErrorMessage(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const { status, serverMessage } = error as {
    status?: unknown;
    serverMessage?: unknown;
  };
  if (status !== 409 || typeof serverMessage !== 'string' || !serverMessage) {
    return null;
  }

  return serverMessage;
}
