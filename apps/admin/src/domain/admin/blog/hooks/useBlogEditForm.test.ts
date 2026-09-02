import { describe, expect, it } from 'vitest';

import { parseInitialContent } from './useBlogEditForm';

/**
 * 수정 화면은 content 를 JSON 으로 읽는다. 파싱이 던지면 useMemo 안에서 터지고,
 * 이 라우트에는 errorElement 가 없어 어드민 화면 전체가 죽는다. 그러면 그 글은
 * 어드민에서 되살릴 방법이 없어진다 — 고치려면 수정 화면에 들어가야 하기 때문이다.
 */
function blogWith(content: string | null) {
  return {
    blogDetailInfo: { content },
    tagDetailInfos: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe('parseInitialContent', () => {
  it('JSON 이 아닌 content 여도 던지지 않고 원문을 렉시컬로 넘긴다', () => {
    const result = parseInitialContent(blogWith('<p>본문.</p>'));

    expect(result.lexical).toBe('<p>본문.</p>');
    expect(result.blogRecommend).toHaveLength(4);
    expect(result.programRecommend).toHaveLength(4);
  });

  it('신버전 content(blogRecommend 포함)는 그대로 돌려준다', () => {
    const stored = {
      lexical: '{"root":{}}',
      blogRecommend: [1, null, null, null],
      programRecommend: [],
    };

    expect(parseInitialContent(blogWith(JSON.stringify(stored)))).toEqual(
      stored,
    );
  });

  it('구버전 content(렉시컬 JSON 단독)는 렉시컬로 넘긴다', () => {
    const lexical = '{"root":{"children":[]}}';

    const result = parseInitialContent(blogWith(lexical));

    expect(result.lexical).toBe(lexical);
    expect(result.blogRecommend).toHaveLength(4);
  });

  it('content 가 비어 있으면 빈 추천 슬롯만 돌려준다', () => {
    for (const empty of ['', null]) {
      const result = parseInitialContent(blogWith(empty));

      expect(result.lexical).toBeUndefined();
      expect(result.blogRecommend).toHaveLength(4);
    }
  });

  it('JSON 이지만 객체가 아닌 content 도 던지지 않는다', () => {
    // "123" 이나 "null" 은 파싱은 되지만 in 연산자를 쓰면 터진다.
    for (const scalar of ['123', 'null', '"문자열"']) {
      expect(() => parseInitialContent(blogWith(scalar))).not.toThrow();
      expect(parseInitialContent(blogWith(scalar)).lexical).toBe(scalar);
    }
  });
});
