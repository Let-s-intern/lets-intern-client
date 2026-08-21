import { readServerError } from './serverError';

/*
  `createAuthorizedAxios` 인터셉터가 axios 에러를 ApiError 로 **바꿔서** 던진다.
  그 객체에는 `response` 가 없고 code·message·serverMessage 가 최상위에 있다.

  이걸 모르고 `response.data.code` 를 읽으면 코드가 언제나 UNKNOWN 으로 읽혀
  에러코드 분기가 조용히 한 번도 타지 않는다. 실제로 그렇게 만들었다가 취소 화면에서
  "이미 취소된 라이브 멘토링 신청입니다" 대신 기본 문구가 뜨는 것을 보고 알아냈다.
*/
describe('readServerError', () => {
  it('인터셉터가 만든 ApiError 에서 코드와 문구를 읽는다', () => {
    const apiError = Object.assign(new Error('이미 취소된 라이브 멘토링 신청입니다.'), {
      code: 'LIVE_MENTORING_ALREADY_CANCELED',
      status: 409,
      serverMessage: '이미 취소된 라이브 멘토링 신청입니다.',
    });

    expect(readServerError(apiError)).toEqual({
      code: 'LIVE_MENTORING_ALREADY_CANCELED',
      message: '이미 취소된 라이브 멘토링 신청입니다.',
    });
  });

  /* 인터셉터를 타지 않는 경로가 생길 수 있어 원본 axios 형태도 함께 본다. */
  it('원본 axios 에러 형태도 읽는다', () => {
    expect(
      readServerError({
        response: {
          data: {
            code: 'LIVE_MENTORING_SLOT_UNAVAILABLE',
            message: '선택한 라이브 멘토링 슬롯을 예약할 수 없습니다.',
          },
        },
      }),
    ).toEqual({
      code: 'LIVE_MENTORING_SLOT_UNAVAILABLE',
      message: '선택한 라이브 멘토링 슬롯을 예약할 수 없습니다.',
    });
  });

  it('아무것도 없으면 넘긴 기본 문구를 쓴다', () => {
    expect(readServerError(new Error('Network Error'), '기본 문구')).toEqual({
      code: 'UNKNOWN',
      message: 'Network Error',
    });
    expect(readServerError(null, '기본 문구')).toEqual({
      code: 'UNKNOWN',
      message: '기본 문구',
    });
  });

  /*
    인터셉터는 서버 문구를 못 찾으면 "서버 오류가 발생했습니다." 를 넣는다.
    그건 사용자에게 아무것도 알려주지 않으므로 화면 문구로 쓰지 않는다.
  */
  it('인터셉터 자체 문구는 기본 문구로 바꾼다', () => {
    const apiError = Object.assign(new Error('서버 오류가 발생했습니다.'), {
      code: 'API_ERROR',
      status: 500,
    });

    expect(readServerError(apiError, '신청을 만들지 못했습니다.')).toEqual({
      code: 'API_ERROR',
      message: '신청을 만들지 못했습니다.',
    });
  });
});
