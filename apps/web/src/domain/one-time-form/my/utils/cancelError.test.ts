import { ApiError } from '@letscareer/api/errors';
import { resolveCancelError } from './cancelError';

const apiError = (status: number, code: string, message = '') =>
  new ApiError({
    status,
    code,
    message,
    endpoint: '/application/1042',
    method: 'DELETE',
  });

describe('resolveCancelError (계약 U5 에러 표)', () => {
  it('401 UNAUTHORIZED 는 로그인으로 보낸다', () => {
    expect(resolveCancelError(apiError(401, 'UNAUTHORIZED'))).toEqual({
      type: 'LOGIN',
    });
  });

  it('403 도 로그인 필요로 본다', () => {
    expect(resolveCancelError(apiError(403, 'API_ERROR')).type).toBe('LOGIN');
  });

  it('400 APPLICATION_CANNOT_CANCELED 는 마감 안내 후 U2 를 다시 부른다', () => {
    expect(
      resolveCancelError(
        apiError(
          400,
          'APPLICATION_CANNOT_CANCELED',
          '환불이 불가능한 기간입니다.',
        ),
      ),
    ).toEqual({
      type: 'REFETCH',
      message: '취소 기간이 지나 직접 취소할 수 없어요.',
    });
  });

  it('409 APPLICATION_ALREADY_CANCELED 는 U2 를 다시 불러 취소 상태를 보인다', () => {
    expect(
      resolveCancelError(apiError(409, 'APPLICATION_ALREADY_CANCELED')),
    ).toEqual({ type: 'REFETCH', message: '이미 취소한 신청이에요.' });
  });

  it('404 와 네트워크 실패는 다시 시도할 수 있는 일반 안내', () => {
    const retry = {
      type: 'RETRY',
      message: '취소하지 못했어요. 잠시 후 다시 시도해 주세요.',
    };
    expect(resolveCancelError(apiError(404, 'APPLICATION_NOT_FOUND'))).toEqual(
      retry,
    );
    expect(resolveCancelError(new Error('Network Error'))).toEqual(retry);
  });
});
