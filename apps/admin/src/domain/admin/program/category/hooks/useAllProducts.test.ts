import { describe, expect, it, vi } from 'vitest';

const get = vi.fn();
vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => get(...args) },
}));

import { fetchAllProducts } from './useAllProducts';

describe('fetchAllProducts', () => {
  it('설명·노출·종료일이 있는 응답을 상품과 입력으로 옮긴다', async () => {
    get.mockResolvedValueOnce({
      data: {
        data: {
          candidateList: [
            {
              targetType: 'CHALLENGE',
              targetId: 1,
              title: '챌린지',
              shortDesc: '자소서 완성',
              isVisible: true,
              endDate: '2026-12-31T23:59:59',
              tagIds: [3],
            },
          ],
        },
      },
    });

    const [product] = await fetchAllProducts();

    expect(product.input.description).toBe('자소서 완성');
    expect(product.isVisible).toBe(true);
    expect(product.endDate).toBe('2026-12-31T23:59:59');
    expect(product.tagIds).toEqual([3]);
  });

  it('새 필드가 없는 옛 응답도 파싱하고 값은 비워 둔다', async () => {
    get.mockResolvedValueOnce({
      data: {
        data: {
          candidateList: [
            { targetType: 'VOD', targetId: 2, title: 'VOD', tagIds: null },
          ],
        },
      },
    });

    const [product] = await fetchAllProducts();

    expect(product.input.description).toBeUndefined();
    expect(product.isVisible).toBeUndefined();
    expect(product.endDate).toBeUndefined();
    expect(product.tagIds).toEqual([]);
  });

  it('새 필드가 null 이어도 파싱한다', async () => {
    get.mockResolvedValueOnce({
      data: {
        data: {
          candidateList: [
            {
              targetType: 'LIVE',
              targetId: 3,
              title: '라이브',
              shortDesc: null,
              isVisible: null,
              endDate: null,
            },
          ],
        },
      },
    });

    const [product] = await fetchAllProducts();

    expect(product.input.description).toBeNull();
    expect(product.isVisible).toBeNull();
    expect(product.endDate).toBeNull();
  });
});
