import { describe, expect, it } from 'vitest';

import {
  BlogPopupFormValue,
  EMPTY_BLOG_POPUP_FORM,
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
