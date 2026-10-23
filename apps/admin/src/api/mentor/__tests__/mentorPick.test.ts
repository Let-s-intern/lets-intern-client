import { describe, expect, it } from 'vitest';

import { adminMentorPickListSchema } from '../mentorSchema';

describe('adminMentorPickListSchema', () => {
  it('픽 목록을 파싱한다. 닉네임·공개 여부는 null 일 수 있다', () => {
    const parsed = adminMentorPickListSchema.parse({
      pickList: [
        {
          mentorId: 1,
          name: '김멘토',
          nickname: null,
          isVisible: null,
          sortOrder: 1,
        },
      ],
    });
    expect(parsed.pickList[0].mentorId).toBe(1);
  });

  it('mentorId 가 없으면 실패한다', () => {
    expect(() =>
      adminMentorPickListSchema.parse({
        pickList: [
          { name: '김멘토', nickname: null, isVisible: true, sortOrder: 1 },
        ],
      }),
    ).toThrow();
  });
});
