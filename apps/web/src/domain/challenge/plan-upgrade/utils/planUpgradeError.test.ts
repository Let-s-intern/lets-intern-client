// 패키지 entry(@letscareer/api) 는 env.ts 의 import.meta 때문에 jest 에서 로드되지 않는다.
// instanceof 검사가 실제 클래스를 보도록 errors 서브경로의 ApiError 를 entry 로 내보낸다.
import { ApiError } from '@letscareer/api/errors';
import { AxiosError, AxiosHeaders } from 'axios';

import { getPlanUpgradeServerError } from './planUpgradeError';

jest.mock('@letscareer/api', () => ({
  ApiError: jest.requireActual('@letscareer/api/errors').ApiError,
}));

const axiosError = (status: number, data: unknown) =>
  new AxiosError('Request failed', String(status), undefined, null, {
    status,
    statusText: '',
    data,
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  });

describe('getPlanUpgradeServerError', () => {
  it('ApiError 면 서버 코드와 문구를 준다', () => {
    const error = new ApiError({
      code: 'PLAN_UPGRADE_SAVE_FAILED',
      message: '플랜 업그레이드 처리에 실패했습니다.',
      status: 500,
      endpoint: '/plan-upgrade/7/confirm',
      method: 'POST',
      serverMessage: '플랜 업그레이드 처리에 실패했습니다.',
    });

    expect(getPlanUpgradeServerError(error)).toEqual({
      code: 'PLAN_UPGRADE_SAVE_FAILED',
      message: '플랜 업그레이드 처리에 실패했습니다.',
    });
  });

  it('감싸지 않은 AxiosError 면 응답 본문의 코드와 문구를 준다', () => {
    const error = axiosError(400, {
      code: 'PLAN_UPGRADE_AMOUNT_MISMATCH',
      message: '결제 금액이 올바르지 않습니다.',
    });

    expect(getPlanUpgradeServerError(error)).toEqual({
      code: 'PLAN_UPGRADE_AMOUNT_MISMATCH',
      message: '결제 금액이 올바르지 않습니다.',
    });
  });

  it('응답 본문이 없는 AxiosError 는 코드와 문구가 없다', () => {
    expect(getPlanUpgradeServerError(axiosError(502, undefined))).toEqual({
      code: undefined,
      message: undefined,
    });
  });

  it('axios 에러가 아니면 빈 객체다', () => {
    expect(getPlanUpgradeServerError(new Error('network down'))).toEqual({});
  });
});
