import { AppError, ApiError, AuthError, SchemaParseError } from './errors';

describe('AppError', () => {
  it('message와 displayMessage가 동일하다', () => {
    const err = new AppError({ code: 'TEST', message: '테스트 에러' });
    expect(err.message).toBe('테스트 에러');
    expect(err.displayMessage).toBe('테스트 에러');
  });

  it('name이 클래스명으로 보존된다', () => {
    const err = new AppError({ code: 'TEST', message: '테스트' });
    expect(err.name).toBe('AppError');
  });

  it('code가 설정된다', () => {
    const err = new AppError({ code: 'VOD_FETCH_FAILED', message: '에러' });
    expect(err.code).toBe('VOD_FETCH_FAILED');
  });

  it('cause chain이 보존된다', () => {
    const cause = new Error('원본 에러');
    const err = new AppError({ code: 'TEST', message: '래핑된 에러', cause });
    expect(err.cause).toBe(cause);
  });

  it('context 미전달 시 빈 객체', () => {
    const err = new AppError({ code: 'TEST', message: '에러' });
    expect(err.context).toEqual({});
  });

  it('context가 전달되면 그대로 보존된다', () => {
    const err = new AppError({
      code: 'TEST',
      message: '에러',
      context: { vodId: 123 },
    });
    expect(err.context).toEqual({ vodId: 123 });
  });

  it('status가 설정된다', () => {
    const err = new AppError({ code: 'TEST', message: '에러', status: 500 });
    expect(err.status).toBe(500);
  });

  it('AppError instanceof Error', () => {
    const err = new AppError({ code: 'TEST', message: '에러' });
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });
});

describe('ApiError', () => {
  const opts = {
    code: 'API_FAIL',
    message: 'API 실패',
    status: 500,
    endpoint: '/api/test',
    method: 'GET',
  };

  it('name이 ApiError로 보존된다', () => {
    const err = new ApiError(opts);
    expect(err.name).toBe('ApiError');
  });

  it('endpoint와 method가 설정된다', () => {
    const err = new ApiError(opts);
    expect(err.endpoint).toBe('/api/test');
    expect(err.method).toBe('GET');
  });

  it('serverMessage가 설정된다', () => {
    const err = new ApiError({ ...opts, serverMessage: '서버 에러 메시지' });
    expect(err.serverMessage).toBe('서버 에러 메시지');
  });

  it('ApiError instanceof AppError', () => {
    const err = new ApiError(opts);
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(ApiError);
  });

  it('cause chain이 보존된다', () => {
    const cause = new Error('원인');
    const err = new ApiError({ ...opts, cause });
    expect(err.cause).toBe(cause);
  });
});

describe('SchemaParseError', () => {
  it('name이 SchemaParseError로 보존된다', () => {
    const err = new SchemaParseError({ code: 'PARSE_FAIL', message: '파싱 실패' });
    expect(err.name).toBe('SchemaParseError');
  });

  it('SchemaParseError instanceof AppError', () => {
    const err = new SchemaParseError({ code: 'PARSE_FAIL', message: '에러' });
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(SchemaParseError);
  });
});

describe('AuthError', () => {
  const opts = {
    code: 'AUTH_FAIL',
    message: '인증 실패',
    status: 401,
    endpoint: '/api/login',
    method: 'POST',
  };

  it('name이 AuthError로 보존된다', () => {
    const err = new AuthError(opts);
    expect(err.name).toBe('AuthError');
  });

  it('AuthError instanceof ApiError와 AppError', () => {
    const err = new AuthError(opts);
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(AuthError);
  });
});
