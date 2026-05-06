import { emitBlogRecommendFallbackSpan } from './blogFallbackSpan';
import { ApiError } from '@letscareer/api';

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
      captured.push({
        name: options.name,
        op: options.op,
        attributes: { ...(options.attributes ?? {}) },
      });
      return cb({ setAttribute: () => {} });
    },
  ),
}));

describe('emitBlogRecommendFallbackSpan', () => {
  beforeEach(() => {
    captured.length = 0;
  });

  it('blogRecommendList catch: name=blog.recommend.fallback, op=app.fallback, section/fallbackReason 부착', () => {
    const err = new ApiError({
      code: 'BLOG_FETCH_FAILED',
      message: '실패',
      status: 500,
      endpoint: '/blog/1',
      method: 'GET',
    });
    emitBlogRecommendFallbackSpan({ section: 'blogRecommendList', err });

    expect(captured).toHaveLength(1);
    const span = captured[0];
    expect(span.name).toBe('blog.recommend.fallback');
    expect(span.op).toBe('app.fallback');
    expect(span.attributes.section).toBe('blogRecommendList');
    expect(span.attributes.fallbackReason).toBe('ApiError');
  });

  it('programRecommendList catch: section=programRecommendList', () => {
    emitBlogRecommendFallbackSpan({
      section: 'programRecommendList',
      err: new TypeError('failed'),
    });
    expect(captured[0].attributes.section).toBe('programRecommendList');
    expect(captured[0].attributes.fallbackReason).toBe('TypeError');
  });

  it('Error 인스턴스 아님 → fallbackReason=unknown', () => {
    emitBlogRecommendFallbackSpan({
      section: 'blogRecommendList',
      err: 'string error',
    });
    expect(captured[0].attributes.fallbackReason).toBe('unknown');
  });
});
