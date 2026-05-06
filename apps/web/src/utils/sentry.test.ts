import { extractHttpStatus } from './sentry';
import { ApiError } from '@letscareer/api';

describe('extractHttpStatus', () => {
  it('ApiError(packages/api)에서 status 추출', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED',
      message: 'VOD 조회에 실패했습니다.',
      status: 500,
      endpoint: '/vods/123',
      method: 'GET',
    });
    expect(extractHttpStatus(err)).toBe(500);
  });

  it('axios 스타일 에러(response.status)에서 status 추출', () => {
    const err = { response: { status: 404 }, message: 'Not Found' };
    expect(extractHttpStatus(err)).toBe(404);
  });

  it('커스텀 client 스타일(err.status)에서 status 추출', () => {
    const err = { status: 403, message: 'Forbidden' };
    expect(extractHttpStatus(err)).toBe(403);
  });

  it('plain Error는 undefined 반환', () => {
    const err = new Error('plain error');
    expect(extractHttpStatus(err)).toBeUndefined();
  });

  it('null은 undefined 반환', () => {
    expect(extractHttpStatus(null)).toBeUndefined();
  });

  it('string은 undefined 반환', () => {
    expect(extractHttpStatus('error')).toBeUndefined();
  });

  it('status=0 네트워크 에러도 추출', () => {
    const err = new ApiError({
      code: 'VOD_FETCH_FAILED_NETWORK',
      message: 'VOD 조회에 실패했습니다.',
      status: 0,
      endpoint: '/vods/123',
      method: 'GET',
    });
    expect(extractHttpStatus(err)).toBe(0);
  });
});
