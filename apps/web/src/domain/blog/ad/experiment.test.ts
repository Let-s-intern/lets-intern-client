import {
  FALLBACK_TRIGGER_RATIO,
  parseBlogId,
  parseTriggerRatio,
} from './experiment';

describe('parseTriggerRatio', () => {
  it('정상 페이로드 → 해당 ratio', () => {
    expect(parseTriggerRatio({ ratio: 1.0 })).toBe(1.0);
    expect(parseTriggerRatio({ ratio: 0.6 })).toBe(0.6);
  });

  it('ratio 누락 → 0.6 폴백', () => {
    expect(parseTriggerRatio({})).toBe(FALLBACK_TRIGGER_RATIO);
  });

  it('페이로드 자체가 없음(undefined/null) → 0.6 폴백', () => {
    expect(parseTriggerRatio(undefined)).toBe(FALLBACK_TRIGGER_RATIO);
    expect(parseTriggerRatio(null)).toBe(FALLBACK_TRIGGER_RATIO);
  });

  it('ratio 타입 오류(문자열/NaN) → 0.6 폴백', () => {
    expect(parseTriggerRatio({ ratio: '1.0' })).toBe(FALLBACK_TRIGGER_RATIO);
    expect(parseTriggerRatio({ ratio: NaN })).toBe(FALLBACK_TRIGGER_RATIO);
  });

  it('범위 이탈(0 이하 / 1 초과) → 0.6 폴백', () => {
    expect(parseTriggerRatio({ ratio: 0 })).toBe(FALLBACK_TRIGGER_RATIO);
    expect(parseTriggerRatio({ ratio: -0.5 })).toBe(FALLBACK_TRIGGER_RATIO);
    expect(parseTriggerRatio({ ratio: 1.5 })).toBe(FALLBACK_TRIGGER_RATIO);
  });
});

describe('parseBlogId', () => {
  it('블로그 상세 경로에서 id(첫 세그먼트) 추출', () => {
    expect(parseBlogId('/blog/123/some-title')).toBe('123');
    expect(parseBlogId('/blog/abc')).toBe('abc');
  });

  it('블로그 경로가 아니거나 null이면 null', () => {
    expect(parseBlogId('/program/1')).toBeNull();
    expect(parseBlogId(null)).toBeNull();
    expect(parseBlogId('/blog')).toBeNull();
  });
});
