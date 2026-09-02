import { describe, expect, it } from 'vitest';

import {
  BlogPopupFormValue,
  EMPTY_BLOG_POPUP_FORM,
  formatPriority,
  MAX_PRIORITY,
  MIN_PRIORITY,
  PRIORITY_OPTIONS,
  toBlogIdsPayload,
  validateBlogPopupForm,
} from './blogPopupForm';

const filled: BlogPopupFormValue = {
  ...EMPTY_BLOG_POPUP_FORM,
  title: '팝업 제목',
  imageUrl: 'https://cdn.test/popup.png',
  link: 'https://letscareer.co.kr/live-mentoring',
  startDate: '2026-09-01T00:00:00',
  endDate: '2026-09-30T23:59:00',
};

describe('validateBlogPopupForm', () => {
  it('필수값이 다 차 있으면 통과한다', () => {
    expect(validateBlogPopupForm(filled)).toBeNull();
  });

  it.each([
    ['title', ''],
    ['imageUrl', ''],
    ['link', ''],
    ['startDate', ''],
    ['endDate', ''],
  ] as const)('%s 가 비면 문구를 돌려준다', (key, empty) => {
    expect(validateBlogPopupForm({ ...filled, [key]: empty })).not.toBeNull();
  });

  it('특정 글 선택인데 고른 글이 없으면 막는다', () => {
    expect(
      validateBlogPopupForm({ ...filled, targetType: 'SELECTED', blogIds: [] }),
    ).toBe('노출할 글을 한 개 이상 선택해주세요');
  });

  it('링크가 겹쳐도 막지 않는다', () => {
    // 중복이 허용된 요구사항이다 (PRD R6). 검사를 넣으면 회귀다.
    expect(validateBlogPopupForm({ ...filled, link: filled.link })).toBeNull();
  });
});

describe('toBlogIdsPayload', () => {
  it('전체 노출이면 남아 있던 선택을 보내지 않는다', () => {
    expect(
      toBlogIdsPayload({ ...filled, targetType: 'ALL', blogIds: [1, 2] }),
    ).toEqual([]);
  });

  it('특정 글 선택이면 고른 글을 그대로 보낸다', () => {
    expect(
      toBlogIdsPayload({ ...filled, targetType: 'SELECTED', blogIds: [1, 2] }),
    ).toEqual([1, 2]);
  });
});

describe('우선순위 기본값', () => {
  it('새 폼의 우선순위는 없음이다', () => {
    expect(EMPTY_BLOG_POPUP_FORM.priority).toBeNull();
  });
});

describe('PRIORITY_OPTIONS', () => {
  it('1 부터 99 까지다', () => {
    expect(PRIORITY_OPTIONS).toHaveLength(99);
    expect(PRIORITY_OPTIONS[0]).toBe(MIN_PRIORITY);
    expect(PRIORITY_OPTIONS[PRIORITY_OPTIONS.length - 1]).toBe(MAX_PRIORITY);
  });
});

describe('formatPriority', () => {
  it('값이 없으면 없음으로 적는다', () => {
    // 빈 칸은 반대 의미로 읽힌다 (.claude/rules/writing.md)
    expect(formatPriority(null)).toBe('없음');
    expect(formatPriority(undefined)).toBe('없음');
  });

  it('숫자는 그대로 적는다', () => {
    expect(formatPriority(1)).toBe('1');
    expect(formatPriority(99)).toBe('99');
  });
});
