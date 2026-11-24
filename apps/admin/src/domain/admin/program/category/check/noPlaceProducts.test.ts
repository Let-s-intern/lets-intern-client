import { describe, expect, it } from 'vitest';
import type { AutoTagProduct } from '../hooks/useAllProducts';
import { editPathOf, productsWithoutPlaceOf } from './noPlaceProducts';
import type { ProductPlaces } from './productPlaces';

const now = new Date('2026-11-24T12:00:00');

const product = (over: Partial<AutoTagProduct>): AutoTagProduct => ({
  targetType: 'CHALLENGE',
  targetId: 1,
  title: '상품',
  input: { title: '상품' },
  tagIds: [],
  isVisible: true,
  endDate: null,
  ...over,
});

const placed = (targetType: string, targetId: number): ProductPlaces => ({
  key: `${targetType}-${targetId}`,
  targetType,
  targetId,
  title: '상품',
  places: [
    {
      label: '필터 서류 > 이력서',
      visual: { kind: 'filter', tagId: 10 },
    },
  ],
});

const run = (
  products: AutoTagProduct[],
  places: ProductPlaces[] = [],
  includeEnded = false,
) => productsWithoutPlaceOf({ products, places, includeEnded, now });

describe('productsWithoutPlaceOf', () => {
  it('노출이면서 태그가 없고 위치도 없으면 태그 없음으로 낸다', () => {
    expect(run([product({ targetId: 1, title: '태그 없는 챌린지' })])).toEqual([
      {
        key: 'CHALLENGE-1',
        targetType: 'CHALLENGE',
        targetId: 1,
        title: '태그 없는 챌린지',
        reason: 'NO_TAG',
        editPath: '/challenge/1/edit',
      },
    ]);
  });

  it('태그는 있는데 위치가 없으면(숨긴 분류에만 붙음) 노출 자리 없음으로 낸다', () => {
    const [row] = run([
      product({ targetType: 'VOD', targetId: 4, tagIds: [9] }),
    ]);
    expect(row.reason).toBe('NO_PLACE');
    expect(row.editPath).toBe('/vod/4/edit');
  });

  it('노출 위치가 있으면 뺀다', () => {
    expect(
      run([product({ targetId: 1, tagIds: [10] })], [placed('CHALLENGE', 1)]),
    ).toEqual([]);
  });

  it('같은 번호라도 유형이 다르면 다른 상품이다', () => {
    const rows = run(
      [product({ targetType: 'VOD', targetId: 1 })],
      [placed('CHALLENGE', 1)],
    );
    expect(rows.map((r) => r.key)).toEqual(['VOD-1']);
  });

  it('노출이 꺼진 상품은 뺀다', () => {
    expect(run([product({ isVisible: false })])).toEqual([]);
  });

  it('isVisible 값이 없는 옛 응답은 넣지 않는다', () => {
    expect(
      run([product({ isVisible: undefined }), product({ isVisible: null })]),
    ).toEqual([]);
  });

  it('종료된 상품은 기본으로 빼고, 종료 포함이면 넣는다', () => {
    const ended = product({ targetId: 2, endDate: '2026-11-01T00:00:00' });
    const going = product({ targetId: 3, endDate: '2026-12-01T00:00:00' });
    const noEnd = product({ targetId: 4, endDate: null });

    expect(run([ended, going, noEnd]).map((r) => r.targetId)).toEqual([3, 4]);
    expect(run([ended, going, noEnd], [], true).map((r) => r.targetId)).toEqual(
      [2, 3, 4],
    );
  });

  it('점검 대상이 아닌 유형은 뺀다', () => {
    expect(
      run([
        product({ targetType: 'MAGNET', targetId: 1 }),
        product({ targetType: 'BLOG', targetId: 2 }),
        product({ targetType: 'LIVE_MENTORING', targetId: 3 }),
      ]),
    ).toEqual([]);
  });

  it('LIVE 와 멤버십, 가이드북을 대상으로 한다', () => {
    expect(
      run([
        product({ targetType: 'LIVE', targetId: 5 }),
        product({ targetType: 'MEMBERSHIP', targetId: 6 }),
        product({ targetType: 'GUIDEBOOK', targetId: 7 }),
      ]).map((r) => r.key),
    ).toEqual(['LIVE-5', 'MEMBERSHIP-6', 'GUIDEBOOK-7']);
  });
});

describe('editPathOf', () => {
  it('router.tsx 의 수정 화면 경로를 유형별로 낸다', () => {
    expect(editPathOf('CHALLENGE', 1)).toBe('/challenge/1/edit');
    expect(editPathOf('LIVE', 2)).toBe('/live/2/edit');
    expect(editPathOf('VOD', 3)).toBe('/vod/3/edit');
    expect(editPathOf('GUIDEBOOK', 4)).toBe('/guidebook/4/edit');
    expect(editPathOf('MEMBERSHIP', 5)).toBe('/all-in-one-pass/5/edit');
    expect(editPathOf('BLOG', 6)).toBeNull();
  });
});
