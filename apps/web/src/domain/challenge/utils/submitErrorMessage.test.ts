import { AxiosError, AxiosHeaders } from 'axios';
import {
  getSubmitErrorMessage,
  SUBMIT_ERROR_FALLBACK,
} from './submitErrorMessage';

const axiosError = (status: number, data: unknown) =>
  new AxiosError('Request failed', String(status), undefined, null, {
    status,
    statusText: '',
    data,
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  });

describe('getSubmitErrorMessage', () => {
  // 기간 때문에 막힌 것이라 다시 시도해도 절대 되지 않는다.
  // "다시 시도해주세요" 를 띄우면 사용자가 헛수고를 반복한다.
  it('서버가 내려준 message 를 그대로 보여준다', () => {
    const error = axiosError(400, {
      status: 400,
      code: 'ATTENDANCE_NOT_AVAILABLE_DATE',
      message: '출석 제출이 불가능한 기간입니다',
    });

    expect(getSubmitErrorMessage(error)).toBe(
      '출석 제출이 불가능한 기간입니다',
    );
  });

  it('OT 선행 검증 메시지도 그대로 보여준다', () => {
    const error = axiosError(400, {
      code: 'ATTENDANCE_OT_REQUIRED',
      message: '0회차 미션을 먼저 완료해주세요',
    });

    expect(getSubmitErrorMessage(error)).toBe('0회차 미션을 먼저 완료해주세요');
  });

  it.each([
    ['message 가 없으면', axiosError(500, { status: 500, code: 'ERROR' })],
    ['message 가 빈 문자열이면', axiosError(400, { message: '   ' })],
    ['message 가 문자열이 아니면', axiosError(400, { message: { ko: 'x' } })],
    ['응답 본문이 없으면', axiosError(502, undefined)],
    ['axios 에러가 아니면', new Error('network down')],
    ['에러가 아닌 값이면', 'oops'],
  ])('%s 기존 일반 문구로 떨어진다', (_, error) => {
    expect(getSubmitErrorMessage(error)).toBe(SUBMIT_ERROR_FALLBACK);
  });
});
