import {
  challengeMentorGuideItemSchema,
  challengeMentorGuideListSchema,
  ChallengeScopeTypeEnum,
  MentorScopeTypeEnum,
} from '../challengeMentorGuideSchema';

describe('challengeMentorGuideItemSchema', () => {
  it('새 필드 포함된 응답을 파싱한다', () => {
    const data = {
      challengeMentorGuideId: 1,
      title: '공지 제목',
      link: 'https://example.com',
      contents: '## 마크다운 본문',
      challengeScopeType: 'ALL',
      mentorScopeType: 'ALL_MENTOR',
      challengeId: 10,
      challengeMentorId: 20,
      createDate: '2026-04-04T07:48:17.558Z',
      lastModifiedDate: '2026-04-04T07:48:17.558Z',
    };

    const result = challengeMentorGuideItemSchema.parse(data);
    expect(result.contents).toBe('## 마크다운 본문');
    expect(result.challengeScopeType).toBe('ALL');
    expect(result.mentorScopeType).toBe('ALL_MENTOR');
    expect(result.challengeId).toBe(10);
    expect(result.challengeMentorId).toBe(20);
  });

  it('새 필드가 null이어도 파싱한다', () => {
    const data = {
      challengeMentorGuideId: 2,
      title: '제목만',
      link: null,
      contents: null,
      challengeScopeType: null,
      mentorScopeType: null,
      challengeId: null,
      challengeMentorId: null,
      createDate: null,
      lastModifiedDate: null,
    };

    const result = challengeMentorGuideItemSchema.parse(data);
    expect(result.contents).toBeNull();
    expect(result.challengeScopeType).toBeNull();
    expect(result.challengeId).toBeNull();
  });

  it('새 필드가 없어도(기존 API 호환) 기본값으로 파싱한다', () => {
    const data = {
      challengeMentorGuideId: 3,
      title: '기존 형식',
      link: 'https://old.com',
      createDate: '2026-03-01T00:00:00Z',
      lastModifiedDate: '2026-03-01T00:00:00Z',
    };

    const result = challengeMentorGuideItemSchema.parse(data);
    expect(result.contents).toBeUndefined();
    expect(result.challengeScopeType).toBe('ALL');
    expect(result.mentorScopeType).toBe('ALL_MENTOR');
  });
});

describe('challengeMentorGuideListSchema', () => {
  it('목록 응답을 파싱한다', () => {
    const data = {
      challengeMentorGuideList: [
        {
          challengeMentorGuideId: 1,
          title: 'A',
          link: null,
          contents: '본문',
          challengeScopeType: 'SPECIFIC',
          mentorScopeType: 'SPECIFIC_MENTOR',
          challengeId: 5,
          challengeMentorId: 10,
          createDate: '2026-04-04T00:00:00Z',
          lastModifiedDate: '2026-04-04T00:00:00Z',
        },
      ],
    };

    const result = challengeMentorGuideListSchema.parse(data);
    expect(result.challengeMentorGuideList).toHaveLength(1);
    expect(result.challengeMentorGuideList[0].challengeScopeType).toBe(
      'SPECIFIC',
    );
  });
});

describe('Enum schemas', () => {
  it('ChallengeScopeType은 ALL, SPECIFIC만 허용', () => {
    expect(ChallengeScopeTypeEnum.parse('ALL')).toBe('ALL');
    expect(ChallengeScopeTypeEnum.parse('SPECIFIC')).toBe('SPECIFIC');
    expect(() => ChallengeScopeTypeEnum.parse('INVALID')).toThrow();
  });

  it('MentorScopeType은 ALL_MENTOR, SPECIFIC_MENTOR만 허용', () => {
    expect(MentorScopeTypeEnum.parse('ALL_MENTOR')).toBe('ALL_MENTOR');
    expect(MentorScopeTypeEnum.parse('SPECIFIC_MENTOR')).toBe(
      'SPECIFIC_MENTOR',
    );
    expect(() => MentorScopeTypeEnum.parse('INVALID')).toThrow();
  });
});
