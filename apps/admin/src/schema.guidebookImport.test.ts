import { describe, expect, it } from 'vitest';

import { getGuidebookIdSchema, guidebookImportSchema } from './schema';

// 수정 화면 Export 가 복사하는 GET /guidebook/{id} 응답 모양
const exported = {
  id: 6,
  title: '산업 트렌드 리포트',
  shortDesc: '한 줄 소개',
  thumbnail: 'https://example.com/thumb.png',
  desktopThumbnail: null,
  contentComposition: '구성',
  accessMethod: '이용 방법',
  recommendedFor: '추천 대상',
  description: '<p>상세</p>',
  job: '마케팅',
  contentUrl: 'https://example.com/content',
  contentFileUrl: null,
  price: 990,
  discount: 0,
  guideBookPriceType: 'CHARGE',
  programTypeInfo: [{ programClassification: 'CAREER_SEARCH' }],
  adminClassificationInfo: [{ programAdminClassification: 'B2C' }],
};

describe('guidebookImportSchema', () => {
  it('id 가 없는 JSON 을 받는다', () => {
    const { id: _id, ...withoutId } = exported;
    expect(guidebookImportSchema.safeParse(withoutId).success).toBe(true);
  });

  it('실제 Export 모양을 그대로 받는다', () => {
    expect(guidebookImportSchema.safeParse(exported).success).toBe(true);
  });

  it('id 가 있으면 숫자여야 한다', () => {
    expect(
      guidebookImportSchema.safeParse({ ...exported, id: '6' }).success,
    ).toBe(false);
  });

  it('guideBookPriceType 이 CHARGE / FREE 가 아니면 거절한다', () => {
    const result = guidebookImportSchema.safeParse({
      ...exported,
      guideBookPriceType: 'PAID',
    });
    expect(result.success).toBe(false);
  });

  it('price 가 문자열이면 거절한다', () => {
    const result = guidebookImportSchema.safeParse({
      ...exported,
      price: '990',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['price']);
    }
  });

  it('수정 화면이 쓰는 getGuidebookIdSchema 는 여전히 id 를 요구한다', () => {
    const { id: _id, ...withoutId } = exported;
    expect(getGuidebookIdSchema.safeParse(withoutId).success).toBe(false);
  });
});
