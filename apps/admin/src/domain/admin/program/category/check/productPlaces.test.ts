import { describe, expect, it, vi } from 'vitest';
import type {
  ProgramCategoryGroup,
  ProgramCategoryLanding,
} from '../programCategoryApi';
import { tagsOf } from '../utils/tagUtils';
import { productPlacesOf } from './productPlaces';

vi.mock('@/utils/axios', () => ({ default: {} }));

const groups: ProgramCategoryGroup[] = [
  {
    id: 1,
    title: '서류',
    sortOrder: 0,
    isVisible: true,
    categoryList: [
      {
        id: 10,
        title: '이력서',
        sortOrder: 0,
        isVisible: true,
        programCount: 1,
        slug: 'resume',
      },
      {
        id: 11,
        title: '포트폴리오',
        sortOrder: 1,
        isVisible: true,
        programCount: 1,
      },
    ],
  },
];

describe('productPlacesOf', () => {
  it('랜딩 섹션과 필터 버튼 위치를 모으고, 누르면 그 상품을 짚는 화면으로 간다', () => {
    const landing = {
      page: { id: 10, title: '이력서', slug: 'resume' },
      sectionList: [
        {
          id: 100,
          title: '대표 챌린지',
          displayType: 'FEATURED',
          targetList: [
            {
              targetType: 'CHALLENGE',
              targetId: 7,
              title: 'A 챌린지',
              categoryIds: [10],
            },
          ],
        },
      ],
    } as ProgramCategoryLanding;
    const places = productPlacesOf(
      tagsOf(groups),
      new Map([['resume', landing]]),
      [
        {
          targetType: 'CHALLENGE',
          targetId: 7,
          title: 'A 챌린지',
          categoryIds: [10, 11],
        },
      ],
    );
    expect(places).toHaveLength(1);
    expect(places[0].places.map((p) => p.label)).toEqual([
      '/category/resume 1. 대표 챌린지',
      '필터 서류 > 이력서',
      '필터 서류 > 포트폴리오',
    ]);
    expect(places[0].places[0].visual).toEqual({
      kind: 'landing',
      tagId: 10,
      highlight: {
        sectionId: 100,
        target: { targetType: 'CHALLENGE', targetId: 7 },
      },
    });
    expect(places[0].places[2].visual).toMatchObject({
      kind: 'filter',
      tagId: 11,
    });
  });
});
