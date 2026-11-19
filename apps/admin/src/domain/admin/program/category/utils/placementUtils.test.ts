import { describe, expect, it } from 'vitest';
import type {
  ProgramCategory,
  ProgramCategoryGroup,
} from '../programCategoryApi';
import {
  draftsAppended,
  draftsWith,
  draftsWithout,
  filterRowsOf,
  isDraftInvalid,
  landingPagesOf,
  menuDestinationOf,
  menuEntriesTo,
  moveAmong,
  productExposuresOf,
  slugError,
  toPlacementInput,
} from './placementUtils';

const category = (
  id: number,
  title: string,
  extra: Partial<ProgramCategory> = {},
): ProgramCategory => ({
  id,
  title,
  sortOrder: 0,
  isVisible: true,
  programCount: 0,
  ...extra,
});

const resumeLanding: ProgramCategoryGroup = {
  id: 1,
  title: '이력서 랜딩',
  sortOrder: 0,
  isVisible: true,
  placements: [
    { id: 11, placementType: 'LANDING', slug: 'resume', mergeChallenges: true },
    {
      id: 12,
      placementType: 'PROGRAM_FILTER',
      mergeChallenges: false,
      matchMode: 'ALL',
    },
  ],
  categoryList: [category(101, '챌린지'), category(102, '클래스')],
};

const docFilter: ProgramCategoryGroup = {
  id: 2,
  title: '서류',
  sortOrder: 1,
  isVisible: true,
  placements: [{ id: 21, placementType: 'PROGRAM_FILTER', matchMode: 'ANY' }],
  categoryList: [
    category(201, '이력서', { slug: 'resume' }),
    category(202, '면접', {
      slug: 'interview',
      directTargetType: 'CHALLENGE',
      directTargetId: 7,
    }),
  ],
};

const groups = [resumeLanding, docFilter];

describe('slugError', () => {
  it('비어 있거나 규칙에 맞으면 오류가 없다', () => {
    expect(slugError('')).toBeUndefined();
    expect(slugError('large-corp')).toBeUndefined();
  });
  it('대문자·밑줄·끝 하이픈은 오류다', () => {
    expect(slugError('Resume')).toBeDefined();
    expect(slugError('a_b')).toBeDefined();
    expect(slugError('a-')).toBeDefined();
  });
});

describe('노출 위치 저장 요청', () => {
  it('하나만 고쳐도 나머지 위치를 그대로 다시 보낸다', () => {
    const drafts = draftsWith(resumeLanding, 0, { slug: 'cv' });
    expect(drafts.map(toPlacementInput)).toEqual([
      {
        placementType: 'LANDING',
        slug: 'cv',
        mergeChallenges: true,
        matchMode: undefined,
      },
      {
        placementType: 'PROGRAM_FILTER',
        slug: undefined,
        mergeChallenges: false,
        matchMode: 'ALL',
      },
    ]);
  });

  it('지우면 그 자리만 빠지고, 추가하면 뒤에 붙는다', () => {
    expect(draftsWithout(resumeLanding, 0)).toHaveLength(1);
    expect(draftsWithout(resumeLanding, 0)[0].placementType).toBe(
      'PROGRAM_FILTER',
    );
    const appended = draftsAppended(docFilter, {
      placementType: 'LANDING',
      slug: 'doc',
      mergeChallenges: true,
      matchMode: 'ANY',
    });
    expect(appended.map((d) => d.placementType)).toEqual([
      'PROGRAM_FILTER',
      'LANDING',
    ]);
  });

  it('mergeChallenges 가 없으면 묶기(true), matchMode 가 GROUP 이면 ANY 로 읽는다', () => {
    const [draft] = draftsWith(
      {
        ...docFilter,
        placements: [{ placementType: 'PROGRAM_FILTER', matchMode: 'GROUP' }],
      },
      -1,
      {},
    );
    expect(draft.mergeChallenges).toBe(true);
    expect(draft.matchMode).toBe('ANY');
  });

  it('랜딩은 주소가 비었거나 규칙에 어긋나면 저장할 수 없다', () => {
    const base = {
      placementType: 'LANDING' as const,
      mergeChallenges: true,
      matchMode: 'ANY' as const,
    };
    expect(isDraftInvalid({ ...base, slug: '' })).toBe(true);
    expect(isDraftInvalid({ ...base, slug: 'Bad' })).toBe(true);
    expect(isDraftInvalid({ ...base, slug: 'ok' })).toBe(false);
    expect(
      isDraftInvalid({ ...base, placementType: 'PROGRAM_FILTER', slug: '' }),
    ).toBe(false);
  });
});

describe('탭별 목록', () => {
  it('랜딩 페이지와 필터 줄을 노출 위치 자리와 함께 꺼낸다', () => {
    expect(
      landingPagesOf(groups).map((p) => [p.group.id, p.placementIndex, p.slug]),
    ).toEqual([[1, 0, 'resume']]);
    expect(
      filterRowsOf(groups).map((r) => [
        r.group.id,
        r.placementIndex,
        r.matchMode,
        r.mergeChallenges,
      ]),
    ).toEqual([
      [1, 1, 'ALL', false],
      [2, 0, 'ANY', true],
    ]);
  });
});

describe('메뉴 목적지', () => {
  it('바로 이동 상품이 있으면 상세, 같은 주소 랜딩이 있으면 랜딩, 없으면 준비 중', () => {
    expect(menuDestinationOf(groups, 'interview')).toEqual({
      kind: 'direct',
      targetType: 'CHALLENGE',
      targetId: 7,
    });
    expect(menuDestinationOf(groups, 'resume').kind).toBe('landing');
    expect(menuDestinationOf(groups, 'hr').kind).toBe('missing');
  });

  it('숨긴 목록의 랜딩은 목적지가 아니다', () => {
    const hidden = [{ ...resumeLanding, isVisible: false }, docFilter];
    expect(menuDestinationOf(hidden, 'resume').kind).toBe('missing');
  });

  it('랜딩으로 들어오는 GNB·홈 항목을 찾는다', () => {
    expect(menuEntriesTo(groups, 'resume')).toEqual(['서류 작성 › 이력서']);
    expect(menuEntriesTo(groups, 'interview')).toEqual([]);
  });
});

describe('moveAmong', () => {
  it('보이는 목록 안의 이웃과만 자리를 바꾼다', () => {
    expect(moveAmong([1, 2, 3, 4], [1, 3, 4], 3, -1)).toEqual([3, 2, 1, 4]);
    expect(moveAmong([1, 2, 3, 4], [1, 3, 4], 3, 1)).toEqual([1, 2, 4, 3]);
  });
  it('끝에서 더 가면 그대로다', () => {
    expect(moveAmong([1, 2], [1, 2], 1, -1)).toEqual([1, 2]);
  });
});

describe('productExposuresOf', () => {
  it('상품마다 노출되는 페이지·섹션·필터 버튼을 모은다', () => {
    const result = productExposuresOf(groups, [
      {
        targetType: 'CHALLENGE',
        targetId: 7,
        title: '이력서 챌린지',
        categoryIds: [101, 201],
      },
      {
        targetType: 'LIVE',
        targetId: 3,
        title: '가 클래스',
        categoryIds: [102],
      },
    ]);
    expect(result.map((r) => r.title)).toEqual(['가 클래스', '이력서 챌린지']);
    expect(result[1].places).toEqual([
      '/category/resume › 챌린지',
      '전체 프로그램 필터 › 이력서 랜딩 › 챌린지',
      '전체 프로그램 필터 › 서류 › 이력서',
    ]);
  });
});
