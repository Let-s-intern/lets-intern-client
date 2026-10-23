import { describe, expect, it } from 'vitest';

import { companyLogoListSchema } from '../companyLogoSchema';

describe('companyLogoListSchema', () => {
  it('목록 응답을 파싱한다', () => {
    const parsed = companyLogoListSchema.parse({
      companyLogoList: [
        { id: 1, name: '렛츠커리어', imageUrl: 'https://cdn.test/logo.png' },
      ],
    });
    expect(parsed.companyLogoList[0].name).toBe('렛츠커리어');
  });

  it('빈 목록을 파싱한다', () => {
    expect(
      companyLogoListSchema.parse({ companyLogoList: [] }).companyLogoList,
    ).toEqual([]);
  });

  it('이미지 주소가 없으면 실패한다', () => {
    expect(() =>
      companyLogoListSchema.parse({
        companyLogoList: [{ id: 1, name: '렛츠커리어' }],
      }),
    ).toThrow();
  });
});
