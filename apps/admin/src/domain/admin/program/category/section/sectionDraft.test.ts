import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/axios', () => ({ default: {} }));

import {
  describeCondition,
  fromSection,
  newSection,
  sectionError,
  toSectionInput,
  withCardStyle,
} from './sectionDraft';

const titles: Record<number, string> = { 1: '자기소개서', 2: '포트폴리오' };
const titleOf = (id: number) => titles[id] ?? `#${id}`;

describe('섹션 초안', () => {
  it('조건을 한 줄로 쓴다', () => {
    expect(
      describeCondition(
        { tagIds: [2], matchMode: 'ALL', targetTypes: ['CHALLENGE'] },
        titleOf,
      ),
    ).toBe('포트폴리오 · 챌린지');
    expect(
      describeCondition(
        { tagIds: [1, 2], matchMode: 'ANY', targetTypes: ['VOD'] },
        titleOf,
      ),
    ).toBe('자기소개서 또는 포트폴리오 · VOD 클래스');
    expect(
      describeCondition(
        { tagIds: [1, 2], matchMode: 'ALL', targetTypes: [] },
        titleOf,
      ),
    ).toBe('자기소개서 그리고 포트폴리오 · 모든 유형');
  });

  it('예전 카드 모양은 바꾸지 않으면 그대로, 바꾸면 FEATURED/CARDS 로', () => {
    const legacy = fromSection({
      id: 3,
      title: '멘토',
      tagIds: [1],
      targetTypes: ['LIVE_MENTORING'],
      sortOrder: 0,
      isVisible: true,
      displayType: 'MENTOR',
      matchMode: 'ANY',
    });
    expect(withCardStyle(legacy, 'CARDS').displayType).toBe('MENTOR');
    expect(withCardStyle(legacy, 'FEATURED').displayType).toBe('FEATURED');
    expect(
      withCardStyle(withCardStyle(legacy, 'FEATURED'), 'CARDS').displayType,
    ).toBe('CARDS');
  });

  it('큰 카드가 아니면 고정 상품을 보내지 않는다', () => {
    const d = {
      ...newSection(1),
      displayType: 'CARDS' as const,
      pinnedTargetType: 'CHALLENGE' as const,
      pinnedTargetId: 9,
    };
    expect(toSectionInput(d)).toMatchObject({
      pinnedTargetType: null,
      pinnedTargetId: null,
    });
    expect(toSectionInput({ ...d, displayType: 'FEATURED' })).toMatchObject({
      pinnedTargetType: 'CHALLENGE',
      pinnedTargetId: 9,
    });
    expect(toSectionInput(d)).not.toHaveProperty('key');
  });

  it('제목이 있고, 태그 조건이나 직접 고른 상품 중 하나는 있어야 한다', () => {
    expect(sectionError({ ...newSection(1), title: ' ' })).toBeDefined();
    expect(sectionError({ ...newSection(1), tagIds: [] })).toBeDefined();
    expect(
      sectionError({
        ...newSection(1),
        tagIds: [],
        targetList: [{ targetType: 'VOD', targetId: 3 }],
      }),
    ).toBeUndefined();
    expect(sectionError(newSection(1))).toBeUndefined();
  });

  it('직접 고른 상품은 순서대로 보내고, 태그가 없으면 조건 없음으로 적는다', () => {
    const d = {
      ...newSection(1),
      tagIds: [],
      targetList: [
        { targetType: 'VOD' as const, targetId: 3 },
        { targetType: 'CHALLENGE' as const, targetId: 1 },
      ],
    };
    expect(toSectionInput(d).targetList).toEqual(d.targetList);
    expect(describeCondition(d, titleOf)).toBe('태그 조건 없음');
    expect(
      fromSection({
        id: 1,
        title: 's',
        tagIds: [],
        targetTypes: [],
        sortOrder: 0,
        isVisible: true,
        targetList: [{ targetType: 'BLOG', targetId: 5 }],
      }).targetList,
    ).toEqual([{ targetType: 'BLOG', targetId: 5 }]);
  });
});
