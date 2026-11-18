import type {
  ProgramCategoryTarget,
  PublicProgramCategoryGroup,
} from '@/api/program-category/programCategory';
import dayjs from '@/lib/dayjs';
import {
  filterCatalogTargets,
  getCatalogTitle,
  getRecruitStatus,
  parseCatalogQuery,
  toCatalogSearch,
} from './catalogFilter';

const groups: PublicProgramCategoryGroup[] = [
  {
    id: 1,
    title: '관심 직무',
    categoryList: [
      { id: 3, title: '마케팅', slug: 'marketing' },
      { id: 4, title: 'HR', slug: 'hr' },
    ],
  },
  {
    id: 2,
    title: '서류',
    categoryList: [{ id: 17, title: '대기업 자기소개서', slug: 'large-corp' }],
  },
];

const target = (
  targetType: ProgramCategoryTarget['targetType'],
  extra: Partial<ProgramCategoryTarget> = {},
): ProgramCategoryTarget => ({
  targetType,
  targetId: 1,
  title: 't',
  categoryIds: [1],
  ...extra,
});

const now = dayjs('2026-11-18T12:00:00');

describe('전체 프로그램 주소 필터', () => {
  it('없는 카테고리 id 는 버리고 유형은 하나만 받는다', () => {
    const q = parseCatalogQuery(
      new URLSearchParams('categoryId=3&categoryId=999&type=VOD'),
      groups,
    );
    expect(q).toEqual({ categoryIds: [3], type: 'VOD', status: null });
  });

  it('예전 jobCategory 링크를 노출 분류로 옮기고, 가이드북 유형은 무시한다', () => {
    const q = parseCatalogQuery(
      new URLSearchParams(
        'jobCategory=MARKETING&jobCategory=LARGE_COMPANY&type=GUIDEBOOK&classification=ONE',
      ),
      groups,
    );
    expect(q).toEqual({ categoryIds: [3, 17], type: null, status: null });
  });

  it('주소로 되돌린다', () => {
    expect(toCatalogSearch({ categoryIds: [3, 4], type: 'CHALLENGE' })).toBe(
      'categoryId=3&categoryId=4&type=CHALLENGE',
    );
  });
});

describe('전체 프로그램 목록', () => {
  it('가이드북·블로그는 빼고 모집 중 → 예정 → 상시 → 마감 순', () => {
    const closed = target('CHALLENGE', { targetId: 1, deadline: '2026-11-01' });
    const always = target('VOD', { targetId: 2 });
    const open = target('LIVE', {
      targetId: 3,
      beginning: '2026-11-10',
      deadline: '2026-11-30',
    });
    const upcoming = target('CHALLENGE', {
      targetId: 4,
      beginning: '2026-11-25',
      deadline: '2026-12-10',
    });
    const result = filterCatalogTargets(
      [closed, target('GUIDEBOOK'), always, target('BLOG'), open, upcoming],
      null,
      now,
    );
    expect(result.map((t) => t.targetId)).toEqual([3, 4, 2, 1]);
    expect(getRecruitStatus(upcoming, now)).toBe('UPCOMING');
  });

  it('올인원 패스는 모집 중이어도 맨 뒤', () => {
    const pass = target('MEMBERSHIP', {
      targetId: 9,
      beginning: '2026-11-01',
      deadline: '2026-12-01',
    });
    const closed = target('CHALLENGE', { targetId: 1, deadline: '2026-11-01' });
    expect(
      filterCatalogTargets([pass, closed], null, now).map((t) => t.targetId),
    ).toEqual([1, 9]);
  });

  it('모집 상태: 모집 중은 상시 상품 포함, 예전 주소 값을 받는다', () => {
    const open = target('LIVE', {
      targetId: 1,
      beginning: '2026-11-10',
      deadline: '2026-11-30',
    });
    const always = target('VOD', { targetId: 2 });
    const closed = target('CHALLENGE', { targetId: 3, deadline: '2026-11-01' });
    const ids = (status: 'PROCEEDING' | 'PREV' | 'POST') =>
      filterCatalogTargets([open, always, closed], null, now, status).map(
        (t) => t.targetId,
      );
    expect(ids('PROCEEDING')).toEqual([1, 2]);
    expect(ids('POST')).toEqual([3]);
    expect(
      parseCatalogQuery(new URLSearchParams('status=PREV'), groups).status,
    ).toBe('PREV');
    expect(
      toCatalogSearch({ categoryIds: [], type: null, status: 'POST' }),
    ).toBe('status=POST');
  });

  it('유형을 고르면 그 유형만', () => {
    expect(
      filterCatalogTargets([target('VOD'), target('MAGNET')], 'MAGNET', now)
        .length,
    ).toBe(1);
  });

  it('챌린지 제목에서 버전·기수를 뗀다', () => {
    expect(
      getCatalogTitle(
        target('CHALLENGE', {
          title: '[대학생·무경력자 Ver.] 이력서 1주 완성 챌린지 27기',
        }),
      ),
    ).toBe('이력서 1주 완성 챌린지');
    expect(
      getCatalogTitle(target('VOD', { title: '[VOD] 면접 27기 특강' })),
    ).toBe('[VOD] 면접 27기 특강');
  });
});
