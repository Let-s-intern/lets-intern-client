import { describe, expect, it } from 'vitest';

import {
  companyLogoFaviconCandidatesSchema,
  companyLogoListSchema,
} from '../companyLogoSchema';

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

describe('companyLogoFaviconCandidatesSchema', () => {
  it('후보 목록을 파싱한다. 크기는 null 일 수 있다', () => {
    const { candidates } = companyLogoFaviconCandidatesSchema.parse({
      candidates: [
        {
          url: 'https://toss.test/favicon.ico',
          format: 'ICO',
          width: null,
          height: null,
          byteSize: 1000,
          source: 'FAVICON_ICO',
        },
      ],
    });
    expect(candidates[0].width).toBeNull();
  });
});
