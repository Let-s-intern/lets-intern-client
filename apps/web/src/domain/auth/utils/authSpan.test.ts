import { runPasswordSigninSpan, emitSocialSigninSpan } from './authSpan';

type CapturedSpan = {
  name: string;
  op?: string;
  attributes: Record<string, unknown>;
};

const captured: CapturedSpan[] = [];

jest.mock('@sentry/nextjs', () => ({
  startSpan: jest.fn(
    (
      options: {
        name: string;
        op?: string;
        attributes?: Record<string, unknown>;
      },
      cb: (span: unknown) => unknown,
    ) => {
      const entry: CapturedSpan = {
        name: options.name,
        op: options.op,
        attributes: { ...(options.attributes ?? {}) },
      };
      captured.push(entry);
      const span = {
        setAttribute: (key: string, value: unknown) => {
          entry.attributes[key] = value;
        },
      };
      return cb(span);
    },
  ),
}));

describe('runPasswordSigninSpan', () => {
  beforeEach(() => {
    captured.length = 0;
  });

  it('성공 분기: name=auth.signin, op=auth, method=password, result=success, duration_ms 부착', async () => {
    const result = await runPasswordSigninSpan(async () => 'token-1');
    expect(result).toBe('token-1');
    expect(captured).toHaveLength(1);
    const span = captured[0];
    expect(span.name).toBe('auth.signin');
    expect(span.op).toBe('auth');
    expect(span.attributes['auth.method']).toBe('password');
    expect(span.attributes['auth.result']).toBe('success');
    expect(typeof span.attributes['auth.duration_ms']).toBe('number');
  });

  it('실패 분기: result=fail + error rethrow', async () => {
    const err = new Error('invalid');
    await expect(
      runPasswordSigninSpan(async () => {
        throw err;
      }),
    ).rejects.toBe(err);
    expect(captured).toHaveLength(1);
    const span = captured[0];
    expect(span.attributes['auth.method']).toBe('password');
    expect(span.attributes['auth.result']).toBe('fail');
    expect(typeof span.attributes['auth.duration_ms']).toBe('number');
  });
});

describe('emitSocialSigninSpan', () => {
  beforeEach(() => {
    captured.length = 0;
  });

  it('성공: method=social, result=success', () => {
    emitSocialSigninSpan({ result: 'success' });
    const span = captured[0];
    expect(span.name).toBe('auth.signin');
    expect(span.op).toBe('auth');
    expect(span.attributes['auth.method']).toBe('social');
    expect(span.attributes['auth.result']).toBe('success');
  });

  it('실패: provider/reason 포함, result=fail', () => {
    emitSocialSigninSpan({
      result: 'fail',
      provider: 'kakao',
      reason: 'duplicate-phone',
    });
    const span = captured[0];
    expect(span.attributes['auth.method']).toBe('social');
    expect(span.attributes['auth.result']).toBe('fail');
    expect(span.attributes.provider).toBe('kakao');
    expect(span.attributes.reason).toBe('duplicate-phone');
  });

  it('provider/reason 없으면 attribute 미부착', () => {
    emitSocialSigninSpan({ result: 'success' });
    const span = captured[0];
    expect(span.attributes.provider).toBeUndefined();
    expect(span.attributes.reason).toBeUndefined();
  });
});
